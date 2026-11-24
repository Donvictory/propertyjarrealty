import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { SignUpForm, SignUpFormFromUrl } from '@/components/auth/forms';
import { googleConfigured } from '@/lib/google-oauth';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false, follow: false } };

export default function SignUpPage() {
  const google = googleConfigured();
  return (
    <AuthShell
      eyebrow="Create an account"
      title="Your property, in one place."
      lede="Save properties, keep track of your enquiries and come back to them any time."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<SignUpForm google={google} />}>
        <SignUpFormFromUrl google={google} />
      </Suspense>
    </AuthShell>
  );
}
