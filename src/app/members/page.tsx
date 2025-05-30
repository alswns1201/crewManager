// src/app/members/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, Fragment } from 'react'; // Fragment 추가
import {
  FiUserCheck, FiUserX, FiDollarSign, FiFilter, FiSearch, FiAlertTriangle,
  FiCheckCircle, FiMail, FiChevronDown, FiChevronUp, FiCircle
} from 'react-icons/fi';

// --- 데이터 타입 정의 ---
import type { Member,MemberActivitySummary,MonthlyActivityLog } from '@/types/members'; // 타입 임포트 (경로 확인!)


const RULES = {
  minGroupRuns: 1,
  minPersonalRuns: 2,
  feeRequired: true,
};

// --- 목업 데이터 (activityLogThisMonth 추가) ---
const MOCK_MEMBERS_DATA: Member[] = [
  {
    id: 'mem001', name: "김러너", joinDate: "2023-01-15", role: '일반회원', isFeePaidThisMonth: true,
    activitySummaryThisMonth: { personalRuns: 3, groupRuns: 2 },
    activityLogThisMonth: [
      { date: "2024-07-01", type: 'personal' }, { date: "2024-07-05", type: 'group' },
      { date: "2024-07-10", type: 'personal' }, { date: "2024-07-15", type: 'group' },
      { date: "2024-07-20", type: 'personal' },
    ]
  },
  {
    id: 'mem002', name: "이활동", joinDate: "2023-05-20", role: '일반회원', isFeePaidThisMonth: true,
    activitySummaryThisMonth: { personalRuns: 1, groupRuns: 1 }, // 개인런 부족
    activityLogThisMonth: [
      { date: "2024-07-03", type: 'personal' }, { date: "2024-07-12", type: 'group' },
    ]
  },
  {
    id: 'mem003', name: "박회비", joinDate: "2023-08-10", role: '일반회원', isFeePaidThisMonth: false, // 회비 미납
    activitySummaryThisMonth: { personalRuns: 4, groupRuns: 3 },
    activityLogThisMonth: [/* ... 데이터 ... */],
  },
  // ... 나머지 회원 데이터도 activityLogThisMonth 추가 ...
  { id: 'mem004', name: "최운영", joinDate: "2022-11-01", role: '운영진', isFeePaidThisMonth: true, activitySummaryThisMonth: { personalRuns: 5, groupRuns: 4 } },
  { id: 'mem005', name: "정참여", joinDate: "2024-01-05", role: '일반회원', isFeePaidThisMonth: true, activitySummaryThisMonth: { personalRuns: 2, groupRuns: 0 } },
  { id: 'mem006', name: "강신입", joinDate: "2024-06-15", role: '일반회원', isFeePaidThisMonth: true, activitySummaryThisMonth: { personalRuns: 0, groupRuns: 0 } },
  { id: 'mem007', name: "조모범", joinDate: "2023-03-01", role: '일반회원', isFeePaidThisMonth: true, activitySummaryThisMonth: { personalRuns: 10, groupRuns: 5 } },
];


const checkRuleCompliance = (member: Member): { metAll: boolean; reasons: string[]; feeIssue: boolean; activityIssue: boolean } => {
  const reasons: string[] = [];
  let feeIssue = false;
  let activityIssue = false;

  if (RULES.feeRequired && !member.isFeePaidThisMonth) {
    reasons.push("회비 미납");
    feeIssue = true;
  }
  if (member.role === '일반회원') {
    if (member.activitySummaryThisMonth.groupRuns < RULES.minGroupRuns) {
      reasons.push(`정기모임 부족`);
      activityIssue = true;
    }
    if (member.activitySummaryThisMonth.personalRuns < RULES.minPersonalRuns) {
      reasons.push(`개인런 부족`);
      activityIssue = true;
    }
  }
  return { metAll: reasons.length === 0, reasons, feeIssue, activityIssue };
};

const handlePushNotification = (member: Member, reasons: string[]) => {
  const reasonText = reasons.join(', ');
  alert(`${member.name}님에게 "${reasonText}" 사유로 알림을 보냅니다. (실제 발송 기능 필요)`);
};

