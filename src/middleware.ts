import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: any) {
  const token = await getToken({ req });

  if (req.nextUrl.pathname.startsWith('/upload')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}
