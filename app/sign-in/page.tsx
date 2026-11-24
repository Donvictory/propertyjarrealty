import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { SignInForm, SignInFormFromUrl } from '@/components/auth/forms';
import { googleConfigured } from '@/lib/google-oauth';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };

export default function SignInPage() {
  const google = googleConfigured();
  return (
    <AuthShell
      title="Welcome back."
      lede="Sign in to see your saved properties and account details."
      footer={
        <>
          New to PropertyJar?{' '}
          <Link href="/sign-up" className="font-medium text-brand underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {/* Static page: ?next, ?save and ?notice are read client-side; the fallback keeps the form in the HTML. */}
      <Suspense fallback={<SignInForm google={google} />}>
        <SignInFormFromUrl google={google} />
      </Suspense>
    </AuthShell>
  );
}
