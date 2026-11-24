

import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './types';

export const COOKIE_NAME = 'pjr_admin_session';

function getEncodedKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    // A known fallback key would let anyone forge an admin cookie, so production refuses to run without one.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.');
    }
    console.warn('[Session] AUTH_SECRET missing or short; using an insecure development key.');
    return new TextEncoder().encode('dev-only-insecure-admin-key-dev-only-insecure');
  }
  return new TextEncoder().encode(secret);
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
