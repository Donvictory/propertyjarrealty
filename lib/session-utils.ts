// Edge-compatible session utilities (no Node.js or Next.js server APIs)
// Safe to import from middleware
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './types';

export const COOKIE_NAME = 'pjr_admin_session';

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.AUTH_SECRET;
  if (!secretKey) throw new Error('AUTH_SECRET env variable is not set');
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
