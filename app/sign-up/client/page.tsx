import type { Metadata } from 'next';
import SignUpRolePage from '@/components/auth/SignUpRolePage';

export const metadata: Metadata = { title: 'Sign up as a Client', robots: { index: false, follow: false } };

export default function ClientSignUpPage() {
  return <SignUpRolePage role="client" />;
}
