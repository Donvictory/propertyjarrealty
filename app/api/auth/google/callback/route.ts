import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { exchangeGoogleCode, googleConfigured, OAUTH_COOKIE } from '@/lib/google-oauth';
import {
  createUser,
  EmailTakenError,
  getUserByEmail,
  getUserByGoogleId,
  resolveReferralCode,
  setSavedProperty,
  updateUser,
  type UserRecord,
} from '@/lib/users';
import { createUserSession, safeNext } from '@/lib/user-session';
import { REF_COOKIE } from '@/lib/referral-cookie';

function fail(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/sign-in?notice=google-failed', req.nextUrl));
  res.cookies.delete({ name: OAUTH_COOKIE, path: '/api/auth/google' });
  return res;
}

function sameState(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Google sends the user back here. Find or create the account, sign in, return to where they started. */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) return fail(req);

  let stored: { state?: string; next?: string; save?: string; role?: string } = {};
  try {
    stored = JSON.parse(req.cookies.get(OAUTH_COOKIE)?.value ?? '{}');
  } catch {
    return fail(req);
  }
  const state = req.nextUrl.searchParams.get('state') ?? '';
  const code = req.nextUrl.searchParams.get('code');
  if (!code || !stored.state || !sameState(state, stored.state)) return fail(req);

  let user: UserRecord | null;
  let usedReferral = false;
  try {
    const profile = await exchangeGoogleCode(req.nextUrl.origin, code);
    if (!profile.emailVerified) return fail(req);

    user = await getUserByGoogleId(profile.sub);
    if (!user) {
      const byEmail = await getUserByEmail(profile.email);
      if (byEmail) {
        // Same verified email: link Google to the existing account.
        user = await updateUser(byEmail.id, { googleId: profile.sub, emailVerified: true });
      } else {
        // Brand-new account: credit the referrer from the link they arrived through, if any.
        const referredBy = await resolveReferralCode(req.cookies.get(REF_COOKIE)?.value).catch(() => null);
        usedReferral = Boolean(referredBy);
        try {
          user = await createUser({
            referredBy,
            // Only applies to brand-new accounts; existing ones keep their role.
            role: stored.role === 'realtor' ? 'realtor' : 'client',
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            phone: '',
            passwordHash: null,
            googleId: profile.sub,
            emailVerified: true,
          });
        } catch (err) {
          if (!(err instanceof EmailTakenError)) throw err;
          user = await getUserByEmail(profile.email);
        }
      }
    }
  } catch (err) {
    console.error('[google callback]', err);
    return fail(req);
  }
  if (!user) return fail(req);

  await createUserSession(user);
  if (stored.save && /^[A-Za-z0-9_-]{1,80}$/.test(stored.save)) {
    await setSavedProperty(user.id, stored.save, true).catch(() => {});
  }

  // New Google accounts have no phone yet: send them to add one.
  const target = user.phone ? safeNext(stored.next) : '/account?notice=add-phone';
  const res = NextResponse.redirect(new URL(target, req.nextUrl));
  res.cookies.delete({ name: OAUTH_COOKIE, path: '/api/auth/google' });
  if (usedReferral) res.cookies.delete(REF_COOKIE);
  return res;
}
