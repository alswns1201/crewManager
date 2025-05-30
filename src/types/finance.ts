export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface IncomeDetail {
  description: string;
  amount: number;
  date: string;
}

export interface MonthlyFinanceData {
  year: number;
  month: number;
  membershipFeePerPerson?: number;
  totalMembers?: number;
  income: {
    total: number; // 이 필드는 계산될 수 있으므로, API 응답에 따라 선택적으로 포함하거나 제외할 수 있습니다.
    details: IncomeDetail[];
  };
  expenses: ExpenseItem[];
  previousBalance: number;
  onDownloadPDF?: () => void; // Receipt 컴포넌트에서 PDF 다운로드 핸들러를 받기 위함
}