// src/app/(auth)/signup/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // next/navigation 사용
import Link from 'next/link';
import { FiUsers, FiPhone, FiLogIn, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { FaComment, FaPlus } from 'react-icons/fa'; // 카카오 아이콘 (예시)
// 네이버 아이콘은 직접 SVG를 사용하거나, 다른 라이브러리에서 찾아야 할 수 있습니다.
// 여기서는 간단히 텍스트로 대체하거나 기본 아이콘을 사용합니다.

type Role = 'member' | 'admin';

// 소셜 로그인 제공자로부터 받아올 수 있는 기본 정보 (예시)
interface SocialUserProfile {
  name?: string;
  email?: string;
  profileImage?: string;
  provider?: 'kakao' | 'naver' | 'google'; // 어떤 소셜 로그인인지
}

export default function SocialSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // URL 쿼리 파라미터 접근

  // 소셜 로그인 후 전달받은 임시 사용자 정보 (실제로는 세션이나 상태 관리 라이브러리 통해 전달)
  // 여기서는 URL 쿼리 파라미터 또는 localStorage/sessionStorage에서 가져온다고 가정
  const [socialUser, setSocialUser] = useState<SocialUserProfile | null>(null);

  const [role, setRole] = useState<Role>('member');
  const [phoneNumber, setPhoneNumber] = useState('');

  // 일반 회원용 (선택 사항, 간편 가입에서는 초기엔 생략 가능)
  // const [selectedCrew, setSelectedCrew] = useState('');

  // 운영진용 (역할 선택 시 필요)
  const [newCrewName, setNewCrewName] = useState('');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 예시: URL 쿼리 파라미터에서 소셜 로그인 정보 가져오기
    // 실제로는 NextAuth.js 같은 라이브러리가 세션에 정보를 담아주거나,
    // signIn 콜백 후 리다이렉트 시 필요한 정보를 전달하는 방식을 사용합니다.
    const tempName = searchParams.get('name');
    const tempEmail = searchParams.get('email');
    const tempProvider = searchParams.get('provider') as SocialUserProfile['provider'];

    if (tempName && tempEmail && tempProvider) {
      setSocialUser({ name: tempName, email: tempEmail, provider: tempProvider });
      // 이미 이름, 이메일이 있다면 해당 필드를 채워줄 수도 있습니다.
    } else {
      // 소셜 정보가 없으면 로그인 페이지로 돌려보내는 등의 처리
      // alert("소셜 로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
      // router.push('/login');
      // 지금은 목업이므로, 임시 데이터 설정
      setSocialUser({ name: "임시사용자", email: "temp@example.com", provider: "kakao" });
    }
  }, [searchParams, router]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!agreedToTerms) {
      setError('이용약관 및 개인정보처리방침에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    if (!phoneNumber.trim()) {
        setError('핸드폰 번호를 입력해주세요.');
        setIsLoading(false);
        return;
    }
    // 핸드폰 번호 유효성 검사 (간단한 예시)
    if (!/^\d{10,11}$/.test(phoneNumber.replace(/-/g, ''))) {
        setError('올바른 핸드폰 번호 형식이 아닙니다.');
        setIsLoading(false);
        return;
    }


    if (role === 'admin' && !newCrewName.trim()) {
      setError('새로운 크루 이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // TODO: 실제 회원가입 완료 API 호출 로직 (소셜 정보 + 추가 정보)
    console.log('추가 정보 등록 시도:', {
      socialUserInfo: socialUser,
      role,
      phoneNumber,
      ...(role === 'admin' && { crewName: newCrewName }),
      // ...(role === 'member' && selectedCrew && { crewId: selectedCrew }),
    });

    try {
      // 가상 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch('/api/auth/complete-social-signup', { method: 'POST', body: JSON.stringify(...) });
      // if (!response.ok) throw new Error('정보 등록 실패');
      
      alert('회원가입이 완료되었습니다! 메인 페이지로 이동합니다.');
      // 회원가입 성공 후 메인 대시보드로 이동
      // 역할에 따라 다른 페이지로 리다이렉트 할 수도 있음
      if (role === 'admin') {
        router.push('/'); // 운영진 대시보드 (현재 / 가 운영진 대시보드라고 가정)
      } else {
        router.push('/user-dashboard'); // 일반 회원 대시보드 (추후 생성)
      }

    } catch (err: any) {
      setError(err.message || '정보 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 버튼 클릭 핸들러 (실제로는 NextAuth.js의 signIn 함수 호출)
  const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
    // NextAuth.js 사용 시: signIn(provider, { callbackUrl: '/signup/additional-info' });
    // callbackUrl은 소셜 로그인 후 추가 정보를 입력받을 이 페이지 또는 다른 페이지로 설정
    alert(`${provider}로 로그인 시도합니다. (NextAuth.js signIn() 연동 필요)`);
    // 지금은 이 페이지가 "추가 정보 입력" 페이지 역할을 하므로,
    // 실제로는 로그인 페이지에서 소셜 로그인을 시도하고, 신규 사용자면 이 페이지로 오는 흐름이 됩니다.
    // 여기서는 UI 목업이므로 버튼만 표시합니다.
  };


  // 이 페이지는 소셜 로그인 "후" 추가 정보를 받는 페이지로 가정합니다.
  // 따라서 소셜 로그인 버튼은 원래 로그인 페이지에 있어야 합니다.
  // 여기서는 "회원가입 완료"를 위한 폼만 보여주는 것이 더 적절할 수 있습니다.
  // 아래는 "로그인 페이지"에 있을 법한 소셜 로그인 버튼 UI 예시입니다. (참고용)
  const SocialLoginButtons = () => (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            다음 계정으로 계속하기
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3"> {/* 여러 소셜 로그인 시 grid-cols-2 등 */}
        <button
          type="button"
          onClick={() => handleSocialLogin('kakao')}
          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-[#FEE500] text-[#3C1E1E] text-sm font-medium hover:bg-[#FADA00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] dark:focus:ring-offset-gray-800"
        >
          <FaComment className="w-5 h-5 mr-2" />
          카카오로 계속하기
        </button>
        {/* 네이버, 구글 버튼 추가 가능 */}
        <button
          type="button"
          onClick={() => handleSocialLogin('naver')}
          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-[#03C75A] text-white text-sm font-medium hover:bg-[#02B753] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03C75A] dark:focus:ring-offset-gray-800"
        >
          {/* 네이버 로고 SVG 또는 아이콘 */}
          <span className="font-bold text-lg leading-5 mr-2">N</span> 
          네이버로 계속하기
        </button>
      </div>
    </div>
  );
  
  if (!socialUser && !isLoading) { // socialUser 정보가 로드되지 않았으면 (잘못된 접근일 수 있음)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl text-center">
                <FiUsers className="mx-auto h-12 w-auto text-blue-600 dark:text-blue-400" />
                <h2 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
                    잘못된 접근입니다.
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    소셜 로그인을 통해 다시 시도해주세요.
                </p>
                <Link href="/login" className="mt-6 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    로그인 페이지로 이동
                </Link>
            </div>
        </div>
    );
  }


  return (
    // (auth)/layout.tsx 에서 전체 배경 및 중앙 정렬을 담당한다고 가정하고, 여기서는 폼 카드만.
    <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
      <div>
        {/* 소셜 프로필 정보 간단히 표시 */}
        {socialUser?.provider === 'kakao' && <FaComment className="mx-auto h-10 w-auto text-[#FEE500]" />}
        {socialUser?.provider === 'naver' && <span className="mx-auto h-10 w-auto flex items-center justify-center text-2xl font-bold text-[#03C75A] border-2 border-[#03C75A] rounded-full p-1">N</span>}
        {/* 구글 등 다른 프로바이더 아이콘 추가 */}
        
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {socialUser?.name ? `${socialUser.name}님, 환영합니다!` : "추가 정보 입력"}
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
          {socialUser?.email && <span>({socialUser.email})<br/></span>}
          서비스 이용을 위해 몇 가지 추가 정보가 필요합니다.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 가입 유형 선택 */}
        <div className="rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            가입 유형 <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/30 has-[:checked]:border-blue-500 dark:has-[:checked]:border-blue-600">
              <input
                type="radio"
                name="role"
                value="member"
                checked={role === 'member'}
                onChange={() => setRole('member')}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-800 dark:text-gray-200">
                <FiUsers className="inline mr-1 mb-0.5"/>일반 회원
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">크루에 참여하여 활동합니다.</span>
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/30 has-[:checked]:border-blue-500 dark:has-[:checked]:border-blue-600">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-800 dark:text-gray-200">
                <FiUsers className="inline mr-1 mb-0.5"/>운영진
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">새로운 크루를 개설합니다.</span>
              </span>
            </label>
          </div>
        </div>
        
        {/* 운영진 선택 시: 새 크루 이름 입력 */}
        {role === 'admin' && (
          <div>
            <label htmlFor="new-crew-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              새 크루 이름 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPlus className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="new-crew-name"
                name="newCrewName"
                type="text"
                value={newCrewName}
                onChange={(e) => setNewCrewName(e.target.value)}
                required={role === 'admin'}
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="크루 이름을 입력하세요"
              />
            </div>
          </div>
        )}

        {/* 핸드폰 번호 */}
        <div>
          <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            핸드폰 번호 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="phone-number"
              name="phoneNumber"
              type="tel" // type="tel" 로 변경
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="핸드폰 번호 (숫자만 입력)"
            />
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms-agreement"
              name="terms-agreement"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms-agreement" className="font-medium text-gray-700 dark:text-gray-300">
              <Link href="/terms" target="_blank" className="underline hover:text-blue-500 dark:hover:text-blue-300">이용약관</Link> 및 <Link href="/privacy" target="_blank" className="underline hover:text-blue-500 dark:hover:text-blue-300">개인정보처리방침</Link>에 동의합니다. <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiLogIn className="h-5 w-5 mr-2" aria-hidden="true" />
            )}
            {isLoading ? "처리 중..." : "가입 완료 및 시작하기"}
          </button>
        </div>
      </form>

      {/* 참고: 실제 로그인 페이지에서는 아래와 같은 소셜 로그인 버튼들이 있을 것입니다. */}
      {/* <SocialLoginButtons /> */}
    </div>
  );
}