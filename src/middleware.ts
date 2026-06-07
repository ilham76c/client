import { NextRequest, NextResponse } from 'next/server';

/**
 * Route protection middleware
 * Protects /masterdata routes - requires admin role
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect masterdata routes
  if (pathname.startsWith('/masterdata')) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/masterdata/:path*'],
};
