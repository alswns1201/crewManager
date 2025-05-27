// src/app/events/new/page.tsx
import NewEventForm from '../../../component/NewEventForm'; // 폼 컴포넌트 경로 (예시)

export default function NewEventAdd() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-[rgb(var(--foreground-rgb))]">
        새로운 모임 만들기 🏃‍♀️🏃‍♂️
      </h1>
      <div className="max-w-2xl mx-auto bg-[rgb(var(--card-rgb))] p-6 sm:p-8 rounded-xl shadow-lg">
        <NewEventForm />
      </div>
    </div>
  );
}