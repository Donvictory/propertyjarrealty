import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { getUserById, type UserRecord } from './users';

/*
 * Customer sessions: a signed (HS256) JWT in an httpOnly cookie, separate from the admin cookie.
 * The token carries the user id and the user's sessionVersion; bumping sessionVersion in Firestore
 * (password change, "sign out everywhere") invalidates every outstanding cookie.
 */

export const USER_COOKIE = 'pjr_session';
const MAX_AGE_S = 30 * 24 * 60 * 60; // 30 days

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.');
    }
    console.warn('[user-session] AUTH_SECRET missing or short; using an insecure development key.');
    return new TextEncoder().encode('dev-only-insecure-key-dev-only-insecure-key');
  }
  return new TextEncoder().encode(secret);
}

type Claims = { uid: string; sv: number };

export async function createUserSession(user: Pick<UserRecord, 'id' | 'sessionVersion'>) {
  const token = await new SignJWT({ uid: user.id, sv: user.sessionVersion } satisfies Claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_S}s`)
    .sign(secretKey());

  (await cookies()).set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  });
}

export async function deleteUserSession() {
  (await cookies()).delete(USER_COOKIE);
}

async function readClaims(): Promise<Claims | null> {
  const token = (await cookies()).get(USER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    if (typeof payload.uid !== 'string' || typeof payload.sv !== 'number') return null;
    return { uid: payload.uid, sv: payload.sv };
  } catch {
    return null;
  }
}

/** The signed-in user, or null. Memoized per request. Rejects sessions from before a sessionVersion bump. */
export const getCurrentUser = cache(async (): Promise<UserRecord | null> => {
  const claims = await readClaims();
  if (!claims) return null;
  const user = await getUserById(claims.uid).catch(() => null);
  if (!user || user.sessionVersion !== claims.sv) return null;
  return user;
});

/** For account pages: returns the user or sends them to sign in, coming back to `nextPath` afterwards. */
export async function requireUser(nextPath: string): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Only allow same-site relative redirects ("/account", not "//evil.com" or "https://…"). */
export function safeNext(value: unknown, fallback = '/account'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  return value.slice(0, 300);
}
