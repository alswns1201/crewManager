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
  FiCalendar,
} from 'react-icons/fi';

// 홈 버튼을 제외한 4개의 메뉴 아이템 정의
const navItems = [
  { href: "/schedule", label: "일정", icon: <FiCalendar size={24} /> },
  { href: "/members", label: "회원", icon: <FiUsers size={24} /> },
  { href: "/finance", label: "회비관리", icon: <FiDollarSign size={24} /> },
  { href: "/attendance", label: "출석체크", icon: <FiCheckCircle size={24} /> },
];

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    // 1. 전체 래퍼 (돌출된 버튼을 위한 추가 높이 확보)
    <div className="sm:hidden fixed bottom-0 left-0 right-0 h-24 z-40">
      
      {/* 3. 하단 바 (배경 역할) */}
      <nav
        aria-label="메인 메뉴 (모바일)"
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 shadow-top-md"
      >
        {/* 4. 아이콘 배치용 Flex 컨테이너 */}
        <div className="flex justify-around items-center h-full">
          {/* 왼쪽 2개 아이템 */}
          <div className="w-1/5 flex justify-center">
            <NavItem item={navItems[0]} pathname={pathname} />
          </div>
          <div className="w-1/5 flex justify-center">
            <NavItem item={navItems[1]} pathname={pathname} />
          </div>
          
          {/* 5. 중앙의 빈 공간 (자리 차지용) */}
          {/* 이 빈 div가 홈 버튼을 위한 시각적 공간을 만들어줍니다. */}
          <div className="w-1/5">
            <Link href="/"
                className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-blue-600 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110"
                aria-label="홈으로 이동"
              >
                <FiHome size={28} />
                <span className="text-[10px] mt-0.5 font-semibold">홈</span>
            </Link>
          </div>

          {/* 오른쪽 2개 아이템 */}
          <div className="w-1/5 flex justify-center">
            <NavItem item={navItems[2]} pathname={pathname} />
          </div>
          <div className="w-1/5 flex justify-center">
            <NavItem item={navItems[3]} pathname={pathname} />
          </div>
        </div>
      </nav>
    </div>
  );
};

// 재사용성을 위한 개별 아이템 컴포넌트
const NavItem = ({ item, pathname }: { item: typeof navItems[0], pathname: string }) => (
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
);

export default MobileBottomNav;