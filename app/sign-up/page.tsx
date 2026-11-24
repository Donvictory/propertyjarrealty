import type { Metadata } from 'next';
import { Suspense } from 'react';
import RoleChooser from '@/components/auth/RoleChooser';
import SignUpFrame, { SIGN_UP_TOTAL_STEPS } from '@/components/auth/SignUpFrame';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false, follow: false } };

export default function SignUpChooserPage() {
  return (
    <SignUpFrame
      step={1}
      total={SIGN_UP_TOTAL_STEPS}
      title="How will you use PropertyJar?"
      lede="Clients buy and invest. Realtors refer clients and earn commission."
    >
      <Suspense fallback={null}>
        <RoleChooser />
      </Suspense>
    </SignUpFrame>
  );
}
