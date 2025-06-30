"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import DashboardCard from "@/component/DashboardCard"; // 경로가 맞는지 확인해주세요.
import { useCrew } from "@/context/CrewContext";
import { FiUsers, FiDollarSign, FiPlusCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

// 타입 정의
type Member = {
  id: string;
  name: string;
  hasPaidFee: boolean;
};

type Event = {
  id: string;
  name: string;
  date: string; // 'YYYY-MM-DD' 형식
  manager: string;
};

type Crew = {
  members: Member[];
  events: Event[];
};

type CrewData = {
  [key: string]: Crew;
};

// 목업 데이터
const CREW_DATA: CrewData = {
  crew1: {
    members: [
      { id: "m001", name: "김러너", hasPaidFee: true },
      { id: "m002", name: "박참가", hasPaidFee: false },
    ],
    events: [{ id: "evt001", name: "새벽 정기런", date: "2025-06-13", manager: "양치훈" }],
  },
  crew2: {
    members: [
      { id: "m003", name: "이운영", hasPaidFee: true },
      { id: "m004", name: "최크루", hasPaidFee: false },
    ],
    events: [{ id: "evt002", name: "트레일 러닝", date: "2025-06-20", manager: "PHAM" }],
  },
  crew3: {
    members: [],
    events: [],
  },
};

export default function AdminDashboardPage() {
  const { selectedCrewId } = useCrew();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const crew = CREW_DATA[selectedCrewId] || { members: [], events: [] };

  // 월 시작/끝, 주 시작/끝 (월요일 시작)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const handleClickEvent = (id: string) => {
    alert(`이벤트 상세 보기: ${id}`);
  };

  const prevMonth = () => setCurrentMonth(addDays(monthStart, -1));
  const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1));

  return (
    <>
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">👋 안녕하세요, 운영진님!</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard
          title="총 회원 수"
          icon={<FiUsers className="text-blue-600" size={28} />}
        >
          <p className="text-4xl font-bold">{crew.members.length}명</p>
        </DashboardCard>

        <DashboardCard
          title="회비 미납"
          icon={<FiDollarSign className="text-red-500" size={28} />}
        >
          <p className="text-4xl font-bold text-red-500">
            {crew.members.filter((m) => !m.hasPaidFee).length}명
          </p>
        </DashboardCard>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
            📅 모임 일정
          </h2>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
          >
            <FiPlusCircle size={20} />
            모임 등록
          </Link>
        </header>

        <div className="flex justify-between items-center mb-4 text-gray-700">
          <button
            onClick={prevMonth}
            aria-label="이전 달"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiChevronLeft size={24} />
          </button>
          <div className="text-xl font-semibold">{format(currentMonth, "yyyy년 MM월")}</div>
          <button
            onClick={nextMonth}
            aria-label="다음 달"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-l border-t border-gray-200">
          {/* 요일 헤더 */}
          {["월", "화", "수", "목", "금", "토", "일"].map((dayName) => (
            <div
              key={dayName}
              className="bg-gray-50 py-3 font-semibold text-gray-600 text-center text-sm border-r border-b border-gray-200"
            >
              {dayName}
            </div>
          ))}

          {/* 날짜 셀 */}
          {calendarDays.map((d, i) => {
            const evts = crew.events.filter((e) => isSameDay(parseISO(e.date), d));
            const isToday = isSameDay(d, new Date());
            const inMonth = isSameMonth(d, currentMonth);

            return (
              <div
                key={i}
                className={`
                  relative min-h-[120px] p-2 flex flex-col bg-white border-r border-b border-gray-200
                  transition-colors
                  ${!inMonth ? "bg-gray-50" : "hover:bg-blue-50"}
                `}
              >
                <span
                  className={`
                    font-medium mb-1 text-sm
                    ${isToday ? "flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full" : ""}
                    ${!inMonth ? "text-gray-400" : "text-gray-700"}
                  `}
                >
                  {format(d, "d")}
                </span>
                
                <div className="flex flex-col gap-1 overflow-y-auto flex-grow">
                  {evts.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleClickEvent(e.id)}
                      title={`관리자: ${e.manager}`}
                      className="w-full text-xs bg-green-100 hover:bg-green-200 text-green-800 font-semibold rounded px-2 py-1 text-left truncate transition-colors"
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}