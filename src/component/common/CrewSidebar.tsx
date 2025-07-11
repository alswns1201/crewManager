// component/common/CrewSidebar.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCrew } from "@/context/CrewContext";
import { FiUsers, FiCalendar, FiDollarSign, FiChevronDown, FiChevronUp, FiGrid, FiBarChart2, FiSettings } from "react-icons/fi";

const crews = [
  { id: "crew1", name: "러닝 크루 A" },
  { id: "crew2", name: "등산 동호회 B" },
  { id: "crew3", name: "맛집 탐방 C" },
];

// 사이드바 메뉴 구조 정의
const sidebarNavItems = [
    { label: "대시보드", href: "/", icon: <FiGrid size={20} /> },
    { 
        label: "일정 관리", 
        icon: <FiCalendar size={20} />,
        // 하위 메뉴
        subItems: [
            { label: "스케줄 보드", href: "/schedule" },
            { label: "지난 일정", href: "/schedule/history" },
        ]
    },
    { 
        label: "회원 관리", 
        icon: <FiUsers size={20} />,
        subItems: [
            { label: "전체 회원", href: "/members" },
            { label: "가입 승인", href: "/members/approval" },
        ]
    },
    { label: "회계/정산", href: "/finance", icon: <FiDollarSign size={20} /> },
    { label: "통계", href: "/stats", icon: <FiBarChart2 size={20} /> },
    { label: "크루 설정", href: "/settings", icon: <FiSettings size={20} /> },
];


type CrewSidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CrewSidebar({ open, setOpen }: CrewSidebarProps) {
  const pathname = usePathname();
  const { selectedCrewId, setSelectedCrewId } = useCrew();
  const [isCrewDropdownOpen, setCrewDropdownOpen] = useState(false);
  
  // 열려있는 상위 메뉴의 label을 저장 (하나만 열리게)
  const [openMenu, setOpenMenu] = useState<string | null>('일정 관리');

  const selectedCrew = crews.find(c => c.id === selectedCrewId);

  const toggleMenu = (label: string) => {
    setOpenMenu(prev => (prev === label ? null : label));
  };
  
  return (
    // PC/모바일 반응형 동작은 이전과 동일하게 유지
    <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col z-50 transition-all duration-300 sm:translate-x-0 ${open ? 'sm:w-64' : 'sm:w-20'} w-72 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* 1. 크루 선택 드롭다운 */}
      <div className="p-4 border-b relative">
        <button 
          onClick={() => setCrewDropdownOpen(!isCrewDropdownOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            {open && <span className="font-bold text-gray-800 truncate">{selectedCrew?.name || '크루 선택'}</span>}
          </div>
          {open && <FiChevronDown className={`transition-transform ${isCrewDropdownOpen ? 'rotate-180' : ''}`} />}
        </button>
        {/* 드롭다운 메뉴 */}
        {isCrewDropdownOpen && open && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-xl border z-10">
            {crews.map(crew => (
              <button
                key={crew.id}
                onClick={() => {
                  setSelectedCrewId(crew.id);
                  setCrewDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
              >
                {crew.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 계층형 메뉴 (아코디언) */}
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {sidebarNavItems.map(item => (
          <div key={item.label}>
            {/* 하위 메뉴가 있는 경우 */}
            {item.subItems ? (
              <>
                <button 
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${!open ? 'justify-center' : ''} ${openMenu === item.label ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    {open && <span className="font-semibold">{item.label}</span>}
                  </div>
                  {open && <FiChevronDown className={`transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`} />}
                </button>
                {/* 하위 메뉴 리스트 */}
                {open && openMenu === item.label && (
                  <div className="mt-1 pl-8 space-y-1">
                    {item.subItems.map(subItem => (
                      <Link key={subItem.href} href={subItem.href}
                        className={`block p-2 rounded-lg text-sm transition-colors ${pathname === subItem.href ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
            // 하위 메뉴가 없는 경우
              <Link href={item.href}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${!open ? 'justify-center' : ''} ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {item.icon}
                {open && <span className="font-semibold">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* 3. 사이드바 접기/펼치기 버튼 (PC 전용) */}
      <div className="p-4 border-t">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100">
          <FiChevronDown className={`transition-transform ${open ? 'rotate-90' : '-rotate-90'}`} />
        </button>
      </div>

    </aside>
  );
}