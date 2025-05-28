// src/app/page.tsx
import Link from 'next/link';
import React from 'react';
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiPlusCircle,
  FiActivity,
  FiClipboard,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import DashboardCard from '../component/DashboardCard'; // 경로 확인

// 임시 데이터 (이전과 동일)
const MOCK_DATA = {
  // ... (MOCK_DATA 내용) ...
  upcomingEvents: [
   { id: 'evt001', name: "새벽 정기런 (한강)", date: "2024-07-28", time: "06:00", participants: 15, capacity: 30, location: "여의도 한강공원" },
   { id: 'evt002', name: "주말 트레일 러닝 (북한산)", date: "2024-08-03", time: "09:00", participants: 8, capacity: 15, location: "북한산성 입구" },
 ],
 recentActivities: [
   { id: 'act001', user: "김러너", action: "새 모임 '저녁 인터벌 트레이닝' 생성", time: "2시간 전" },
   { id: 'act002', user: "이운영", action: "회원 '박참가' 출석 처리", time: "5시간 전" },
   { id: 'act003', user: "최크루", action: "8월 회비 납부 완료", time: "어제" },
 ],
 stats: {
   totalMembers: 120,
   activeMembers: 95,
   monthlyAttendanceRate: 78.5,
   pendingFeePayments: 7,
 },
};

// 웹용 빠른 실행 버튼 데이터 (모바일용은 MobileBottomNav.tsx 로 이동 또는 공유)
const quickActionsForWeb = [
  { href: "/events/new", icon: <FiPlusCircle />, label: "새 모임 만들기", color: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 dark:focus:ring-blue-500" },
  { href: "/members", icon: <FiUsers />, label: "회원 관리", color: "bg-green-500 hover:bg-green-600 focus:ring-green-400 dark:focus:ring-green-500" },
  { href: "/attendance", icon: <FiCheckCircle />, label: "출석 체크", color: "bg-yellow-500 hover:bg-yellow-600 text-yellow-900 focus:ring-yellow-400 dark:focus:ring-yellow-500" },
  { href: "/finance", icon: <FiDollarSign />, label: "회비 관리", color: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-400 dark:focus:ring-purple-500" },
];

export default function AdminDashboardPage() {
  return (
    // 최상위 div에서 pb-24 sm:pb-0 제거 (layout.tsx에서 body에 적용)
    <div className="space-y-6 sm:space-y-8"> 
      {/* 환영 메시지 */}
      <section aria-labelledby="welcome-heading">
        <h1 id="welcome-heading" className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--foreground-rgb))]">
          안녕하세요, 운영진님! 👋
        </h1>
        <p className="mt-1 text-base sm:text-lg text-[rgb(var(--muted-foreground-rgb))]">
          오늘의 크루 현황을 확인하고 주요 업무를 처리하세요.
        </p>
      </section>

      {/* 빠른 실행 버튼 - 웹 (sm 이상 화면에서 보임) */}
      <section aria-label="빠른 실행 메뉴 (웹)" className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickActionsForWeb.map((action) => ( // quickActionsForWeb 사용
          <Link 
            key={action.href} 
            href={action.href} 
            className={`quick-action-button ${action.color}`}
          >
            {React.cloneElement(action.icon, { className: "w-5 h-5 mr-2 flex-shrink-0" })}
            {action.label}
          </Link>
        ))}
      </section>
      
      {/* 주요 통계 (이전과 동일) */}
      <section aria-label="주요 통계">
        {/* ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
         <DashboardCard title="총 회원 수" icon={<FiUsers />}>
           <p className="text-3xl font-bold text-[rgb(var(--foreground-rgb))]">{MOCK_DATA.stats.totalMembers}명</p>
         </DashboardCard>
         <DashboardCard title="월간 출석률" icon={<FiTrendingUp />}>
           <p className="text-3xl font-bold text-green-600 dark:text-green-400">{MOCK_DATA.stats.monthlyAttendanceRate}%</p>
         </DashboardCard>
         <DashboardCard title="활성 멤버" icon={<FiActivity />}>
           <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{MOCK_DATA.stats.activeMembers}명</p>
         </DashboardCard>
         <DashboardCard title="회비 미납" icon={<FiAlertCircle />}>
           <p className="text-3xl font-bold text-red-600 dark:text-red-400">{MOCK_DATA.stats.pendingFeePayments}명</p>
           <Link href="/finance/unpaid" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block">상세 보기</Link>
         </DashboardCard>
       </div>
      </section>

      {/* 예정된 모임 및 최근 활동 (이전과 동일) */}
      <section aria-label="예정된 모임 및 최근 활동" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ... */}
        <DashboardCard 
         title="예정된 모임" 
         icon={<FiCalendar />} 
         className="lg:col-span-2"
         actions={<Link href="/events" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">모두 보기</Link>}
       >
         {MOCK_DATA.upcomingEvents.length > 0 ? (
           <ul className="space-y-3">
             {MOCK_DATA.upcomingEvents.map(event => (
               <li key={event.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group">
                 <Link href={`/events/${event.id}`} className="block">
                   <div className="flex justify-between items-start">
                     <h3 className="font-medium text-sm sm:text-base text-[rgb(var(--foreground-rgb))] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.name}</h3>
                     <span className="text-xs sm:text-sm text-[rgb(var(--muted-foreground-rgb))] whitespace-nowrap ml-2">{event.date} {event.time}</span>
                   </div>
                   <p className="text-xs text-[rgb(var(--muted-foreground-rgb))] mt-1">
                     장소: {event.location}
                   </p>
                   <p className="text-xs text-[rgb(var(--muted-foreground-rgb))] mt-0.5">
                     참여: {event.participants} / {event.capacity}명
                   </p>
                 </Link>
               </li>
             ))}
           </ul>
         ) : (
           <p className="text-[rgb(var(--muted-foreground-rgb))]">예정된 모임이 없습니다.</p>
         )}
       </DashboardCard>

       <DashboardCard 
         title="최근 활동 로그" 
         icon={<FiClipboard />}
         actions={<Link href="/activity-log" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">전체 로그</Link>}
       >
         {MOCK_DATA.recentActivities.length > 0 ? (
           <ul className="space-y-2.5">
             {MOCK_DATA.recentActivities.map(activity => (
               <li key={activity.id} className="text-xs sm:text-sm">
                 <span className="font-medium text-[rgb(var(--foreground-rgb))]">{activity.user}</span>: {activity.action}
                 <span className="block text-[rgb(var(--muted-foreground-rgb))] text-xs">{activity.time}</span>
               </li>
             ))}
           </ul>
         ) : (
           <p className="text-[rgb(var(--muted-foreground-rgb))]">최근 활동이 없습니다.</p>
         )}
       </DashboardCard>
      </section>

      {/* 모바일용 하단 고정 버튼 코드는 여기서 제거 */}
    </div>
  );
}