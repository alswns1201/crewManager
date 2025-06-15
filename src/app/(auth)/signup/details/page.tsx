// src/app/(auth)/signup/details/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaComment, FaUser, FaPhone } from 'react-icons/fa';

// localStorage에 저장할 데이터 타입 정의
interface SignupFormData {
  role: string;
  crewName?: string;
  crewId?: string;
  name: string;
  gender: string;
  phoneNumber: string;
}

function SignupDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1단계 정보 (URL 쿼리에서 초기값 설정)
  const initialRole = searchParams.get('role');
  const initialCrewName = searchParams.get('crewName');
  const initialCrewId = searchParams.get('crewId');

  // 2단계 정보 상태
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // 에러 및 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- 소셜 로그인 흐름 제어 ---

  // 1. 카카오/네이버 인증 페이지로 리디렉션하는 함수
  const handleSocialLoginRedirect = (provider: 'kakao' | 'naver') => {
    setError(null);
    // 폼 유효성 검사
    if (!initialRole || !name.trim() || !gender || !phoneNumber.trim()) {
      setError('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 리디렉션 전에 현재까지의 모든 폼 데이터를 localStorage에 저장
    const formData: SignupFormData = {
      role: initialRole,
      crewName: initialCrewName || undefined,
      crewId: initialCrewId || undefined,
      name,
      gender,
      phoneNumber,
    };
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    localStorage.setItem('loginProvider', provider); // 어떤 provider로 로그인 시도했는지도 저장

    // TODO: 실제 소셜 플랫폼의 인증 URL로 리디렉션
    // 이 URL은 카카오/네이버 개발자 센터에서 발급받은 KEY와 Redirect URI를 사용해야 합니다.
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    // 이 페이지로 다시 돌아오도록 redirect_uri 설정
    const REDIRECT_URI = 'http://localhost:3000/signup/details';
    if (provider === 'kakao') {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    } else if (provider === 'naver') {
      // 네이버 로그인 URL...
    }
  };

  // 2. 페이지 로드 시 URL에 인가 코드가 있는지 확인하고, 있다면 백엔드 API 호출
  useEffect(() => {
    const authorizationCode = searchParams.get('code');
    const storedFormData = localStorage.getItem('signupFormData');
    const storedProvider = localStorage.getItem('loginProvider');

    // 인가 코드가 있고, 저장된 폼 데이터와 프로바이더 정보가 있을 때만 실행
    if (authorizationCode && storedFormData && storedProvider) {
      setIsLoading(true);
      setError(null);
      
      const formData: SignupFormData = JSON.parse(storedFormData);

      // 백엔드 API 호출 함수
      const completeSignup = async () => {
        try {
          const response = await fetch(`/api/auth/login/${storedProvider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              authorizationCode,
              ...formData
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '가입에 실패했습니다.');
          }

          const result = await response.json();
          // TODO: 받은 JWT(result.token)를 안전하게 저장 (HttpOnly 쿠키 등)
          
          // 성공 후 임시 데이터 삭제
          localStorage.removeItem('signupFormData');
          localStorage.removeItem('loginProvider');
          
          alert('회원가입 및 로그인이 완료되었습니다!');
          router.push('/'); // 메인 페이지로 이동
          
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      completeSignup();
    }
  }, [searchParams, router]);

  // 1단계 정보가 없으면 초기 렌더링 시 리디렉션
  useEffect(() => {
    if (!initialRole) {
      alert("잘못된 접근입니다. 가입을 처음부터 다시 시작해주세요.");
      router.replace('/signup');
    }
  }, [initialRole, router]);

  if (!initialRole) {
    return <div className="text-center p-10">정보 확인 중...</div>;
  }
  
  return (
    <div className="w-full max-w-lg space-y-8 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">회원가입 (2/2)</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">마지막 단계입니다! 아래 정보를 입력해주세요.</p>
      </div>

      <div className="p-5 bg-gray-50 rounded-xl border">
        <h3 className="text-base font-semibold">가입 정보 요약</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li><strong>가입 유형:</strong> {initialRole === 'admin' ? '크루장' : '일반 회원'}</li>
          {initialCrewName && <li><strong>크루 이름:</strong> {initialCrewName}</li>}
        </ul>
      </div>

      <div className="space-y-6">
        <h3 className="text-base font-semibold border-b pb-2">추가 정보 입력</h3>
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">이름</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="이름을 입력하세요" className="w-full p-3 border-2 rounded-lg"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">성별</label>
          <div className="flex gap-4">
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${gender === 'male' ? 'bg-blue-50 border-blue-500' : 'hover:border-gray-400'}`}><input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} className="sr-only"/>남성</label>
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${gender === 'female' ? 'bg-pink-50 border-pink-500' : 'hover:border-gray-400'}`}><input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} className="sr-only"/>여성</label>
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">전화번호</label>
          <input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="'-' 없이 숫자만 입력" className="w-full p-3 border-2 rounded-lg"/>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"/></div><div className="relative flex justify-center text-sm"><span className="px-3 bg-white">가입 완료하기</span></div></div>
        
        <button type="button" onClick={() => handleSocialLoginRedirect('kakao')} disabled={isLoading} className="w-full p-3 bg-[#FEE500] rounded-lg font-bold disabled:bg-gray-300">
          {isLoading ? '가입 처리 중...' : '카카오로 가입 완료'}
        </button>
        <button type="button" onClick={() => handleSocialLoginRedirect('naver')} disabled={isLoading} className="w-full p-3 bg-[#03C75A] text-white rounded-lg font-bold disabled:bg-gray-300">
          {isLoading ? '가입 처리 중...' : '네이버로 가입 완료'}
        </button>
        
        <div className="text-center">
            <Link href="/signup" className="inline-block w-full py-3 border rounded-lg font-semibold hover:bg-gray-100">← 이전 단계로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupDetailsPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <SignupDetailsContent />
        </Suspense>
    )
}