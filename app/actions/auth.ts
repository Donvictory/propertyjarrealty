'use server';

import { redirect } from 'next/navigation';
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
