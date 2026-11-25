import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth';

// Strict Edge Protected Route Paths
const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isMutatingAdminApi =
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth') &&
    !pathname.startsWith('/api/newsletter') &&
    !pathname.startsWith('/api/health') &&
    !pathname.startsWith('/api/tools/execute') &&
    !pathname.startsWith('/api/revalidate') &&
    !pathname.startsWith('/api/seo/submit') &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { valid } = await verifyAdminSessionToken(token);

  // If already authenticated and trying to visit /login, redirect to /dashboard
  if (pathname === '/login') {
    if (valid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Intercept protected paths
  if (isProtectedPath) {
    if (!valid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // If on /login page, enforce noindex
  if (pathname === '/login') {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // Intercept mutating admin APIs
  if (isMutatingAdminApi) {
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin master authentication required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/admin/:path*',
    '/admin',
    '/settings/:path*',
    '/login',
    '/api/:path*',
  ],
};
