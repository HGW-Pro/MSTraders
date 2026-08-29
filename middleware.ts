import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all /admin requests to allow client-side auth state in AdminLayout & localStorage to evaluate
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

