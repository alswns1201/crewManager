// src/app/signup/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FiUser, FiUsers, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

// 목업 크루 목록 (실제로는 API 호출)
const MOCK_CREWS = [
  { id: 'crew001', name: '서울 달리기 크루' },
  { id: 'crew002', name: '한강 러닝 클럽' },
  { id: 'crew003', name: '새벽을 여는 사람들' },
];

type Role = 'member' | 'admin';

export default function SignupPage() {
  const [role, setRole] = useState<Role>('member');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 일반 회원용
  const [selectedCrew, setSelectedCrew] = useState('');

  // 운영진용
  const [newCrewName, setNewCrewName] = useState('');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('이용약관 및 개인정보처리방침에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    if (role === 'member' && !selectedCrew) {
      setError('소속될 크루를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    if (role === 'admin' && !newCrewName.trim()) {
      setError('새로운 크루 이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // TODO: 실제 회원가입 API 호출 로직
    console.log('회원가입 시도:', {
      role,
      name,
      email,
      password,
      ...(role === 'member' && { crewId: selectedCrew }),
      ...(role === 'admin' && { crewName: newCrewName }),
    });

    // API 호출 예시 (가상)
    try {
      // const response = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(...) });
      // if (!response.ok) throw new Error('회원가입 실패');
      // const data = await response.json();
      // 회원가입 성공 후 로그인 페이지로 이동 또는 자동 로그인 처리
      // router.push('/login');
      alert('회원가입 요청이 전송되었습니다. (실제 API 연동 필요)');
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <div>
          <FiUsers className="mx-auto h-12 w-auto text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            계정 만들기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              로그인하기
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* 역할 선택 */}
          <div className="rounded-md shadow-sm">
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              가입 유형
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="member"
                  checked={role === 'member'}
                  onChange={() => setRole('member')}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">일반 회원</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">운영진 (크루 개설)</span>
              </label>
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="name" className="sr-only">이름</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="이름"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email-address" className="sr-only">이메일 주소</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="이메일 주소"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password_signup" className="sr-only">비밀번호</label> {/* id 중복 방지 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password_signup"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="비밀번호"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirm-password_signup" className="sr-only">비밀번호 확인</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="confirm-password_signup"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* 역할별 추가 입력 필드 */}
          {role === 'member' && (
            <div>
              <label htmlFor="crew-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                크루 선택
              </label>
              <select
                id="crew-select"
                name="crew"
                value={selectedCrew}
                onChange={(e) => setSelectedCrew(e.target.value)}
                required={role === 'member'}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">크루를 선택하세요</option>
                {MOCK_CREWS.map(crew => (
                  <option key={crew.id} value={crew.id}>{crew.name}</option>
                ))}
              </select>
            </div>
          )}

          {role === 'admin' && (
            <div>
              <label htmlFor="new-crew-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 크루 이름
              </label>
              <input
                id="new-crew-name"
                name="newCrewName"
                type="text"
                value={newCrewName}
                onChange={(e) => setNewCrewName(e.target.value)}
                required={role === 'admin'}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="새로 만들 크루의 이름을 입력하세요"
              />
            </div>
          )}

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
                <Link href="/terms" className="underline hover:text-blue-500 dark:hover:text-blue-300">이용약관</Link> 및 <Link href="/privacy" className="underline hover:text-blue-500 dark:hover:text-blue-300">개인정보처리방침</Link>에 동의합니다.
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FiLogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                </span>
              )}
              {isLoading ? "가입 처리 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}