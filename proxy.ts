import { NextRequest, NextResponse } from 'next/server';
import { decrypt, COOKIE_NAME } from '@/lib/session-utils';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PAGE = '/admin/login';

// List of exact allowed pathnames
const ALLOWED_EXACT_PATHNAMES = new Set([
  '/',
  '/about',
  '/services',
  '/service',
  '/properties',
  '/campaign',
  '/contact',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]);

// Helper to determine if a path is allowed
function isAllowedPath(pathname: string): boolean {
  // 1. Check exact paths
  if (ALLOWED_EXACT_PATHNAMES.has(pathname)) {
    return true;
  }

  // 2. Check admin prefix
  if (pathname.startsWith('/admin')) {
    return true;
  }

  // 3. Check API routes
  if (pathname.startsWith('/api/')) {
    return true;
  }

  // 4. Check Next.js internal static assets
  if (pathname.startsWith('/_next/')) {
    return true;
  }

  // 5. Check user uploads
  if (pathname.startsWith('/uploads/')) {
    return true;
  }

  // 6. Check campaign dynamic detail pages: /campaign/[id]
  if (pathname.startsWith('/campaign/')) {
    const subpath = pathname.substring('/campaign/'.length);
    if (!subpath || subpath.includes('/') || subpath.includes('$') || subpath.includes('&')) {
      return false;
    }
    return true;
  }

  // 7. Check static files in the public folder (by extensions)
  const extensionMatch = pathname.match(/\.([a-zA-Z0-9]+)$/);
  if (extensionMatch) {
    const ext = extensionMatch[1].toLowerCase();
    const allowedExtensions = new Set([
      'pdf', 'jpeg', 'jpg', 'png', 'svg', 'gif', 'webp', 
      'html', 'xml', 'txt', 'woff2', 'woff', 'ttf', 'mp4', 'mov', 'ico', 'json'
    ]);
    if (allowedExtensions.has(ext)) {
      return true;
    }
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Return 404 with X-Robots-Tag: noindex, nofollow if path contains invalid characters ($ or &)
  if (pathname.includes('$') || pathname.includes('&')) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  // 2. Return 404 with X-Robots-Tag: noindex, nofollow for any unrecognized routes
  if (!isAllowedPath(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  // 3. Admin routes session validation
  if (pathname.startsWith(PROTECTED_PREFIX)) {
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
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - sitemap.xml (dynamic sitemap)
  // - robots.txt (dynamic robots)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
