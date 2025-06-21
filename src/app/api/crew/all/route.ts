// src/app/api/crew/all/route.ts

import { NextResponse } from 'next/server';

// 백엔드 API에서 받아올 크루 데이터의 타입 (재사용을 위해 별도 파일로 분리해도 좋음)
interface CrewFromBackend {
  id: string;
  name: string;
  // 백엔드에는 logoUrl이 없으므로 타입에 포함시키지 않음
}

// 모든 크루 목록을 가져오는 GET 핸들러
export async function GET() {
  try {
    // 서버 사이드 환경 변수에서 Spring Boot API 주소를 가져옵니다.
    const springApiUrl = `${process.env.BACKEND_URL}/api/crew/all`;
    
    // Next.js 서버에서 Spring Boot 서버로 API 요청을 보냅니다.
    // { cache: 'no-store' } 옵션은 항상 최신 데이터를 가져오도록 보장합니다.
    const response = await fetch(springApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      // Spring 서버로부터 받은 에러 메시지를 그대로 전달
      const errorData = await response.text();
      console.error('Error from Spring Boot API:', errorData);
      throw new Error(`Spring API Error: ${response.statusText}`);
    }

    const crews: CrewFromBackend[] = await response.json();

    // NextResponse.json()을 사용하여 클라이언트에게 JSON 데이터를 반환합니다.
    return NextResponse.json(crews);

  } catch (error) {
    console.error('Error in Next.js route handler:', error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // 클라이언트에게 500 Internal Server Error와 함께 에러 메시지를 반환합니다.
    return new NextResponse(
      JSON.stringify({ message: errorMessage }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}