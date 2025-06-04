import { NextRequest, NextResponse } from 'next/server';
import {serialize} from 'cookie'
export async function GET(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const targetPath = pathname.replace(/^\/api/, '');
  const targetUrl = `${process.env.SERVER_URL}${targetPath}${search}`;

  const response = await fetch(targetUrl, {
    method: 'GET',
    headers: request.headers,
  });

  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const targetPath = pathname.replace(/^\/api/, '');

  const targetUrl = `${process.env.SERVER_URL}${targetPath}${search}`;
  const headers = new Headers(request.headers);

  let body: any = null;

  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await request.json();
    body = JSON.stringify(json);
  } 
  else {
    body = await request.body;
  }
  
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: request.headers,
    body,
  });

  const data = await response.json();
  console.log("data", data)
  if (data.token) {
    const cookie = serialize('jwt', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Set-Cookie': cookie,
      },
    });
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: response.headers,
  });
}