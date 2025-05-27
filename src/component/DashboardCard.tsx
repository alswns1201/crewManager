import React from 'react'; // React 임포트 추가
// 필요한 아이콘 타입이 있다면 임포트 (예: react-icons)

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

export default DashboardCard; // 컴포넌트를 default로 export