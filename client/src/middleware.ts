import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/panel/blog', '/panel/category', '/panel/channel'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/panel/login', request.url));
    }
    try {
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/panel/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/blog', '/panel/category', '/panel/channel'], 
};