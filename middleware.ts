import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for Supabase auth cookie or admin session token
    const hasAuthCookie = request.cookies.getAll().some(
      (c) => c.name.includes('sb-') || c.name.includes('supabase-auth-token') || c.name === 'admin-session'
    );

    // Note: Since client components in /admin/layout.tsx also perform runtime auth check using supabase.auth.getSession(),
    // we also pass through if the header or cookie indicates session.
    // If no session token cookie is found, we redirect to /admin/login.
    if (!hasAuthCookie) {
      // Allow browser client-side auth guard in app/admin/layout.tsx to evaluate session if cookie is handled in LS,
      // but if access is attempted directly without any cookies, redirect to login.
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
