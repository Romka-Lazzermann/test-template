import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const panelPaths = ['/panel/blog', '/panel/category', '/panel/channel', '/panel', '/panel/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPanelPath = pathname.startsWith('/panel');
  const isLoginPath = pathname === '/panel/login';


  if (isPanelPath) {
    const token = request.cookies.get('jwt')?.value;
    if (isLoginPath && token) {
      return NextResponse.redirect(new URL('/panel/', request.url));
    }
    if (!isLoginPath && !token) {
      return NextResponse.redirect(new URL('/panel/login', request.url));
    }
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/panel((?!/login).*)'],
// };