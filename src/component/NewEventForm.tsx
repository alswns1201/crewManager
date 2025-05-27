// src/components/events/NewEventForm.tsx
"use client"; // 클라이언트 컴포넌트로 만들어야 useState, 이벤트 핸들러 등 사용 가능

import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation'; // 페이지 이동 시 사용
// import DatePicker from "react-datepicker"; // 예시 DatePicker
// import "react-datepicker/dist/react-datepicker.css";

// (가정) 현재 로그인한 사용자 정보 (추후 실제 인증 시스템에서 가져옴)
const MOCK_CURRENT_USER = { id: 'user123', role: 'member' }; // 'admin' 또는 'member'

export default function NewEventForm() {
  // const router = useRouter();
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('personal'); // 'personal' or 'regular'
  const [maxParticipants, setMaxParticipants] = useState<number | string>(''); // 정기벙일때만
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 유효성 검사 (간단 예시)
    if (!title || !eventDate || !eventTime || !location) {
      setError("모든 필수 항목을 입력해주세요.");
      setIsSubmitting(false);
      return;
    }
    if (eventType === 'regular' && (!maxParticipants || Number(maxParticipants) < 1)) {
      setError("정기벙의 경우 유효한 최대 참여 인원을 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      title,
      date: eventDate?.toISOString().split('T')[0], // YYYY-MM-DD 형식
      time: eventTime,
      location,
      type: eventType,
      organizerId: MOCK_CURRENT_USER.id, // 현재 로그인 사용자 ID
      maxParticipants: eventType === 'regular' ? Number(maxParticipants) : null,
      notice,
      createdAt: new Date().toISOString(),
    };

    console.log("새 모임 데이터:", eventData); // 실제로는 API 호출

    // 임시 성공 처리 (2초 후)
    setTimeout(() => {
      setIsSubmitting(false);
      alert("모임이 성공적으로 생성되었습니다!");
      // 폼 초기화 또는 페이지 이동
      // router.push('/events'); // 예시: 모임 목록으로 이동
      setTitle('');
      setEventDate(null);
      // ... 다른 상태들도 초기화
    }, 2000);
  };

  const canCreateRegularEvent = MOCK_CURRENT_USER.role === 'admin';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
          모임 제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            날짜
          </label>
          {/* DatePicker 컴포넌트 사용 권장 */}
          <input
             type="date"
             id="eventDate"
             value={eventDate ? eventDate.toISOString().split('T')[0] : ''}
             onChange={(e) => setEventDate(e.target.value ? new Date(e.target.value) : null)}
             className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
             required
          />
          {/* <DatePicker selected={eventDate} onChange={(date: Date | null) => setEventDate(date)} className="w-full p-2 ..." /> */}
        </div>
        <div>
          <label htmlFor="eventTime" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            시간
          </label>
          <input
            type="time"
            id="eventTime"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
          장소
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
          placeholder="예: 여의도 한강공원"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">모임 종류</label>
        <div className="flex items-center space-x-4">
          <label htmlFor="personal" className="flex items-center">
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
          {canCreateRegularEvent && ( // 운영진만 정기벙 생성 가능
             <label htmlFor="regular" className="flex items-center">
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
          )}
        </div>
      </div>

      {eventType === 'regular' && canCreateRegularEvent && (
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-[rgb(var(--muted-foreground-rgb))] mb-1">
            최대 참여 인원 (정기벙)
          </label>
          <input
            type="number"
            id="maxParticipants"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            min="1"
            className="w-full p-2 border border-[rgb(var(--card-border-rgb))] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]"
          />
        </div>
      )}

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
          placeholder="모임에 대한 자세한 내용을 입력해주세요. (준비물, 드레스코드, 특이사항 등)"
        ></textarea>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? '생성 중...' : '모임 만들기'}
        </button>
      </div>
    </form>
  );
}