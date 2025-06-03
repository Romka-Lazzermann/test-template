import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const targetPath = pathname.replace(/^\/api/, '');
  const targetUrl = `http://localhost:3000${targetPath}${search}`;

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
  const targetUrl = `http://localhost:3000${targetPath}${search}`;

  const body = await request.text();

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: request.headers,
    body,
  });

  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });
}