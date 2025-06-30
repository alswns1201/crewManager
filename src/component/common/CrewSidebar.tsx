// component/common/CrewSidebar.tsx

"use client";

import React from "react";
import { useCrew } from "@/context/CrewContext";
import { FiUsers, FiX } from "react-icons/fi"; // 닫기(X) 아이콘 추가
import Link from "next/link";

const crews = [
  { id: "crew1", name: "크루 1" },
  { id: "crew2", name: "크루 2" },
  { id: "crew3", name: "크루 3" },
];

type CrewSidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CrewSidebar({ open, setOpen }: CrewSidebarProps) {
  const { selectedCrewId, setSelectedCrewId } = useCrew();

  const handleSelectCrew = (id: string) => {
    setSelectedCrewId(id);
    setOpen(false); // 크루 선택 시 사이드바가 닫히도록 설정
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200
        // [1] z-index를 오버레이(40)보다 높게 설정
        z-50 w-72 
        // [2] 열림/닫힘 상태에 따라 위치를 변경하는 핵심 로직
        transition-transform duration-300 ease-in-out
        ${open ? "transform-none" : "-translate-x-full"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* [3] 사이드바 자체의 헤더 (로고 및 닫기 버튼) */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="text-xl font-bold text-blue-600">
            전체 메뉴
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="메뉴 닫기"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* 내비게이션 메뉴 영역 */}
        <nav className="flex-grow p-4 overflow-y-auto">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">내 크루 목록</h3>
          <div className="flex flex-col gap-2 mt-2">
            {crews.map(({ id, name }) => {
              const selected = selectedCrewId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelectCrew(id)}
                  title={name}
                  className={`flex items-center gap-3 w-full text-left py-2.5 px-4 rounded-lg font-medium
                    transition-colors duration-200
                    ${selected ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}
                  `}
                >
                  <FiUsers size={20} />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
          {/* 필요하다면 여기에 다른 메뉴 그룹들을 추가할 수 있습니다. */}
        </nav>
      </div>
    </aside>
  );
}