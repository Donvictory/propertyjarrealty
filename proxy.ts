import { NextRequest, NextResponse } from 'next/server';
import { decrypt, COOKIE_NAME } from '@/lib/session-utils';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PAGE = '/admin/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  // Allow access to login page — use startsWith to cover trailing slash variants
  if (pathname.startsWith(LOGIN_PAGE)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = await decrypt(token);
    // Already logged in — redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Verify session for all other /admin routes
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await decrypt(token);

  if (!session) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin and all sub-paths
  matcher: ['/admin', '/admin/:path*'],
};
