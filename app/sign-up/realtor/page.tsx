import type { Metadata } from 'next';
import SignUpRolePage from '@/components/auth/SignUpRolePage';

export const metadata: Metadata = { title: 'Sign up as a Realtor', robots: { index: false, follow: false } };

export default function RealtorSignUpPage() {
  return <SignUpRolePage role="realtor" />;
}
