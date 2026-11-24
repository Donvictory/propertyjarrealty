'use client';

import { useActionState, useState } from 'react';
import {
  changePasswordAction,
  deleteAccountAction,
  updateProfileAction,
  updateRealtorDetailsAction,
  type FormState,
} from '@/app/actions/account';
import { FormMessage, PasswordField, SubmitButton, TextField } from '@/components/auth/fields';
import { NIGERIAN_BANKS } from '@/lib/nigerian-banks';

const INITIAL: FormState = {};

type RealtorDetails = {
  bankName: string | null;
  bankAccountNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
};

/** Realtor payout + identity details: bank, account number, date of birth, house address. */
export function RealtorDetailsForm({ initial }: { initial: RealtorDetails }) {
  const [state, action] = useActionState(updateRealtorDetailsAction, INITIAL);
  const f = state.fields ?? {};
  const v = { ...initial, ...state.values };
  // Latest date that makes someone 18 today, to stop the date picker going past it.
  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  })();
  const select =
    'mt-2 h-12 w-full appearance-none border bg-paper px-4 text-[15px] text-ink focus:outline-none';

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Bank name
          <select
            name="bankName"
            required
            defaultValue={v.bankName ?? ''}
            aria-invalid={Boolean(f.bankName)}
            className={`${select} ${f.bankName ? 'border-brand' : 'border-line focus:border-ink'}`}
          >
            <option value="" disabled>
              Choose your bank
            </option>
            {NIGERIAN_BANKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          {f.bankName && <span className="mt-2 block text-sm font-normal text-brand">{f.bankName}</span>}
        </label>
        <TextField
          label="Account number"
          name="bankAccountNumber"
          inputMode="numeric"
          autoComplete="off"
          placeholder="10 digits"
          defaultValue={v.bankAccountNumber ?? ''}
          error={f.bankAccountNumber}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <label className="block text-sm font-medium">
          Date of birth
          <input
            name="dateOfBirth"
            type="date"
            required
            max={maxDob}
            defaultValue={v.dateOfBirth ?? ''}
            aria-invalid={Boolean(f.dateOfBirth)}
            className={`${select} ${f.dateOfBirth ? 'border-brand' : 'border-line focus:border-ink'}`}
          />
          {f.dateOfBirth && <span className="mt-2 block text-sm font-normal text-brand">{f.dateOfBirth}</span>}
        </label>
        <TextField
          label="House address"
          name="address"
          autoComplete="street-address"
          placeholder="House number, street, area, city"
          defaultValue={v.address ?? ''}
          error={f.address}
        />
      </div>
      <p className="text-xs leading-relaxed text-muted">
        Used to pay your commission into your account and to confirm who you are. Only you and the PropertyJar
        team can see these details.
      </p>
      <div className="max-w-xs">
        <SubmitButton pending="Saving…">Save details</SubmitButton>
      </div>
    </form>
  );
}

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
    <form action={action} className="rounded-xl space-y-5 border border-brand/40 p-5 sm:p-6" noValidate>
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
