import { Suspense } from 'react';
import { SignUpSteps, SignUpStepsFromUrl } from './SignUpSteps';
import type { SignUpRole } from './forms';
import { googleConfigured } from '@/lib/google-oauth';

/** Shared page for /sign-up/client and /sign-up/realtor: steps 2–5 of sign-up. */
export default function SignUpRolePage({ role }: { role: SignUpRole }) {
  const google = googleConfigured();
  return (
    // Static page: ?ref and ?next are read client-side; the fallback keeps the first step in the HTML.
    <Suspense fallback={<SignUpSteps role={role} google={google} backHref="/sign-up" />}>
      <SignUpStepsFromUrl role={role} google={google} />
    </Suspense>
  );
}
