// src/app/(auth)/signup/details/page.tsx
'use client';

import { Suspense, useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaComment, FaUser, FaVenusMars, FaPhone } from 'react-icons/fa';

function SignupDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1단계에서 받아온 정보
  const role = searchParams.get('role');
  const crewName = searchParams.get('crewName');
  
  // 2단계에서 입력받을 추가 정보 상태
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 최종 가입 시도 핸들러
  const handleFinalSignup = (provider: 'kakao' | 'naver') => {
    setError(null);

    // 유효성 검사
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!gender) {
      setError('성별을 선택해주세요.');
      return;
    }
    if (!/^\d{10,11}$/.test(phoneNumber.replace(/-/g, ''))) {
      setError('올바른 전화번호 10-11자리를 입력해주세요. (예: 01012345678)');
      return;
    }

    // 모든 데이터를 모아서 실제 소셜 로그인 로직 호출
    const finalSignupData = {
      role,
      crewName, // '일반 회원'의 경우 null
      name: name.trim(),
      gender,
      phoneNumber: phoneNumber.replace(/-/g, ''),
    };

    handleSocialLogin(provider, finalSignupData);
  };
  
  // 실제 소셜 로그인 로직 (데이터와 함께)
  const handleSocialLogin = (provider: 'kakao' | 'naver', data: object) => {
    console.log('최종 가입 정보:', data);
    alert(`${provider} 계정으로 가입을 시도합니다.\n\n전달 정보:\n${JSON.stringify(data, null, 2)}`);
    // 여기에 NextAuth의 signIn() 함수를 연동합니다.
  };

  useEffect(() => {
    if (!role) {
      alert("잘못된 접근입니다. 가입을 처음부터 다시 시작해주세요.");
      router.replace('/signup');
    }
  }, [role, router]);

  if (!role) {
    return <div className="text-center">정보를 불러오는 중...</div>;
  }
  
  return (
    <div className="w-full max-w-lg space-y-8 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          회원가입 (2/2)
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          마지막 단계입니다! 아래 정보를 입력해주세요.
        </p>
      </div>

      {/* 1. 정보 확인 섹션 */}
      <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">가입 정보 요약</h3>
        <ul className="mt-3 space-y-2 text-base text-gray-700 dark:text-gray-300">
          <li className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">가입 유형</span>
            <span className="font-semibold">{role === 'admin' ? '크루 장' : '일반 회원'}</span>
          </li>
          {crewName && (
            <li className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">크루 이름</span>
              <span className="font-semibold">{crewName}</span>
            </li>
          )}
        </ul>
      </div>

      {/* 2. 추가 정보 입력 폼 */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-600">
          추가 정보 입력
        </h3>

        {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
                {error}
            </div>
        )}

        {/* 이름 입력 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이름</label>
          <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="h-4 w-4 text-gray-400"/></div><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="이름을 입력하세요" className="w-full px-3 py-3 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"/></div>
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">성별</label>
          <div className="flex gap-4"><label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${gender === 'male' ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:border-gray-400'}`}><input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} className="sr-only"/> 남성</label><label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${gender === 'female' ? 'bg-pink-50 border-pink-500' : 'border-gray-200 hover:border-gray-400'}`}><input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} className="sr-only"/> 여성</label></div>
        </div>
        
        {/* 전화번호 입력 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">전화번호</label>
          <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="h-4 w-4 text-gray-400"/></div><input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="'-' 없이 숫자만 입력" className="w-full px-3 py-3 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"/></div>
        </div>
      </div>
      
      {/* 3. 최종 가입 액션 */}
      <div className="space-y-4 pt-4">
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div><div className="relative flex justify-center text-sm"><span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">가입 완료하기</span></div></div>
        
        <button type="button" onClick={() => handleFinalSignup('kakao')} className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm bg-[#FEE500] text-[#3C1E1E] text-base font-bold hover:bg-[#FADA00]">
          <FaComment className="w-5 h-5 mr-2" />카카오로 계속하기
        </button>
        
        <button type="button" onClick={() => handleFinalSignup('naver')} className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm bg-[#03C75A] text-white text-base font-bold hover:bg-[#02B753]">
          <span className="font-extrabold text-lg leading-5 mr-2">N</span>네이버로 계속하기
        </button>
        
        <div className="text-center">
            <Link href="/signup" className="inline-block w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ← 이전 단계로 돌아가기
            </Link>
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