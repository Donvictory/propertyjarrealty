import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from '@/components/auth/forms';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password."
      lede="Enter the email you signed up with and we will send you a link to choose a new password."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