const ITEMS_PER_PAGE = 10;

// --- 월간 활동 달력 컴포넌트 ---
interface ActivityCalendarProps {
  logs?: MonthlyActivityLog[];
  year: number; // 현재 표시하려는 년도
  month: number; // 현재 표시하려는 월 (1-12)
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ logs = [], year, month }) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 총 일수
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 해당 월의 시작 요일 (0:일요일, 6:토요일)

  const calendarDays = [];
  // 앞쪽 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-prev-${i}`} className="border border-gray-200 dark:border-gray-700 p-1 h-10 sm:h-12"></div>);
  }
  // 실제 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const activitiesOnDate = logs.filter(log => log.date === dateStr);
    calendarDays.push(
      <div key={dateStr} className="border border-gray-200 dark:border-gray-700 p-1 h-10 sm:h-12 flex flex-col items-center justify-center relative">
        <span className="text-xs text-gray-500 dark:text-gray-400 absolute top-0.5 left-0.5">{day}</span>
        <div className="flex space-x-0.5 mt-2">
          {activitiesOnDate.map((activity, index) => (
            activity.type === 'group'
              ? <FiCircle key={`${dateStr}-group-${index}`}  fill="rgb(var(--color-yellow-500))"  className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-500 text-red-500 fill-current" title="정기모임" />
              : <FiCircle key={`${dateStr}-personal-${index}`} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-500  text-yellow-500 fill-current" title="개인런" />
          ))}
        </div>
      </div>
    );
  }
  // 뒤쪽 빈 칸 채우기 (6주 기준으로 맞추기 위함 - 선택사항)
  // const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  // for (let i = calendarDays.length; i < totalCells; i++) {
  //   calendarDays.push(<div key={`empty-next-${i}`} className="border border-gray-200 dark:border-gray-700 p-1 h-10 sm:h-12"></div>);
  // }


  return (
    <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
      <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{year}년 {month}월 활동 내역</h4>
      <div className="grid grid-cols-7 gap-px text-xs text-center mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map(dayName => (
          <div key={dayName} className="font-medium text-gray-500 dark:text-gray-400">{dayName}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {calendarDays}
      </div>
    </div>
  );
};


