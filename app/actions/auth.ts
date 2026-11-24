'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/lib/rate-limit';
import { verifyAdminPassword } from '@/lib/admins';
import { createSession, deleteSession } from '@/lib/session';

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Brute-force speed bump: 5 tries per 10 minutes per IP and per email (per server instance).
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  if (
    !rateLimit(`admin-login:${ip}`, 5, 10 * 60_000).allowed ||
    !rateLimit(`admin-login:${email.toLowerCase()}`, 5, 10 * 60_000).allowed
  ) {
    return { error: 'Too many attempts. Wait 10 minutes and try again.' };
  }

  const admin = await verifyAdminPassword(email, password);

  if (!admin) {
    return { error: 'Invalid email or password.' };
  }

  await createSession({
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
    role: admin.role,
    sessionVersion: admin.sessionVersion ?? 1,
  });

  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}
