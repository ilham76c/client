import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '';

async function proxyRequest(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = req.nextUrl.pathname.replace('/api/backend', '');
  const query = req.nextUrl.search;

  const response = await fetch(`${API_URL}${API_VERSION}${path}${query}`, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      ...(req.headers.get('content-type')
        ? { 'Content-Type': req.headers.get('content-type')! }
        : {}),
    },
    body: ['GET', 'HEAD'].includes(req.method)
      ? undefined
      : await req.arrayBuffer(),
    cache: 'no-store',
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('content-type') || 'application/json',
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
