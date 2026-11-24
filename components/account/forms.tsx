'use client';

import { useActionState, useState } from 'react';
import {
  changePasswordAction,
  deleteAccountAction,
  updateProfileAction,
  type FormState,
} from '@/app/actions/account';
import { FormMessage, PasswordField, SubmitButton, TextField } from '@/components/auth/fields';

const INITIAL: FormState = {};

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [state, action] = useActionState(updateProfileAction, INITIAL);
  const f = state.fields ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage error={state.error} success={state.success} />
      <TextField label="Full name" name="name" autoComplete="name" defaultValue={state.values?.name ?? name} error={f.name} />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+234"
        defaultValue={state.values?.phone ?? phone}
        error={f.phone}
      />
      <TextField
        label="Email"
        name="email-display"
        type="email"
        defaultValue={email}
        readOnly
        required={false}
        hint="Your email is your sign-in. Contact us if you need to change it."
      />
      <div className="max-w-xs">
        <SubmitButton pending="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action] = useActionState(changePasswordAction, INITIAL);
  const f = state.fields ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage error={state.error} success={state.success} />
      {hasPassword && <PasswordField label="Current password" name="current" error={f.current} />}
      <PasswordField
        label={hasPassword ? 'New password' : 'Password'}
        name="password"
        autoComplete="new-password"
        error={f.password}
        hint="At least 8 characters, with a letter and a number."
      />
      <PasswordField label="Confirm password" name="confirm" autoComplete="new-password" error={f.confirm} />
      <div className="max-w-xs">
        <SubmitButton pending="Saving…">{hasPassword ? 'Change password' : 'Set password'}</SubmitButton>
      </div>
    </form>
  );
}

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action] = useActionState(deleteAccountAction, INITIAL);
  const [open, setOpen] = useState(false);
  const f = state.fields ?? {};

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-fill btn-brand inline-flex h-12 items-center border border-brand px-6 text-sm font-medium text-brand [--fill-fg:#fff]"
      >
        Delete my account
      </button>
    );
  }

  return (
    <form action={action} className="space-y-5 border border-brand/40 p-5 sm:p-6" noValidate>
      <FormMessage error={state.error} />
      <p className="text-sm leading-relaxed">
        This permanently deletes your account, profile and saved properties. It can&rsquo;t be undone.
      </p>
      {hasPassword && <PasswordField label="Your password" name="password" error={f.password} />}
      <TextField
        label="Type DELETE to confirm"
        name="confirm"
        autoComplete="off"
        error={f.confirm}
        placeholder="DELETE"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-56">
          <SubmitButton pending="Deleting…" tone="danger">
            Delete permanently
          </SubmitButton>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-fill btn-ink h-12 border border-line px-6 text-sm font-medium"
        >
          Keep my account
        </button>
      </div>
    </form>
  );
}
