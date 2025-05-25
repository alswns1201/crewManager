// src/app/page.tsx
import Link from 'next/link';
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

// 임시 데이터 (실제로는 API 호출 또는 상태 관리 라이브러리를 통해 가져옵니다)
const MOCK_DATA = {
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

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className, actions }) => {
  return (
    <article className={`dashboard-card p-5 sm:p-6 flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-blue-500 dark:text-blue-400 text-2xl sm:text-3xl flex-shrink-0">{icon}</span>
          <h2 className="text-lg sm:text-xl font-semibold text-[rgb(var(--foreground-rgb))]">{title}</h2>
        </div>
        {actions && <div className="text-sm flex-shrink-0 ml-2">{actions}</div>}
      </div>
      <div className="text-sm sm:text-base text-[rgb(var(--muted-foreground-rgb))] flex-grow">
        {children}
      </div>
    </article>
  );
};

export default function AdminDashboardPage() {
  return (
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

      {/* 빠른 실행 버튼 */}
      <section aria-label="빠른 실행 메뉴">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/events/new" className="quick-action-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 dark:focus:ring-blue-500">
            <FiPlusCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 새 모임 만들기
          </Link>
          <Link href="/members" className="quick-action-button bg-green-500 hover:bg-green-600 focus:ring-green-400 dark:focus:ring-green-500">
            <FiUsers className="w-5 h-5 mr-2 flex-shrink-0" /> 회원 관리
          </Link>
          <Link href="/attendance" className="quick-action-button bg-yellow-500 hover:bg-yellow-600 text-yellow-900 focus:ring-yellow-400 dark:focus:ring-yellow-500">
            <FiCheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 출석 체크
          </Link>
          <Link href="/finance" className="quick-action-button bg-purple-500 hover:bg-purple-600 focus:ring-purple-400 dark:focus:ring-purple-500">
            <FiDollarSign className="w-5 h-5 mr-2 flex-shrink-0" /> 회비 관리
          </Link>
        </div>
      </section>
      
      {/* 주요 통계 */}
      <section aria-label="주요 통계">
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

      {/* 예정된 모임 및 최근 활동 */}
      <section aria-label="예정된 모임 및 최근 활동" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
    </div>
  );
}