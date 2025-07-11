import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 인증이 필요 없는 경로
  const publicPaths = ['/login', '/signup', '/callback'];

  const isPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 로그인된 사용자가 로그인/회원가입 페이지 접근 → 메인으로 리디렉션
  if (token && isPublicPath) {
    console.log("경로 : "+ pathname)
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인 안 된 사용자가 보호된 페이지 접근 → 로그인 페이지로 리디렉션
  if (!token && !isPublicPath) {
     console.log("token X  경로 : "+ pathname)
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 정적 리소스 제외한 모든 경로에 미들웨어 적용
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};