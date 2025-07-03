// src/components/events/NewEventForm.tsx
"use client"; // 클라이언트 컴포넌트 명시

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/navigation'; // 페이지 이동 시 필요하면 주석 해제
import Toast from '@/component/common/Toast'; // 직접 만든 Toast 컴포넌트 임포트
// import DatePicker from "react-datepicker"; // 외부 DatePicker 사용 시
// import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS

// (가정) 현재 로그인한 사용자 정보 (추후 실제 인증 시스템에서 가져옴)
// 실제로는 Context API, Zustand, 또는 서버 세션 등을 통해 가져와야 합니다.
const MOCK_CURRENT_USER = { email: 'mjkim1201@naver.com'}; 

interface SelectedLocation { // KakaoMapSearch와 연동 시 사용될 타입 (지금은 사용 X)
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export default function NewEventForm() {
  // const router = useRouter(); // 페이지 이동 시 필요하면 주석 해제
  const router = useRouter();
  // 폼 필드 상태
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState('19:00'); // 기본 시간 설정
  const [location, setLocation] = useState('');
  // const [selectedMapLocation, setSelectedMapLocation] = useState<SelectedLocation | null>(null); // 지도 연동 시 사용
  const [eventType, setEventType] = useState('personal'); // 'personal' 또는 'regular'
  const [maxParticipants, setMaxParticipants] = useState<number | string>('');
  const [notice, setNotice] = useState('');

  // 폼 제출 및 토스트 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info', // 기본 타입 (실제로는 error나 success로 변경됨)
    show: false,
  });

  // 토스트 메시지 표시 함수
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true });
  };

  // 토스트 메시지 닫기 함수
  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setIsSubmitting(true);
    closeToast(); // 이전 토스트가 있다면 닫기

    if (!title.trim()) {
      showToast("모임 제목을 입력해주세요.", 'error');
      setIsSubmitting(false);
      return;
    }
    if (!eventDate) {
      showToast("모임 날짜를 선택해주세요.", 'error');
      setIsSubmitting(false);
      return;
    }
    if (!eventTime) {
      showToast("모임 시간을 선택해주세요.", 'error');
      setIsSubmitting(false);
      return;
    }
    if (!location.trim()) {
      showToast("모임 장소를 입력해주세요.", 'error');
      setIsSubmitting(false);
      return;
    }
    if (eventType === 'regular') {
      if (!maxParticipants || Number(maxParticipants) < 1) {
        showToast("정기벙의 경우 유효한 최대 참여 인원을 입력해주세요 (1명 이상).", 'error');
        setIsSubmitting(false);
        return;
      }
    }

    const eventData = {
      userEmail: MOCK_CURRENT_USER.email,
      title: title.trim(),
      location: {
        locationName: location.trim(),
        address: location.trim(),
        latitude: 0,
        longitude: 0,
      },
      description: notice.trim(),
      eventType: eventType === 'personal' ? 'PERSONAL' : 'REGULAR',
      eventDateTime: new Date(`${eventDate?.toISOString().split('T')[0]}T${eventTime}`).toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        credentials: 'include'
      });

      const data = await response.json(); 
      if (!response.ok) {
        throw new Error(data.message || '모임 생성 실패');
      }
        showToast("모임이 성공적으로 생성되었습니다!", 'success');
        // 초기화 로직
        setTitle('');
        setEventDate(null);
        setEventTime('');
        setLocation('');
        setEventType('personal');
        setMaxParticipants('');
        setNotice('');


    } catch (error) {
      console.error("모임 생성 오류:", error);
      showToast(error instanceof Error ? error.message : "모임 생성 중 알 수 없는 오류가 발생했습니다.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 모임 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            모임 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
          />
        </div>

        {/* 날짜 및 시간 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
              날짜 <span className="text-red-500">*</span>
            </label>
            {/* 실제 프로젝트에서는 react-datepicker 같은 라이브러리 사용 권장 */}
            <input
              type="date"
              id="eventDate"
              value={eventDate ? eventDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEventDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
            />
          </div>
          <div>
            <label htmlFor="eventTime" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
              시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="eventTime"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
            />
          </div>
        </div>

        {/* 장소 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            장소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
            placeholder="예: 여의도 한강공원 C지구"
          />
          {/* 여기에 KakaoMapSearch 컴포넌트를 추가할 수 있습니다. */}
          {/* <KakaoMapSearch onPlaceSelect={handlePlaceSelected} initialKeyword={location} /> */}
        </div>

        {/* 모임 종류 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">모임 종류</label>
          <div className="flex items-center space-x-4 mt-1">
            <label htmlFor="personal" className="flex items-center cursor-pointer">
              <input
                type="radio"
                id="personal"
                name="eventType"
                value="personal"
                checked={eventType === 'personal'}
                onChange={(e) => setEventType(e.target.value)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-[rgb(var(--foreground-rgb))]">개인벙 (번개)</span>
            </label>
    
            <label htmlFor="regular" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="regular"
                  name="eventType"
                  value="regular"
                  checked={eventType === 'regular'}
                  onChange={(e) => setEventType(e.target.value)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-[rgb(var(--foreground-rgb))]">정기벙</span>
            </label>
          </div>
        </div>

        {/* 최대 참여 인원 (정기벙 선택 시) */}
        {eventType === 'regular' && (
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
              최대 참여 인원 (정기벙) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min="1"
              className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
              placeholder="숫자만 입력 (예: 20)"
            />
          </div>
        )}

        {/* 공지사항 */}
        <div>
          <label htmlFor="notice" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            공지사항 / 모임 설명
          </label>
          <textarea
            id="notice"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            rows={5}
            className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
            placeholder="모임에 대한 자세한 내용을 자유롭게 입력해주세요. (준비물, 드레스코드, 회비 안내, 특이사항 등)"
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : '모임 만들기'}
          </button>
        </div>
      </form>

      {/* Toast 컴포넌트 */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
        duration={toast.type === 'error' ? 5000 : 3000} // 에러 메시지는 조금 더 길게 표시
      />
    </>
  );
}