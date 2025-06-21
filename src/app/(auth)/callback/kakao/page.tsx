// src/app/auth/callback/kakao/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('로그인 정보를 처리 중입니다...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authorizationCode = searchParams.get('code');
    const storedFormData = localStorage.getItem('signupFormData');
    const storedProvider = localStorage.getItem('loginProvider');

    if (authorizationCode && storedFormData && storedProvider) {
      const formData = JSON.parse(storedFormData);

      const completeSignup = async () => {
        try {
          // Next.js의 백엔드 프록시 API 호출
          const response = await fetch(`/api/auth/login/${storedProvider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorizationCode: authorizationCode,...formData }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '가입 또는 로그인에 실패했습니다.');
          }

          const result = await response.json();
          // JWT는 API 라우트에서 HttpOnly 쿠키로 설정했으므로 클라이언트에서 따로 저장할 필요 없음
          
          setStatus('성공적으로 로그인되었습니다! 메인 페이지로 이동합니다.');
          localStorage.removeItem('signupFormData');
          localStorage.removeItem('loginProvider');
          
          // 2초 후 메인 페이지로 이동
          setTimeout(() => {
            router.push('/');
          }, 2000);

        } catch (err: any) {
          setError(err.message);
          setStatus('오류가 발생했습니다.');
          localStorage.removeItem('signupFormData');
          localStorage.removeItem('loginProvider');
        }
      };
      completeSignup();

    } else {
      setError('인증 정보가 올바르지 않습니다. 다시 시도해주세요.');
      setStatus('인증 실패');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">로그인 처리 중</h1>
      <p className="text-lg">{status}</p>
      {error && <p className="text-red-500 mt-4">에러: {error}</p>}
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