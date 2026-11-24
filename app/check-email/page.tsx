import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import CheckEmail from '@/components/auth/CheckEmail';

export const metadata: Metadata = { title: 'Confirm your email', robots: { index: false, follow: false } };

export default function CheckEmailPage() {
  return (
    <AuthShell
      eyebrow="One more step"
      title="Check your inbox."
      footer={
        <>
          Used the wrong email?{' '}
          <Link href="/sign-up" className="font-medium text-brand underline-offset-4 hover:underline">
            Start again
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <CheckEmail />
      </Suspense>
    </AuthShell>
  );
}
