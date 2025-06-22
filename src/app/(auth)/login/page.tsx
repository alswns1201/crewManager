'use client';

import Link from 'next/link';
import { FaComment } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';

export default function LoginPage() {

  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URL; 

    if (provider === 'kakao') {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;
      window.location.href = kakaoAuthUrl; // 이전 답변의 변수명 오타 수정
    }
    // ... 네이버 로직
  };

  return (
    <main className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
        
        {/* [추가된 부분] 서비스 로고 텍스트 */}
        <div className="text-center">
          {/* 나중에 Image 컴포넌트로 교체할 수 있습니다. 예: <Image src="/logo.png" ... /> */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            CrewManager Pro
          </h1>
        </div>
        {/* --- 여기까지 --- */}

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">로그인</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            소셜 계정으로 간편하게 로그인하세요.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('kakao')}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-lg font-bold bg-[#FEE500] text-black"
          >
            <FaComment />
            <span>카카오로 로그인</span>
          </button>
          <button
            type="button"
            // onClick={() => handleSocialLogin('naver')}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-lg font-bold bg-[#03C75A] text-white"
          >
            <SiNaver />
            <span>네이버로 로그인</span>
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            아직 회원이 아니신가요?{' '}
            <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}