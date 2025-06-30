// app/page.tsx

"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, subMonths, addMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCrew } from "@/context/CrewContext";
import { FiPlus, FiChevronLeft, FiChevronRight, FiX, FiUser, FiUsers, FiCheck, FiXCircle, FiChevronDown, FiMessageSquare, FiMapPin, FiTag } from "react-icons/fi";
import NewEventForm from "@/component/events/NewEventForm"; // 경로 확인

// --- 타입 정의 ---
type Member = { id: string; name: string; };
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  managerId: string;
  attendees: string[];
  absentees: string[];
};
type Crew = { members: Member[]; events: Event[]; };
type CrewData = { [key: string]: Crew; };

// --- 목업 데이터 ---
const CREW_DATA: CrewData = {
  crew1: {
    members: [
      { id: "m001", name: "김러너" },
      { id: "m002", name: "박참가" },
      { id: "m003", name: "최크루" },
    ],
    events: [
      { id: "evt001", title: "새벽 정기런", description: "남산 N타워 앞에서 만나요! 준비물: 편한 운동화, 물", date: new Date().toISOString(), endDate: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(), location: "남산 N타워", managerId: "m001", attendees: ["m001", "m003"], absentees: [] },
      { id: "evt002", title: "저녁 회식", description: "강남역 10번 출구 맛집에서 봅니다. 회비 3만원!", date: new Date().toISOString(), endDate: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(), location: "강남역", managerId: "m002", attendees: ["m002"], absentees: ["m001"] },
    ],
  },
};

// --- 자식 컴포넌트들 ---

// 1. 일정 등록 모달 (기존과 동일)
const CreateEventModal = ({ onClose, onEventCreated }: { onClose: () => void; onEventCreated: () => void; }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">새 모임 등록</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><FiX size={24} /></button>
                </header>
                <div className="p-6 overflow-y-auto"><NewEventForm /></div>
            </div>
        </div>
    );
};

