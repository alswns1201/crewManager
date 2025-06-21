// app/api/auth/login/[provider]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context : { params: { provider: string } }
) {
  try {

    const { provider } = await context.params;
    const body = await request.json(); // 클라이언트에서 보낸 JSON 데이터

    // Next.js 서버에서 Spring Boot 백엔드로 안전하게 요청4
  
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/login/${provider}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      // 백엔드 에러를 클라이언트에 그대로 전달
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const jwtToken = await backendResponse.text();

    // 여기서 쿠키에 JWT를 설정하는 등 추가 작업을 할 수 있음
    const response = NextResponse.json({ token: jwtToken }, { status: 200 });
    response.cookies.set('accessToken', jwtToken, { httpOnly: true, path: '/' });

    return response;

  } catch (error) {
    return NextResponse.json({ message: error+'Internal Server Error' }, { status: 500 });
  }
}