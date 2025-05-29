// src/components/MobileBottomNav.tsx
import Link from 'next/link';
import React from 'react';
import {
  FiPlusCircle,
  FiUsers,
  FiCheckCircle,
  FiDollarSign,
} from 'react-icons/fi';

// 빠른 실행 버튼 데이터 배열 (layout에서도 사용할 수 있도록 여기로 옮기거나,
// props로 전달받거나, 공유 상태/컨텍스트에서 가져올 수 있습니다.
// 여기서는 간단하게 여기에 다시 정의합니다.)
const quickActions = [
  { href: "/events/new", icon: <FiPlusCircle />, label: "새 모임", mobileIconColor: "text-blue-600 dark:text-blue-400", mobileTextColor: "text-blue-700 dark:text-blue-300" },
  { href: "/members", icon: <FiUsers />, label: "회원관리", mobileIconColor: "text-green-600 dark:text-green-400", mobileTextColor: "text-green-700 dark:text-green-300" },
  { href: "/attendance", icon: <FiCheckCircle />, label: "출석체크", mobileIconColor: "text-yellow-600 dark:text-yellow-500", mobileTextColor: "text-yellow-700 dark:text-yellow-400" },
  { href: "/finance ", icon: <FiDollarSign />, label: "회비관리", mobileIconColor: "text-purple-600 dark:text-purple-400", mobileTextColor: "text-purple-700 dark:text-purple-300" },
];

const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="빠른 실행 메뉴 (모바일)"
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-[rgb(var(--card-rgb))] border-t border-[rgb(var(--card-border-rgb))] p-2 shadow-top-md dark:shadow-top-md-dark z-50" // z-index는 유지하거나 더 높게
    >
      <div className="flex justify-around items-center">
        {quickActions.map((action) => (
          <Link
            key={action.href + "-mobile-nav"} // key 고유성 확보
            href={action.href}
            className={`flex flex-col items-center justify-center p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-1/4 group`}
          >
            {React.cloneElement(action.icon, { 
              className: `w-6 h-6 mb-0.5 ${action.mobileIconColor} group-hover:scale-110 transition-transform` 
            })}
            <span className={`text-xs ${action.mobileTextColor} group-hover:font-medium`}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;