// 2. 왼쪽 미니 캘린더 (UI 컴팩트하게 수정)
const ScheduleCalendar = ({ currentMonth, setCurrentMonth, selectedDate, onDateSelect, events, onAddClick }: { currentMonth: Date; setCurrentMonth: (d: Date) => void; selectedDate: Date; onDateSelect: (d: Date) => void; events: Event[]; onAddClick: () => void; }) => {
    const monthStart = startOfMonth(currentMonth);
    const calendarDays: Date[] = [];
    let day = startOfWeek(monthStart, { weekStartsOn: 0 });
    for (let i = 0; i < 42; i++) { calendarDays.push(day); day = addDays(day, 1); }
    return (
        <div className="bg-white rounded-lg shadow-sm p-3 h-full">
            <header className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold">{format(currentMonth, 'yyyy. MM')}</h2>
                <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-gray-100"><FiChevronLeft /></button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-gray-100"><FiChevronRight /></button>
                    <button onClick={onAddClick} className="p-1.5 rounded-full hover:bg-gray-100"><FiPlus /></button>
                </div>
            </header>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d} className="py-1.5">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center">
                {calendarDays.map((d, i) => {
                    const isSelected = isSameDay(d, selectedDate);
                    const inMonth = isSameMonth(d, currentMonth);
                    const hasEvent = events.some(e => isSameDay(parseISO(e.date), d));
                    return (
                        <div key={i} className="py-0.5 flex justify-center">
                            <button onClick={() => onDateSelect(d)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors relative text-sm ${!inMonth ? 'text-gray-300' : 'text-gray-800 hover:bg-blue-100'} ${isSelected ? 'bg-black text-white font-bold' : ''}`}>
                                {format(d, 'd')}
                                {hasEvent && !isSelected && <span className="absolute bottom-1.5 h-1 w-1 bg-blue-500 rounded-full"></span>}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// 3. [✅ 핵심 수정] 오른쪽 일정 카드 (아코디언 스타일)
const EventCard = ({ event, currentUserId, members }: { event: Event; currentUserId: string; members: Member[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [attendees, setAttendees] = useState(event.attendees);
    const [absentees, setAbsentees] = useState(event.absentees);
    const myStatus = attendees.includes(currentUserId) ? 'attending' : absentees.includes(currentUserId) ? 'absent' : 'none';
    const manager = members.find(m => m.id === event.managerId)?.name || '알 수 없음';
    const handleAttend = (e: React.MouseEvent) => { e.stopPropagation(); setAttendees(prev => [...new Set([...prev, currentUserId])]); setAbsentees(prev => prev.filter(id => id !== currentUserId)); };
    const handleAbsent = (e: React.MouseEvent) => { e.stopPropagation(); setAbsentees(prev => [...new Set([...prev, currentUserId])]); setAttendees(prev => prev.filter(id => id !== currentUserId)); };
    
    return (
        <div className="border rounded-lg bg-white transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex-grow space-y-1.5 mr-4">
                    <h3 className="font-bold text-base text-gray-800">{event.title}</h3>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FiUser size={12} /> {manager}</span>
                        <span className="flex items-center gap-1"><FiUsers size={12} /> 참석 {attendees.length}명</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleAttend} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors flex items-center gap-1.5 ${myStatus === 'attending' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <FiCheck size={14} /> 참석
                    </button>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="border-t p-4 space-y-4">
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{event.description || "상세 설명이 없습니다."}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2"><FiMapPin size={14} /><span>{event.location}</span></div>
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><FiMessageSquare size={14} /> 댓글</h4>
                        <div className="text-xs text-center text-gray-400 py-4">댓글 기능은 준비 중입니다.</div>
                    </div>
                     <div className="flex justify-end pt-2">
                        <button onClick={handleAbsent} className={`px-4 py-1.5 text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5 ${myStatus === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                            <FiXCircle size={14} /> 불참
                        </button>
                     </div>
                </div>
            )}
        </div>
    );
};

// 4. 오른쪽 데일리 이벤트 리스트 (UI 컴팩트하게 수정)
const DailyEventList = ({ selectedDate, events, members, currentUserId }: { selectedDate: Date; events: Event[]; members: Member[]; currentUserId: string; }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <header className="p-3 border-b">
                <h2 className="text-base font-semibold">{format(selectedDate, 'M월 d일 EEEE', { locale: ko })}</h2>
            </header>
            <div className="p-3 space-y-3 overflow-y-auto flex-grow">
                {events.length > 0 ? (
                    events.map(event => <EventCard key={event.id} event={event} members={members} currentUserId={currentUserId} />)
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm">등록된 일정이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 메인 페이지 컴포넌트 (UI 컴팩트하게 수정) ---
export default function ScheduleBoardPage() {
    const { selectedCrewId } = useCrew();
    const [crewData, setCrewData] = useState(CREW_DATA);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const currentCrew = crewData[selectedCrewId] || { members: [], events: [] };

    const handleEventCreated = () => {
        setCreateModalOpen(false);
        alert("새로운 모임이 등록되었습니다!");
    };

    const dailyEvents = useMemo(() => 
        currentCrew.events.filter(event => 
            isSameDay(parseISO(event.date), selectedDate)
        ), 
        [currentCrew.events, selectedDate]
    );

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4 flex-shrink-0">📅 스케줄 보드</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0">
                <div className="lg:col-span-1">
                    <ScheduleCalendar
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        events={currentCrew.events}
                        onAddClick={() => setCreateModalOpen(true)}
                    />
                </div>
                <div className="lg:col-span-2 flex flex-col min-h-0">
                    <DailyEventList
                        selectedDate={selectedDate}
                        events={dailyEvents}
                        members={currentCrew.members}
                        currentUserId="m001"
                    />
                </div>
            </div>
            {isCreateModalOpen && <CreateEventModal onClose={() => setCreateModalOpen(false)} onEventCreated={handleEventCreated} />}
        </div>
    );
}