// component/MobileBottomNav.tsx

"use client";

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiDollarSign,
  FiMoreHorizontal, // '더보기' 아이콘 추가
  FiCalendar,     // '일정' 아이콘 추가
} from 'react-icons/fi';

// [수정] 5개 아이템 구조로 재설계 (중앙 아이템은 홈)
// 가운데 홈 버튼을 위한 공간을 만들기 위해 null을 placeholder로 사용합니다.
const navItems = [
  { href: "/schedule", label: "일정", icon: <FiCalendar size={24} /> },
  { href: "/members", label: "회원", icon: <FiUsers size={24} /> },
  { href: null, label: 'Home', icon: null }, // 중앙 홈 버튼을 위한 공간
  { href: "/finance", label: "회비관리", icon: <FiDollarSign size={24} /> },
  { href: "/more", label: "더보기", icon: <FiMoreHorizontal size={24} /> },
];

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    // [✅ 핵심 수정 1] 부모 컨테이너에 relative 클래스 추가
    // absolute로 위치시킬 홈 버튼의 기준점이 됩니다.
    <div className="sm:hidden fixed bottom-0 left-0 right-0 h-20 z-40">
      
      {/* [✅ 핵심 수정 2] 중앙에 위치할 플로팅 홈 버튼 */}
      <Link href="/"
        className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-blue-600 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110"
        aria-label="홈으로 이동"
      >
        <FiHome size={28} />
        <span className="text-xs mt-0.5">홈</span>
      </Link>

      {/* [✅ 핵심 수정 3] 실제 하단 바 */}
      <nav
        aria-label="메인 메뉴 (모바일)"
        className="bg-white border-t border-gray-200 h-full shadow-top-md"
      >
        <div className="flex justify-around items-center h-full">
          {navItems.map((item, index) => (
            <div key={index} className="w-1/5 flex justify-center">
              {/* href가 null인 중앙 아이템은 렌더링하지 않아 공간만 차지합니다. */}
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                      pathname === item.href
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  {item.icon}
                  <span className={`text-xs font-medium`}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                // 빈 공간
                <div></div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNav;