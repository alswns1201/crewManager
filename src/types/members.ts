export interface MonthlyActivityLog {
  date: string;
  type: 'group' | 'personal';
}

export interface MemberActivitySummary { // 요약 정보용
  personalRuns: number;
  groupRuns: number;
}

export interface Member {
  id: string;
  name: string;
  joinDate: string;
  role: '운영진' | '일반회원';
  isFeePaidThisMonth: boolean;
  activitySummaryThisMonth: MemberActivitySummary; // 요약된 활동 횟수
  activityLogThisMonth?: MonthlyActivityLog[]; // 상세 활동 로그 (선택적)
  profileImageUrl?: string;
  isExpanded?: boolean; // 행 확장 상태
}