'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser, FiLoader } from 'react-icons/fi';

// 백엔드 DTO와 일치하는 사용자 정보 타입
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // "내 정보 조회" API를 호출하는 함수
    const checkUserStatus = async () => {


      try {
        // 2. fetch 요청 시 headers에 Authorization을 추가합니다.
        const response = await fetch('/api/users/me');

        if (response.ok) { // API 호출이 성공하면 (200 OK)
          const userData: User = await response.json();
          setUser(userData); // 사용자 정보를 상태에 저장 => 로그인 된 것으로 간주
        } 
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        setUser(null);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };
    checkUserStatus();
  }, []);

  // ... (handleLogout, 드롭다운 로직 등은 이전 답변과 동일)
  const handleLogout = async() => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/login'); // 예시
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  // [UI 로직]
  if (isLoading) {
    return <div className="w-9 h-9 flex items-center justify-center"><FiLoader className="animate-spin" /></div>;
  }

  if (!user) { // 로그인 안 된 상태
    return null;
  }

  // 로그인 된 상태
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-40 border">
            <div className="px-4 py-2 border-b">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <div className='p-1'>
                 {/* ... 드롭다운 메뉴 아이템들 ... */}
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <FiLogOut />
                    로그아웃
                </button>
            </div>
        </div>
      )}
    </div>
  );
} 