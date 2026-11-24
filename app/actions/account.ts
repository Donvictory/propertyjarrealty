'use server';

import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { REF_COOKIE } from '@/lib/referral-cookie';
import { requestOrigin } from '@/lib/site-origin';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/auth-email';
import {
  consumeToken,
  createToken,
  createUser,
  deleteUser,
  EmailTakenError,
  getUserByEmail,
  getUserById,
  resolveReferralCode,
  setSavedProperty,
  updateUser,
} from '@/lib/users';
import { createUserSession, deleteUserSession, getCurrentUser, safeNext } from '@/lib/user-session';

export type FormState = {
  error?: string;
  /** Field-level messages keyed by input name. */
  fields?: Record<string, string>;
  success?: string;
  /** Set when sign-in is refused because the email isn't verified yet. */
  unverifiedEmail?: string;
  /**
   * What the user typed (never passwords). React 19 resets a form after its action runs, so the
   * forms use these as defaultValues to keep input after a validation error.
   */
  values?: Record<string, string>;
};

/** Echo back the non-secret fields of a submitted form. */
function keep(formData: FormData, names: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const n of names) {
    const v = formData.get(n);
    if (typeof v === 'string') out[n] = v.slice(0, 200);
  }
  return out;
}

const VERIFY_TTL = 24 * 60 * 60 * 1000;
const RESET_TTL = 60 * 60 * 1000;
// A real bcrypt hash, compared against when the email doesn't exist so timing doesn't reveal which emails are registered.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5dPzBo4Tl0Ss8sq0Fj2rGfDrkUvIr2.';

/* ---------- validation ---------- */

const email = z.string().trim().toLowerCase().email('Enter a valid email address.').max(200);
const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(200, 'Use 200 characters or fewer.')
  .regex(/[A-Za-z]/, 'Include at least one letter.')
  .regex(/[0-9]/, 'Include at least one number.');
const name = z.string().trim().min(2, 'Enter your full name.').max(80);
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number, for example +234 801 234 5678.');

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}

async function clientIp() {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/** In-memory, per server instance: a speed bump against brute force, not a hard guarantee on serverless. */
async function limited(bucket: string, limit: number, windowMs: number) {
  return !rateLimit(`${bucket}:${await clientIp()}`, limit, windowMs).allowed;
}

async function sendVerification(userId: string, to: string, displayName: string) {
  const token = await createToken(userId, 'verify', VERIFY_TTL);
  const url = `${await requestOrigin()}/api/auth/verify?token=${encodeURIComponent(token)}`;
  await sendVerificationEmail(to, displayName, url);
}

/* ---------- sign up / sign in / sign out ---------- */

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (await limited('signup', 5, 10 * 60 * 1000)) {
    return { error: 'Too many attempts. Please wait a few minutes and try again.' };
  }

  const parsed = z
    .object({ name, email, phone, password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match.' })
    .safeParse(Object.fromEntries(formData));
  const values = keep(formData, ['name', 'email', 'phone', 'ref']);
  if (!parsed.success) return { fields: fieldErrors(parsed.error), values };
  const v = parsed.data;

  // Referrer: a code typed in the form wins, otherwise the one remembered from a referral link.
  const cookieStore = await cookies();
  const typedRef = typeof formData.get('ref') === 'string' ? String(formData.get('ref')).trim() : '';
  const referredBy = await resolveReferralCode(typedRef || cookieStore.get(REF_COOKIE)?.value).catch(() => null);
  if (typedRef && !referredBy) {
    return { fields: { ref: 'That referral code doesn’t match a member. Check it, or leave it blank.' }, values };
  }

  let userId: string;
  try {
    const user = await createUser({
      email: v.email,
      name: v.name,
      phone: v.phone,
      passwordHash: await bcrypt.hash(v.password, 12),
      emailVerified: false,
      referredBy,
    });
    if (referredBy) cookieStore.delete(REF_COOKIE);
    userId = user.id;
  } catch (err) {
    if (err instanceof EmailTakenError) {
      return { fields: { email: 'An account with this email already exists. Sign in instead.' }, values };
    }
    console.error('[signUp]', err);
    return { error: 'We could not create your account. Please try again.', values };
  }

  try {
    await sendVerification(userId, v.email, v.name);
  } catch (err) {
    // The account exists; they can request another email from the check-email page.
    console.error('[signUp] verification email', err);
  }

  redirect(`/check-email?email=${encodeURIComponent(v.email)}`);
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (await limited('signin', 10, 10 * 60 * 1000)) {
    return { error: 'Too many sign-in attempts. Please wait a few minutes and try again.' };
  }

  const parsed = z.object({ email, password: z.string().min(1, 'Enter your password.') }).safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const values = keep(formData, ['email']);
  if (!parsed.success) return { fields: fieldErrors(parsed.error), values };

  const user = await getUserByEmail(parsed.data.email).catch(() => null);
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !ok) {
    if (user && !user.passwordHash && user.googleId) {
      return { error: 'This account uses Google. Choose "Continue with Google" to sign in.', values };
    }
    return { error: 'That email and password don’t match. Check them and try again.', values };
  }
  if (!user.emailVerified) {
    return { error: 'Confirm your email to sign in. Check your inbox for the link.', unverifiedEmail: user.email, values };
  }

  await createUserSession(user);

  // Coming from a heart button: save that property now that they're signed in.
  const save = formData.get('save');
  if (typeof save === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(save)) {
    await setSavedProperty(user.id, save, true).catch(() => {});
  }

  redirect(safeNext(formData.get('next')));
}

export async function signOutAction() {
  await deleteUserSession();
  redirect('/signed-out');
}

/* ---------- email verification / password reset ---------- */

/** Always answers the same way, so it can't be used to discover which emails have accounts. */
export async function resendVerificationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (await limited('resend', 3, 10 * 60 * 1000)) {
    return { error: 'Too many requests. Please wait a few minutes and try again.' };
  }
  const parsed = email.safeParse(formData.get('email'));
  if (!parsed.success) return { fields: { email: 'Enter a valid email address.' }, values: keep(formData, ['email']) };

  const user = await getUserByEmail(parsed.data).catch(() => null);
  if (user && !user.emailVerified) {
    await sendVerification(user.id, user.email, user.name).catch((err) => console.error('[resend]', err));
  }
  return { success: 'If that account is waiting for confirmation, a new link is on its way.' };
}

