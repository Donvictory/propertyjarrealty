import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { ResetPasswordFormFromUrl } from '@/components/auth/forms';

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false, follow: false },
  // The URL carries a one-time token: don't leak it to other sites.
  referrer: 'no-referrer',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password."
      lede="Once it's saved you will be signed in, and any other devices will be signed out."
      footer={
        <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <ResetPasswordFormFromUrl />
      </Suspense>
    </AuthShell>
  );
}