export default function MembersPage() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'needsAttention' | 'feeUnpaid' | 'activityLow'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null); // 확장된 회원 ID

  // 현재 년/월 (활동 달력 표시에 사용)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 0-11 이므로 +1

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // 목업 데이터에 isExpanded 속성 초기화
      setAllMembers(MOCK_MEMBERS_DATA.map(m => ({ ...m, isExpanded: false })));
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleExpandMember = (memberId: string) => {
    setExpandedMemberId(prevId => (prevId === memberId ? null : memberId));
    // 만약 각 member 객체에 isExpanded 상태를 둔다면 아래와 같이 처리
    // setAllMembers(prevMembers =>
    //   prevMembers.map(m =>
    //     m.id === memberId ? { ...m, isExpanded: !m.isExpanded } : { ...m, isExpanded: false } // 하나만 확장
    //   )
    // );
  };


  const filteredAndSortedMembers = useMemo(() => {
    // ... (이전 필터링 로직 동일) ...
    return allMembers
      .filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(member => {
        if (filter === 'all') return true;
        const compliance = checkRuleCompliance(member);
        if (filter === 'needsAttention') return !compliance.metAll;
        if (filter === 'feeUnpaid') return compliance.feeIssue;
        if (filter === 'activityLow') return compliance.activityIssue;
        return true;
      });
  }, [allMembers, searchTerm, filter]);

  const paginatedMembers = useMemo(() => {
    // ... (이전 페이지네이션 로직 동일) ...
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedMembers.slice(startIndex, endIndex);
  }, [filteredAndSortedMembers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedMembers.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    // ... (이전 페이지 변경 로직 동일) ...
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
  };

  if (isLoading) {
    // ... (로딩 UI 동일) ...
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <p className="text-lg text-[rgb(var(--muted-foreground-rgb))]">회원 목록을 불러오는 중입니다...</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 및 컨트롤 (이전과 동일) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--foreground-rgb))]">회원 현황</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-grow sm:flex-grow-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="이름 검색..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value as any); setCurrentPage(1); }}
                className="appearance-none pr-8 py-2 pl-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              >
                <option value="all">전체</option>
                <option value="needsAttention">조치 필요</option>
                <option value="feeUnpaid">회비 미납</option>
                <option value="activityLow">활동 부족</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground-rgb))]">
          총 {filteredAndSortedMembers.length}명 검색됨 (페이지당 {ITEMS_PER_PAGE}명)
        </p>
      </div>

      {/* 회원 목록 (테이블은 유지하되, 클릭 시 확장 기능 추가) */}
      <div className="bg-[rgb(var(--card-rgb))] shadow-md rounded-lg border border-[rgb(var(--card-border-rgb))]">
        {paginatedMembers.length > 0 ? (
          paginatedMembers.map((member) => {
            const compliance = checkRuleCompliance(member);
            const isExpanded = expandedMemberId === member.id; // 현재 확장된 회원인지 확인
            // const isExpanded = member.isExpanded; // 각 member 객체에 상태를 둔다면

            const rowBaseColor = !compliance.metAll
              ? 'bg-yellow-50 dark:bg-yellow-900/30'
              : 'bg-white dark:bg-gray-800';
            const rowHoverColor = !compliance.metAll
              ? 'hover:bg-yellow-100 dark:hover:bg-yellow-800/40'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50';

            return (
              <Fragment key={member.id}>
                <div
                  className={`flex items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${rowBaseColor} ${rowHoverColor} transition-colors`}
                  onClick={() => toggleExpandMember(member.id)}
                >
                  {/* 프로필 & 이름 */}
                  <div className="flex items-center flex-1 min-w-0 mr-2 sm:mr-4">
                    {member.profileImageUrl ? (
                      <img className="h-10 w-10 rounded-full mr-3 object-cover flex-shrink-0" src={member.profileImageUrl} alt={member.name} />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3 text-white dark:text-gray-300 font-semibold flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{member.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                    </div>
                  </div>

                  {/* 회비 & 활동 요약 (모바일에서는 아이콘 위주) */}
                  <div className="flex items-center space-x-2 sm:space-x-3 text-center flex-shrink-0 mx-2 sm:mx-4">
                    <div title="회비">
                      {member.isFeePaidThisMonth
                        ? <FiCheckCircle className="w-5 h-5 text-green-500" />
                        : <FiDollarSign className="w-5 h-5 text-red-500" />}
                    </div>
                    <div title={`정기 ${member.activitySummaryThisMonth.groupRuns} / 개인 ${member.activitySummaryThisMonth.personalRuns}`}>
                      {compliance.activityIssue
                        ? <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
                        : <FiCheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                  </div>

                  {/* 조치 버튼 & 확장 아이콘 */}
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {!compliance.metAll && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePushNotification(member, compliance.reasons); }}
                        className="p-1.5 text-xs font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 flex items-center"
                        title="알림 보내기"
                      >
                        <FiMail className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline ml-1">알림</span>
                      </button>
                    )}
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "활동내역 닫기" : "활동내역 보기"}
                    >
                      {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* 확장된 활동 달력 */}
                {isExpanded && (
                  <ActivityCalendar
                    logs={member.activityLogThisMonth}
                    year={currentYear} // 실제로는 해당 회원의 활동이 있는 달을 기준으로 해야 함
                    month={currentMonth} // 또는 선택된 달
                  />
                )}
              </Fragment>
            );
          })
        ) : (
          <div className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
            {searchTerm || filter !== 'all' ? `조건에 맞는 회원이 없습니다.` : "등록된 회원이 없습니다."}
          </div>
        )}
      </div>


      {/* 페이지네이션 컨트롤 (이전과 동일) */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2 font-[family-name:var(--font-geist-sans)]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={currentPage === pageNumber}
              className={`px-3 py-1 border rounded-md text-sm hover:bg-gray-100 disabled:bg-blue-500 disabled:text-white disabled:border-blue-500 dark:border-gray-600 dark:hover:bg-gray-700 ${currentPage === pageNumber ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}