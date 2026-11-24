'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { signUpAction, type FormState } from '@/app/actions/account';
import { FormMessage, GoogleButton, OrDivider, PasswordField, SubmitButton, TextField } from './fields';
import { googleHref, type SignUpRole } from './forms';
import SignUpFrame, { SIGN_UP_TOTAL_STEPS } from './SignUpFrame';




type Values = { name: string; email: string; phone: string; password: string; confirm: string; ref: string };
type Field = keyof Values;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

/** Same rules as the server (app/actions/account.ts), checked before moving on so errors show on the right step. */
function check(field: Field, v: Values): string | undefined {
  switch (field) {
    case 'name':
      return v.name.trim().length < 2 ? 'Enter your full name.' : undefined;
    case 'email':
      return EMAIL_RE.test(v.email.trim()) ? undefined : 'Enter a valid email address.';
    case 'phone':
      return PHONE_RE.test(v.phone.trim()) ? undefined : 'Enter a valid phone number, for example +234 801 234 5678.';
    case 'password':
      if (v.password.length < 8) return 'Use at least 8 characters.';
      if (!/[A-Za-z]/.test(v.password)) return 'Include at least one letter.';
      if (!/[0-9]/.test(v.password)) return 'Include at least one number.';
      return undefined;
    case 'confirm':
      return v.confirm === v.password ? undefined : 'Passwords do not match.';
    default:
      return undefined;
  }
}

type Props = { role: SignUpRole; google: boolean; next?: string; refCode?: string; backHref: string };

