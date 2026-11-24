'use client';

import { useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';

const INPUT =
  'mt-2 h-12 w-full border bg-paper px-4 text-[15px] text-ink placeholder:text-muted/60 focus:outline-none disabled:opacity-60';

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  readOnly?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
};

export function TextField({ label, name, type = 'text', error, hint, required = true, ...rest }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {!required && !rest.readOnly && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${INPUT} ${error ? 'border-brand' : 'border-line focus:border-ink'} ${rest.readOnly ? 'bg-panel text-muted' : ''}`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-brand">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({ label, name, autoComplete = 'current-password', error, hint, required = true }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${INPUT} pr-12 ${error ? 'border-brand' : 'border-line focus:border-ink'}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center text-muted hover:text-ink"
        >
          {visible ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-brand">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Primary submit button that shows progress while its form's action is running. */
export function SubmitButton({ children, pending: pendingLabel, tone = 'brand' }: { children: React.ReactNode; pending: string; tone?: 'brand' | 'ink' | 'danger' }) {
  const { pending } = useFormStatus();
  const tones = {
    brand: 'btn-fill btn-brand bg-brand text-white',
    ink: 'btn-fill btn-accent bg-ink text-paper',
    danger: 'btn-fill btn-brand border border-brand bg-paper text-brand [--fill-fg:#fff]',
  };
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex h-12 w-full items-center justify-center text-sm font-medium disabled:cursor-wait disabled:opacity-70 ${tones[tone]}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Form-level message: error (burgundy rule) or success (sage). */
export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`border-l-2 px-4 py-3 text-sm ${error ? 'border-brand bg-brand/5 text-ink' : 'border-sage-line bg-sage-100 text-ink'}`}
    >
      {error ?? success}
    </p>
  );
}

export function GoogleButton({ href, label = 'Continue with Google' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="btn-fill btn-ink flex h-12 w-full items-center justify-center gap-3 border border-line bg-paper text-sm font-medium"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      {label}
    </a>
  );
}

export function OrDivider() {
  return (
    <div className="my-8 flex items-center gap-4 text-xs text-muted" aria-hidden>
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
