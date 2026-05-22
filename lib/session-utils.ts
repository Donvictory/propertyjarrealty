// Edge-compatible session utilities (no Node.js or Next.js server APIs)
// Safe to import from middleware
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './types';

export const COOKIE_NAME = 'pjr_admin_session';

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.AUTH_SECRET || 'pjr_default_secure_session_secret_key_change_me_123';
  if (!process.env.AUTH_SECRET) {
    console.warn('[Session] Warning: AUTH_SECRET environment variable is not defined. Using secure default fallback.');
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey());
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
