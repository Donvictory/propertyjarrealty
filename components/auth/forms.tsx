'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  forgotPasswordAction,
  resendVerificationAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
  type FormState,
} from '@/app/actions/account';
import { FormMessage, GoogleButton, OrDivider, PasswordField, SubmitButton, TextField } from './fields';

const INITIAL: FormState = {};
const PASSWORD_HINT = 'At least 8 characters, with a letter and a number.';

const NOTICES: Record<string, { error?: string; success?: string }> = {
  'verify-expired': { error: 'That confirmation link has expired or was already used. Sign in and we will send a new one.' },
  'google-failed': { error: 'Google sign-in didn’t finish. Try again, or use your email and password.' },
  'google-unavailable': { error: 'Google sign-in isn’t available right now. Use your email and password.' },
};

function googleHref(next?: string, save?: string) {
  const q = new URLSearchParams();
  if (next) q.set('next', next);
  if (save) q.set('save', save);
  const qs = q.toString();
  return `/api/auth/google${qs ? `?${qs}` : ''}`;
}

/* ---------------- sign in ---------------- */

type SignInProps = { next?: string; save?: string; notice?: string; google: boolean };

export function SignInForm({ next, save, notice, google }: SignInProps) {
  const [state, action] = useActionState(signInAction, INITIAL);
  const banner = NOTICES[notice ?? ''];

  return (
    <div className="space-y-6">
      {!state.error && banner && <FormMessage {...banner} />}
      {save && !state.error && (
        <FormMessage success="Sign in to save this property to your favourites." />
      )}

      {google && (
        <>
          <GoogleButton href={googleHref(next, save)} />
          <OrDivider />
        </>
      )}

      <form action={action} className="space-y-5" noValidate>
        <input type="hidden" name="next" value={next ?? ''} />
        <input type="hidden" name="save" value={save ?? ''} />
        <FormMessage error={state.error} />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.fields?.email}
        />
        <div>
          <PasswordField label="Password" name="password" error={state.fields?.password} />
          <Link href="/forgot-password" className="mt-3 inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Forgot your password?
          </Link>
        </div>
        <SubmitButton pending="Signing in…">Sign in</SubmitButton>
      </form>

      {state.unverifiedEmail && <ResendVerificationForm email={state.unverifiedEmail} compact />}
    </div>
  );
}

export function SignInFormFromUrl({ google }: { google: boolean }) {
  const q = useSearchParams();
  return (
    <SignInForm
      google={google}
      next={q.get('next') ?? undefined}
      save={q.get('save') ?? undefined}
      notice={q.get('notice') ?? undefined}
    />
  );
}

/* ---------------- sign up ---------------- */

export function SignUpForm({ next, google, refCode }: { next?: string; google: boolean; refCode?: string }) {
  const [state, action] = useActionState(signUpAction, INITIAL);
  const f = state.fields ?? {};

  return (
    <div className="space-y-6">
      {google && (
        <>
          <GoogleButton href={googleHref(next)} />
          <OrDivider />
        </>
      )}

      <form action={action} className="space-y-5" noValidate>
        <FormMessage error={state.error} />
        <TextField label="Full name" name="name" autoComplete="name" defaultValue={state.values?.name} error={f.name} />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={f.email}
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+234"
          defaultValue={state.values?.phone}
          error={f.phone}
          hint="So our team can reach you about properties you enquire on."
        />
        <PasswordField label="Password" name="password" autoComplete="new-password" error={f.password} hint={PASSWORD_HINT} />
        <PasswordField label="Confirm password" name="confirm" autoComplete="new-password" error={f.confirm} />
        <TextField
          label="Referral code"
          name="ref"
          required={false}
          autoComplete="off"
          placeholder="e.g. ADA7K2X"
          defaultValue={state.values?.ref ?? refCode}
          error={f.ref}
          hint={refCode ? 'Added from your invite link.' : 'If a member invited you, enter their code.'}
        />
        <SubmitButton pending="Creating your account…">Create account</SubmitButton>
        <p className="text-xs leading-relaxed text-muted">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-ink">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
            Privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

export function SignUpFormFromUrl({ google }: { google: boolean }) {
  const q = useSearchParams();
  return <SignUpForm google={google} next={q.get('next') ?? undefined} refCode={q.get('ref')?.toUpperCase() ?? undefined} />;
}

/* ---------------- verification ---------------- */

export function ResendVerificationForm({ email, compact = false }: { email?: string; compact?: boolean }) {
  const [state, action] = useActionState(resendVerificationAction, INITIAL);
  return (
    <form action={action} className={compact ? 'space-y-3 border-t border-line pt-6' : 'space-y-5'} noValidate>
      {compact && <p className="text-sm text-muted">Didn’t get the email?</p>}
      <FormMessage error={state.error} success={state.success} />
      {email ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.fields?.email}
        />
      )}
      <SubmitButton pending="Sending…" tone="ink">
        Send a new confirmation link
      </SubmitButton>
    </form>
  );
}

/* ---------------- forgot / reset ---------------- */

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, INITIAL);
  if (state.success) {
    return (
      <div className="space-y-6">
        <FormMessage success={state.success} />
        <p className="text-sm text-muted">The link expires in 1 hour. Check your spam folder if it doesn’t arrive in a few minutes.</p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage error={state.error} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.fields?.email}
      />
      <SubmitButton pending="Sending…">Send reset link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, INITIAL);
  if (!token) {
    return (
      <FormMessage error="This reset link is incomplete. Open the link from your email again, or request a new one." />
    );
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage error={state.error} />
      {state.error && (
        <Link href="/forgot-password" className="block text-sm text-brand underline underline-offset-4">
          Request a new reset link
        </Link>
      )}
      <PasswordField label="New password" name="password" autoComplete="new-password" error={state.fields?.password} hint={PASSWORD_HINT} />
      <PasswordField label="Confirm new password" name="confirm" autoComplete="new-password" error={state.fields?.confirm} />
      <SubmitButton pending="Saving…">Save new password</SubmitButton>
    </form>
  );
}

export function ResetPasswordFormFromUrl() {
  const q = useSearchParams();
  return <ResetPasswordForm token={q.get('token') ?? ''} />;
}
