import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { googleAuthUrl, googleConfigured, OAUTH_COOKIE } from '@/lib/google-oauth';
import { safeNext } from '@/lib/user-session';

/** Starts "Continue with Google": remembers a CSRF state + where to return, then hands off to Google. */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL('/sign-in?notice=google-unavailable', req.nextUrl));
  }
  const state = randomBytes(24).toString('base64url');
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  const save = req.nextUrl.searchParams.get('save') ?? '';

  const res = NextResponse.redirect(googleAuthUrl(req.nextUrl.origin, state));
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, next, save }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/google',
    maxAge: 10 * 60,
  });
  return res;
}
