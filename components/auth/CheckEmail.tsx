'use client';

import { useSearchParams } from 'next/navigation';
import { ResendVerificationForm } from './forms';

/** Shows which address we emailed (from ?email=) and offers a resend. */
export default function CheckEmail() {
  const email = useSearchParams().get('email') ?? '';
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line p-6">
        <p className="text-sm text-muted">We sent a confirmation link to</p>
        <p className="mt-1 break-all text-lg font-medium">{email || 'your email address'}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Open it on this device to confirm your address and sign in. The link expires in 24 hours. If it isn&rsquo;t in
          your inbox, check spam or promotions.
        </p>
      </div>
      <ResendVerificationForm email={email || undefined} />
    </div>
  );
}
