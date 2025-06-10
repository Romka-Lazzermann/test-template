import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const panelPaths = ['/panel/blog', '/panel/category', '/panel/channel', '/panel', '/panel/login'];

async function getTranslatedLink(url: string, lang: string) {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/link/get_language/${url}?lang=${lang}`)
    const data = await res.json()
    return data
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPanelPath = pathname.startsWith('/panel');
  const isLoginPath = pathname === '/panel/login';
  const parts = pathname.split('/').filter(Boolean);
  const isBlog = pathname.startsWith('/article')
  const isTraslatedBlog = parts?.length >= 3 && parts[1] === 'article'


  if (isPanelPath) {
    const token = request.cookies.get('jwt')?.value;
    if (isLoginPath && token) {
      return NextResponse.redirect(new URL('/panel/', request.url));
    }
    if (!isLoginPath && !token) {
      return NextResponse.redirect(new URL('/panel/login', request.url));
    }
  }
  if (isBlog || isTraslatedBlog) {
    const userLang = isBlog ? request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en' : parts[0]
    const link_url = isBlog ? pathname.split('/')[2] : parts.slice(2).join('/');
    const link_data = await getTranslatedLink(link_url, userLang)
    if(link_data?.ok){
      const redirectPath = `/${link_data?.lang}/article/${link_url}`
      if(pathname != redirectPath){
        const url = new URL(request.url);
        url.pathname = redirectPath;

        return NextResponse.redirect(url)
      }
    }else {
      new Response('Not Found', { status: 404 })
    }
  } 


  return NextResponse.next();
}

// export const config = {
//   matcher: ['/panel((?!/login).*)'],
// };