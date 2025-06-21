'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FiLogOut, FiUser } from 'react-icons/fi'; // 아이콘 추가

export default function UserProfile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      
      Cookies.remove('accessToken', { path: '/' });
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      
      alert('로그아웃 되었습니다.');
      router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
      router.refresh(); // 페이지를 새로고침하여 서버 컴포넌트 데이터도 갱신
    } catch (error) {
      console.error('Logout error:', error);
      alert('로그아웃 중 문제가 발생했습니다.');
    }
  };

  if (!isLoggedIn) {
    // 로그인하지 않은 상태에서는 아무것도 표시하지 않거나, 로그인 버튼을 표시할 수 있습니다.
    // 현재 레이아웃 구조상 아무것도 표시하지 않는 것이 자연스러워 보입니다.
    return null; 
  }

  // 로그인한 상태일 때 프로필 아이콘과 드롭다운 메뉴 렌더링
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="사용자 메뉴 열기"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
      >
        {/* 이니셜 등을 표시할 수 있습니다. 예: '홍' */}
        U
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--card-rgb))] rounded-md shadow-lg py-1 z-40 border border-[rgb(var(--card-border-rgb))]">
          <button
            onClick={() => router.push('/my-page')} // 마이페이지 경로
            className="w-full text-left px-4 py-2 text-sm text-[rgb(var(--foreground-rgb))] hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiUser />
            마이페이지
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiLogOut />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}