import { NextRequest, NextResponse } from 'next/server';
import { decrypt, COOKIE_NAME } from '@/lib/session-utils';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PAGE = '/admin/login';


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


function isAllowedPath(pathname: string): boolean {
  
  if (ALLOWED_EXACT_PATHNAMES.has(pathname)) {
    return true;
  }

  
  if (pathname.startsWith('/admin')) {
    return true;
  }

  
  if (pathname.startsWith('/api/')) {
    return true;
  }

  
  if (pathname.startsWith('/_next/')) {
    return true;
  }

  
  if (pathname.startsWith('/uploads/')) {
    return true;
  }

  
  if (pathname.startsWith('/campaign/')) {
    const subpath = pathname.substring('/campaign/'.length);
    if (!subpath || subpath.includes('/') || subpath.includes('$') || subpath.includes('&')) {
      return false;
    }
    return true;
  }

  
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

  
  if (pathname.includes('$') || pathname.includes('&')) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  
  if (!isAllowedPath(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    
    if (pathname.startsWith(LOGIN_PAGE)) {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      const session = await decrypt(token);
      
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    
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
  
  
  
  
  
  
  
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
