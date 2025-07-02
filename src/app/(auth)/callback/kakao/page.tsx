'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('로그인 정보를 처리 중입니다...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. URL에서 인가 코드를 가져옵니다.
    const authorizationCode = searchParams.get('code');

    // 인가 코드가 없으면 즉시 에러 처리
    if (!authorizationCode) {
      setError('카카오 인증에 실패했습니다. (인가 코드를 찾을 수 없음)');
      setStatus('인증 실패');
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
      return;
    }

    // 2. 로그인/회원가입 처리를 위한 비동기 함수
    const processLoginOrSignup = async (code: string) => {
      // [분기점] localStorage에서 회원가입 데이터를 확인합니다.
      const storedFormData = localStorage.getItem('signupFormData');
      const provider = 'kakao'; // 이 페이지는 카카오 전용이므로 하드코딩

      let requestBody: any = { authorizationCode: code };

      if (storedFormData) {
        // [회원가입 플로우] localStorage에 데이터가 있는 경우
        console.log('회원가입 플로우를 진행합니다.');
        const formData = JSON.parse(storedFormData);
        requestBody = { ...requestBody, ...formData };
      } else {
        // [로그인 플로우] localStorage에 데이터가 없는 경우
        console.log('로그인 플로우를 진행합니다.');
        // requestBody는 authorizationCode만 포함합니다.
      }
      
      try {
        // 3. 백엔드 API 호출 (회원가입/로그인 통합)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login/${provider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '가입 또는 로그인에 실패했습니다.');
        }

        // 4. 성공 처리
        setStatus('성공적으로 로그인되었습니다! 잠시 후 메인 페이지로 이동합니다.');
        // 사용했던 localStorage 데이터가 있다면 삭제
        if (storedFormData) {
            localStorage.removeItem('signupFormData');
            localStorage.removeItem('loginProvider'); // signup 페이지에서 설정한 값
        }
        
        // 2초 후 메인 페이지로 이동 (replace를 사용하여 뒤로가기 방지)
        setTimeout(() => {
          // 로그인 후에는 대시보드나 사용자의 메인 페이지로 보내는 것이 일반적입니다.
          router.replace('/'); // '/dashboard' 또는 메인 페이지('/')
        }, 2000);

      } catch (err: any) {
        // 5. 실패 처리
        setError(err.message);
        setStatus('오류가 발생했습니다.');
        // 실패 시에도 임시 데이터는 삭제하여 다음 시도에 영향을 주지 않도록 합니다.
        if (storedFormData) {
            localStorage.removeItem('signupFormData');
            localStorage.removeItem('loginProvider');
        }

          // 2초 후 메인 페이지로 이동 (replace를 사용하여 뒤로가기 방지)
        setTimeout(() => {
          // 로그인 후에는 대시보드나 사용자의 메인 페이지로 보내는 것이 일반적입니다.
          router.replace('/'); // '/dashboard' 또는 메인 페이지('/')
        }, 3000);
      }
    };

    processLoginOrSignup(authorizationCode);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 이 useEffect는 초기에 한 번만 실행되어야 하므로 의존성 배열을 비웁니다.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 dark:bg-gray-900">
      <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">로그인 처리 중</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{status}</p>
        {error && <p className="text-red-500 mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-md">에러: {error}</p>}
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">처리 중...</div>}>
            <KakaoCallbackContent />
        </Suspense>
    )
}