import 'server-only';
import { cookies } from 'next/headers';
import { encrypt, decrypt, COOKIE_NAME } from './session-utils';
import { getAdminById } from './admins';
import type { SessionPayload } from './types';

export { encrypt, decrypt, COOKIE_NAME };

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ ...payload, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);
  if (!payload) return null;

  
  
  const admin = await getAdminById(payload.adminId);
  if (!admin) return null; 

  const storedVersion = admin.sessionVersion ?? 1;
  const tokenVersion  = payload.sessionVersion ?? 1;
  if (tokenVersion !== storedVersion) return null; 

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
