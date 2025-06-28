import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 보내기
    });

    const rawSetCookie = backendResponse.headers.get('set-cookie'); // ⬅ 중요

    const response = new NextResponse('로그아웃 완료', {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (rawSetCookie) {
      response.headers.set('set-cookie', rawSetCookie); // ⬅ 쿠키 삭제 응답을 클라이언트로 전달
    }

    return response;
  } catch (err) {
    return NextResponse.json({ message: 'Logout failed', error: String(err) }, { status: 500 });
  }
}