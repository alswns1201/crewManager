// app/api/users/me/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 또는 다른 저장소에서 토큰을 가져오는 방식 사용

export async function GET(request: Request) {
  // 클라이언트가 보낸 요청에서 'Authorization' 헤더(JWT 토큰)를 추출합니다.
  const authHeader = request.headers.get('Authorization');

  // 토큰이 없으면 인증되지 않았다는 응답을 보냅니다.
  if (!authHeader) {
    return NextResponse.json({ message: 'Authorization header is missing' }, { status: 401 });
  }

  try {
    // 실제 백엔드 API 서버로 요청을 보냅니다. (서버 to 서버 통신)
    // process.env.BACKEND_API_URL 와 같이 환경 변수로 관리하는 것이 좋습니다.
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        // 클라이언트로부터 받은 Authorization 헤더를 그대로 전달합니다.
        'Authorization': authHeader,
      },
      cache: 'no-store', // me API는 캐싱되면 안되므로 no-store 옵션을 추가합니다.
    });

    // 백엔드 응답이 성공적이지 않으면, 에러 메시지와 상태 코드를 그대로 전달합니다.
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    // 백엔드 응답이 성공적이면, JSON 데이터를 파싱하여 클라이언트로 전달합니다.
    const userData = await backendResponse.json();
    return NextResponse.json(userData);

  } catch (error) {
    console.error('API route /api/users/me error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}