export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (await limited('forgot', 5, 10 * 60 * 1000)) {
    return { error: 'Too many requests. Please wait a few minutes and try again.' };
  }
  const parsed = email.safeParse(formData.get('email'));
  if (!parsed.success) return { fields: { email: 'Enter a valid email address.' }, values: keep(formData, ['email']) };

  const user = await getUserByEmail(parsed.data).catch(() => null);
  if (user) {
    try {
      const token = await createToken(user.id, 'reset', RESET_TTL);
      await sendPasswordResetEmail(user.email, `${await requestOrigin()}/reset-password?token=${encodeURIComponent(token)}`);
    } catch (err) {
      console.error('[forgot]', err);
    }
  }
  return { success: 'If an account exists for that email, we have sent a link to reset the password.' };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ token: z.string().min(10), password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match.' })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return fields.token ? { error: 'This reset link is invalid. Request a new one.' } : { fields };
  }

  const userId = await consumeToken(parsed.data.token, 'reset');
  if (!userId) return { error: 'This reset link has expired or was already used. Request a new one.' };

  const user = await updateUser(userId, {
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    // They proved they own the inbox.
    emailVerified: true,
    // Sign out anywhere the old password was used.
    bumpSessionVersion: true,
  });
  if (!user) return { error: 'This reset link is invalid. Request a new one.' };

  await createUserSession(user);
  redirect('/account?notice=password-reset');
}

/* ---------- account ---------- */

async function signedInUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in?next=/account');
  return user;
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await signedInUser();
  const values = keep(formData, ['name', 'phone']);
  const parsed = z.object({ name, phone }).safeParse({ name: formData.get('name'), phone: formData.get('phone') });
  if (!parsed.success) return { fields: fieldErrors(parsed.error), values };
  await updateUser(user.id, parsed.data);
  // The greeting in the account layout shows the name.
  revalidatePath('/account', 'layout');
  return { success: 'Your details are saved.', values: { name: parsed.data.name, phone: parsed.data.phone } };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await signedInUser();
  if (await limited('changepw', 5, 10 * 60 * 1000)) {
    return { error: 'Too many attempts. Please wait a few minutes and try again.' };
  }
  const parsed = z
    .object({ current: z.string(), password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match.' })
    .safeParse({ current: formData.get('current') ?? '', password: formData.get('password'), confirm: formData.get('confirm') });
  if (!parsed.success) return { fields: fieldErrors(parsed.error) };

  // Google-only accounts have no password yet: this sets one.
  if (user.passwordHash && !(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { fields: { current: 'That isn’t your current password.' } };
  }

  const updated = await updateUser(user.id, {
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    bumpSessionVersion: true,
  });
  // Other devices are now signed out; keep this one signed in.
  if (updated) await createUserSession(updated);
  return { success: user.passwordHash ? 'Password changed. Other devices have been signed out.' : 'Password set. You can now sign in with your email too.' };
}

export async function signOutEverywhereAction() {
  const user = await signedInUser();
  await updateUser(user.id, { bumpSessionVersion: true });
  await deleteUserSession();
  redirect('/signed-out?everywhere=1');
}

export async function deleteAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await signedInUser();
  if (formData.get('confirm') !== 'DELETE') {
    return { fields: { confirm: 'Type DELETE to confirm.' } };
  }
  if (user.passwordHash) {
    const pw = formData.get('password');
    if (typeof pw !== 'string' || !(await bcrypt.compare(pw, user.passwordHash))) {
      return { fields: { password: 'That isn’t your password.' } };
    }
  }

  const fresh = await getUserById(user.id);
  if (fresh) await deleteUser(fresh);
  await deleteUserSession();
  redirect('/signed-out?deleted=1');
}
