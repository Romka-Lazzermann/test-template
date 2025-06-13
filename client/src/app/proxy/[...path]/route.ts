import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie'
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname, search, searchParams } = url;
  const path = pathname.replace(/^\/proxy/, '/api') || '/';
  const setCookieKey = searchParams.get('setCookie'); // имя куки
  const cookieField = searchParams.get('cookieField'); // путь в JSON
  const targetUrl = `${process.env.SERVER_URL}${path}?${searchParams.toString()}`;

  const token = request.cookies.get('jwt')?.value;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');

  if (token) headers.set('Authorization', `Bearer ${token}`);
  console.log("GET proxy", targetUrl)

  const response = await fetch(targetUrl, { method: 'GET', headers });

  const contentType = response.headers.get('content-type');
  let data: any;

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: response.headers,
    });
  }

  const headersObject = Object.fromEntries(response.headers.entries());
  if (setCookieKey && cookieField && data?.data?.[cookieField]) {
    const cookieValue = data?.data?.[cookieField];
    const cookie = serialize(setCookieKey, cookieValue, {
      httpOnly: true,
      // secure: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        ...headersObject,
        'Set-Cookie': cookie,
      },
    });
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: headersObject,
  });
}

export async function POST(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
//   console.log("POST console", pathname)
  const path = pathname.replace(/^\/proxy/, '/api') || '/';
  const targetUrl = `${process.env.SERVER_URL}${path}${search}`;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');

  let body: any = null;
  let _set_headers = true;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await request.json();
    body = JSON.stringify(json);
  }
  else if (contentType.includes('multipart/form-data')) {
    body = await request.formData();
    _set_headers = false;
  }
  else {
    body = await request.body;
    _set_headers = false
  }
  const token = request.cookies.get('jwt')?.value;



  const request_options: any = _set_headers ? {
    headers: {
      'Content-Type': 'application/json',
    }
  } : {
    headers: {}
  }

  if (token) {
    request_options.headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    body,
    ...request_options
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
    const response = NextResponse.json(data, {
      headers: {
        'Set-Cookie': cookie,
      },
    });
    return response;
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: response.headers,
  });
}

// export async function PUT(request: NextRequest) {
//   const { pathname, search } = new URL(request.url);
//   const targetPath = pathname.replace(/^\/api/, '');

//   const targetUrl = `${process.env.SERVER_URL}${targetPath}${search}`;
//   const headers = new Headers(request.headers);

//   let body: any = null;
//   let _set_headers = true;
//   const contentType = headers.get('content-type') || '';
//   if (contentType.includes('application/json')) {
//     const json = await request.json();
//     body = JSON.stringify(json);
//   }
//   else if (contentType.includes('multipart/form-data')) {
//     body = await request.formData();
//     _set_headers = false;
//   }
//   else {
//     body = await request.body;
//     _set_headers = false
//   }

//   const token = request.cookies.get('jwt')?.value;

//   const request_options: any = _set_headers ? {
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   } : {
//     headers: {}
//   }

//   if (token) {
//     request_options.headers['Authorization'] = `Bearer ${token}`
//   }
//   const response = await fetch(targetUrl, {
//     method: 'PUT',
//     body,
//     ...request_options
//   });

//   const data = await response.json();
//   console.log("data", data)

//   return NextResponse.json(data, {
//     status: response.status,
//     headers: response.headers,
//   });
// }