export function SignUpSteps({ role, google, next, refCode, backHref }: Props) {
  const [state, action] = useActionState(signUpAction, {} as FormState);
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    ref: refCode ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'back'>('next');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const moved = useRef(false);

  const STEPS: { title: string; lede: string; fields: Field[] }[] = [
    { title: 'What’s your name?', lede: 'Your full name, as it appears on your ID. We use it on your documents.', fields: ['name'] },
    { title: 'How can we reach you?', lede: 'We send your confirmation link by email, and our team may call about properties you ask after.', fields: ['email', 'phone'] },
    { title: 'Create a password', lede: 'At least 8 characters, with a letter and a number.', fields: ['password', 'confirm'] },
    role === 'realtor'
      ? { title: 'Were you invited by a realtor?', lede: 'If another realtor brought you in, add their code to join their team. Otherwise, skip it.', fields: ['ref'] }
      : { title: 'Did a realtor invite you?', lede: 'If a realtor told you about us, add their code so they are credited. Otherwise, skip it.', fields: ['ref'] },
  ];
  const last = STEPS.length - 1;

  // A server response (e.g. "email already used") reopens the first step with a problem. Adjusting
  // state during render, rather than in an effect, is React's pattern for deriving from new props.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    const fields = (state.fields ?? {}) as Partial<Record<Field, string>>;
    setErrors(fields);
    const firstBad = STEPS.findIndex((s) => s.fields.some((f) => fields[f]));
    if (firstBad >= 0 && firstBad !== step) {
      setDirection('back');
      setStep(firstBad);
    }
  }

  // Move focus to the new step's first field (not on first load, so phones don't pop the keyboard).
  useEffect(() => {
    if (!moved.current) return;
    stepRefs.current[step]?.querySelector<HTMLInputElement>('input:not([type=hidden])')?.focus();
  }, [step]);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const goNext = () => {
    const found: Partial<Record<Field, string>> = {};
    for (const f of STEPS[step].fields) {
      const msg = check(f, values);
      if (msg) found[f] = msg;
    }
    if (Object.keys(found).length) {
      setErrors((e) => ({ ...e, ...found }));
      // Wait for the error state to render, then put the cursor on the first field to fix.
      const current = stepRefs.current[step];
      requestAnimationFrame(() => current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    moved.current = true;
    setDirection('next');
    setStep((s) => Math.min(s + 1, last));
  };

  const goBack = () => {
    moved.current = true;
    setDirection('back');
    setStep((s) => Math.max(s - 1, 0));
  };

  const backControl =
    step === 0 ? (
      <Link
        href={backHref}
        aria-label="Back to account type"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:border-ink"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
      </Link>
    ) : (
      <button
        type="button"
        onClick={goBack}
        aria-label="Previous step"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:border-ink"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
      </button>
    );

  return (
    <SignUpFrame
      step={step + 2}
      total={SIGN_UP_TOTAL_STEPS}
      back={backControl}
      title={STEPS[step].title}
      lede={STEPS[step].lede}
      stepKey={step}
      direction={direction}
    >
      {step === 0 && google && (
        <>
          <GoogleButton href={googleHref(next, undefined, role)} label="Continue with Google" />
          <OrDivider />
        </>
      )}

      <form
        action={action}
        noValidate
        onKeyDown={(e) => {
          // Enter moves to the next step instead of submitting half the form.
          if (e.key === 'Enter' && step < last && (e.target as HTMLElement).tagName === 'INPUT') {
            e.preventDefault();
            goNext();
          }
        }}
        className="space-y-6"
      >
        <input type="hidden" name="role" value={role} />
        {state.error && <FormMessage error={state.error} />}

        {/* Every step stays in the form (hidden ones too), so one submit sends all of it. */}
        <div ref={(el) => { stepRefs.current[0] = el; }} hidden={step !== 0} className={direction === 'back' ? 'step-in-back' : 'step-in-next'}>
          <TextField large label="Full name" name="name" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
        </div>

        <div ref={(el) => { stepRefs.current[1] = el; }} hidden={step !== 1} className={`space-y-5 ${direction === 'back' ? 'step-in-back' : 'step-in-next'}`}>
          <TextField large label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
          <TextField
            large
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+234"
            value={values.phone}
            onChange={set('phone')}
            error={errors.phone}
          />
        </div>

        <div ref={(el) => { stepRefs.current[2] = el; }} hidden={step !== 2} className={`space-y-5 ${direction === 'back' ? 'step-in-back' : 'step-in-next'}`}>
          <PasswordField large label="Password" name="password" autoComplete="new-password" value={values.password} onChange={set('password')} error={errors.password} />
          <PasswordField large label="Confirm password" name="confirm" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
        </div>

        <div ref={(el) => { stepRefs.current[3] = el; }} hidden={step !== 3} className={`space-y-5 ${direction === 'back' ? 'step-in-back' : 'step-in-next'}`}>
          <TextField
            large
            label="Realtor referral code"
            name="ref"
            required={false}
            autoComplete="off"
            placeholder="e.g. ADA7K2X"
            value={values.ref}
            onChange={set('ref')}
            error={errors.ref}
            hint={refCode ? 'Added from your realtor’s invite link.' : undefined}
          />
        </div>

        {step < last ? (
          <button
            type="button"
            onClick={goNext}
            className="btn-fill btn-brand flex h-14 w-full items-center justify-center bg-brand text-base font-medium text-white"
          >
            Continue
          </button>
        ) : (
          <div className="space-y-4">
            <SubmitButton pending="Creating your account…">{values.ref.trim() ? 'Create account' : 'Skip and create account'}</SubmitButton>
            <p className="text-center text-xs leading-relaxed text-muted">
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
          </div>
        )}
      </form>
    </SignUpFrame>
  );
}

/** Reads ?ref and ?next on the client so the page itself can stay static. */
export function SignUpStepsFromUrl({ role, google }: { role: SignUpRole; google: boolean }) {
  const q = useSearchParams();
  const next = q.get('next') ?? undefined;
  const refCode = q.get('ref')?.toUpperCase() ?? undefined;
  const carry = new URLSearchParams();
  if (refCode) carry.set('ref', refCode);
  if (next) carry.set('next', next);
  const backHref = `/sign-up${carry.toString() ? `?${carry}` : ''}`;
  return <SignUpSteps role={role} google={google} next={next} refCode={refCode} backHref={backHref} />;
}
