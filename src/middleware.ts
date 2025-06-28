import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 로그인/회원가입 관련 페이지 경로 목록
  const publicAuthPaths = ['/login','/api/auth/login', '/signup','/callback','/api/crew/all'];

  // 요청 경로가 publicAuthPaths 중 하나로 시작하는지 확인
  const isPublicAuthPath = publicAuthPaths.some(path => pathname.startsWith(path));

  // 1. 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려는 경우
  if (authToken && isPublicAuthPath) {
    console.log('로그인된 사용자가 인증 페이지 접근. 메인 페이지로 리디렉션합니다.');
    // 메인 페이지나 대시보드로 리디렉션
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. 로그인하지 않은 사용자가 보호된 페이지에 접근하려는 경우
  //    (publicAuthPaths가 아니고, 시스템 경로가 아닐 때)
  if (!authToken && !isPublicAuthPath) {
    console.log('인증되지 않은 사용자가 보호된 페이지 접근. 로그인 페이지로 리디렉션합니다.');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 그 외의 경우는 모두 통과
  return NextResponse.next();
}

// 미들웨어를 실행할 경로를 더 넓게 잡습니다.
// 정적 파일과 API 요청을 제외한 모든 페이지 요청에 대해 실행되도록 합니다.
export const config = {
  matcher: [
      '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};