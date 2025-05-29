// src/app/finance/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiPrinter, FiShare2, FiArrowLeft, FiCalendar, FiDollarSign, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- 목업 데이터 및 Receipt 컴포넌트는 이전 답변과 동일하게 유지 ---
// (MonthlyFinanceData, ALL_MONTHLY_DATA, formatCurrency, Receipt 컴포넌트 정의는 그대로 둡니다.)
// ... (이전 답변의 목업 데이터 및 Receipt 컴포넌트 코드 부분) ...
interface ExpenseItem {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }
  
  interface IncomeDetail {
    description: string;
    amount: number;
    date: string;
  }
  
  interface MonthlyFinanceData {
    year: number;
    month: number;
    membershipFeePerPerson?: number; // 선택적으로 변경
    totalMembers?: number; // 선택적으로 변경
    income: {
      total: number;
      details: IncomeDetail[];
    };
    expenses: ExpenseItem[];
    previousBalance: number; // 해당 월 시작 시점의 잔액 (이월금)
    onDownloadPDF?: () => void; // PDF 다운로드 핸들러 (선택)
  }
  
  // 여러 달의 목업 데이터 (3개월치 예시)
  const ALL_MONTHLY_DATA: MonthlyFinanceData[] = [
    { // 2024년 5월
      year: 2024, month: 5, previousBalance: 400000,
      income: { total: 2850000, details: [{ description: "정기 회비 (5월)", amount: 2850000, date: "2024-05-01" }] },
      expenses: [
        { id: 'exp001-may', description: "5월 정기런 음료", amount: 120000, date: "2024-05-05", category: "간식비" },
        { id: 'exp002-may', description: "홍보물 제작", amount: 80000, date: "2024-05-15", category: "운영비" },
      ],
    },
    { // 2024년 6월
      year: 2024, month: 6, previousBalance: 0, // 계산 필요
      income: { total: 2700000, details: [{ description: "정기 회비 (6월)", amount: 2700000, date: "2024-06-01" }] },
      expenses: [
        { id: 'exp001-jun', description: "6월 회식 지원", amount: 300000, date: "2024-06-18", category: "행사비" },
      ],
    },
    { // 2024년 7월 (이전 예시 데이터)
      year: 2024, month: 7, previousBalance: 0, // 계산 필요
      income: { total: 2850000, details: [{ description: "정기 회비 (7월)", amount: 2850000, date: "2024-07-01" }] },
      expenses: [
        { id: 'exp001-jul', description: "정기런 후 간식 구매", amount: 150000, date: "2024-07-06", category: "간식비" },
        { id: 'exp002-jul', description: "크루 운영 비품 구매", amount: 55000, date: "2024-07-10", category: "운영비" },
        { id: 'exp003-jul', description: "월례회 장소 대관료", amount: 200000, date: "2024-07-20", category: "행사비" },
        { id: 'exp004-jul', description: "게스트 코치 초청 비용", amount: 100000, date: "2024-07-25", category: "특별지출" },
      ],
    },
  ];
  
  // 이전 달 잔액을 다음 달 previousBalance로 업데이트하는 로직 (목업 데이터용)
  for (let i = 0; i < ALL_MONTHLY_DATA.length; i++) {
    if (i > 0) {
      const prevMonthData = ALL_MONTHLY_DATA[i-1];
      const prevTotalIncome = prevMonthData.income.details.reduce((sum, item) => sum + item.amount, 0);
      const prevTotalExpenses = prevMonthData.expenses.reduce((sum, item) => sum + item.amount, 0);
      ALL_MONTHLY_DATA[i].previousBalance = prevMonthData.previousBalance + prevTotalIncome - prevTotalExpenses;
    }
  }
  
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };
  
  // --- 영수증 UI를 별도 컴포넌트로 분리 ---
  interface ReceiptProps {
    data: MonthlyFinanceData;
  }
  
  const Receipt: React.FC<ReceiptProps> = ({ data }) => {
    const { year, month, income, expenses, previousBalance, onDownloadPDF } = data; // onDownloadPDF 추가
  
    const totalIncome = income.details.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const currentBalance = previousBalance + totalIncome - totalExpenses;
  
    const currentMonthDisplay = `${year}년 ${month}월`;
    const receiptIssueDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  
    return (
      <div className="bg-white dark:bg-slate-50 shadow-lg rounded-sm overflow-hidden border border-gray-300 dark:border-gray-400 text-black w-full flex-shrink-0">
        <header className="text-center p-6 border-b-2 border-black border-dashed">
          <FiDollarSign className="w-10 h-10 text-black mx-auto mb-2" />
          <h2 className="text-3xl font-bold tracking-wider">CrewManager Pro</h2>
          <p className="text-sm text-gray-600 mt-1">회 비 정 산 서</p>
          <p className="text-lg font-semibold mt-4">{currentMonthDisplay}</p>
          <p className="text-xs text-gray-500 mt-1">발행일: {receiptIssueDate}</p>
        </header>
  
        <section className="p-5 sm:p-6 space-y-5 text-sm">
          <div className="receipt-section">
            <h3 className="receipt-section-title">수 입 내 역</h3>
            {income.details.map((item, index) => (
              <div key={`income-${index}-${month}`} className="receipt-item">
                <span>{item.description} <span className="text-xs text-gray-500">({item.date})</span></span>
                <span className="font-semibold text-green-700">+{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="receipt-total">
              <span>총 수 입</span>
              <span className="text-green-700">{formatCurrency(totalIncome)}</span>
            </div>
          </div>
  
          <div className="receipt-section">
            <h3 className="receipt-section-title">지 출 내 역</h3>
            {expenses.length > 0 ? (
              expenses.map((item) => (
                <div key={`${item.id}-${month}`} className="receipt-item">
                  <div className="flex-grow pr-2">
                    <span>{item.description}</span>
                    <span className="block text-xs text-gray-500">{item.date} - {item.category}</span>
                  </div>
                  <span className="font-semibold text-red-700 whitespace-nowrap">-{formatCurrency(item.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-2 text-center">지출 내역이 없습니다.</p>
            )}
            <div className="receipt-total">
              <span>총 지 출</span>
              <span className="text-red-700">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
  
          <hr className="border-t-2 border-black border-dashed my-6" />
  
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">전월 이월금:</span>
              <span className="text-gray-800">{formatCurrency(previousBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">당월 총수입:</span>
              <span className="text-green-700">+{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">당월 총지출:</span>
              <span className="text-red-700">-{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t-2 border-black">
            <div className="flex justify-between items-baseline text-xl font-bold">
              <span className="text-black">최 종 잔 액</span>
              <span className="text-blue-700">{formatCurrency(currentBalance)} 원</span>
            </div>
          </div>
        </section>
  
        <footer className="text-center p-6 border-t-2 border-black border-dotted mt-4">
          <p className="text-xs text-gray-600 mb-4">
            이용해주셔서 감사합니다.
            <br />
            CrewManager Pro 드림
          </p>
          <button 
            onClick={onDownloadPDF || (() => alert('PDF 다운로드 기능 준비 중입니다.'))}
            className="font-[family-name:var(--font-geist-sans)] inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FiDownload className="w-3 h-3 mr-1.5" /> PDF 다운로드
          </button>
        </footer>
      </div>
    );
  };
  
// --- FinancePage 컴포넌트 ---
export default function FinancePage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(ALL_MONTHLY_DATA.length - 1);
  const [financeData, setFinanceData] = useState<MonthlyFinanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFinanceData(ALL_MONTHLY_DATA);
      setCurrentMonthIndex(ALL_MONTHLY_DATA.length > 0 ? ALL_MONTHLY_DATA.length - 1 : 0);
      setIsLoading(false);
    }, 500);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0)); // 0보다 작아지지 않도록 수정
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) => 
      (prevIndex < financeData.length - 1 ? prevIndex + 1 : financeData.length - 1) // 배열 범위 초과하지 않도록 수정
    );
  };
  
  const currentData = financeData[currentMonthIndex];

  // PDF 다운로드 핸들러 (예시)
  const handleDownloadPDF = () => {
    if (currentData) {
      alert(`${currentData.year}년 ${currentData.month}월 영수증 PDF 다운로드 시작! (실제 기능 구현 필요)`);
      // 여기에 실제 PDF 생성 및 다운로드 로직을 구현합니다.
      // (예: react-pdf, jspdf 라이브러리 사용)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] font-[family-name:var(--font-geist-sans)]">
        <p className="text-lg text-[rgb(var(--muted-foreground-rgb))]">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!currentData && !isLoading) { // 로딩이 끝났는데 데이터가 없을 경우
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiArrowLeft className="w-6 h-6 text-[rgb(var(--muted-foreground-rgb))]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-[rgb(var(--foreground-rgb))]">회비 정산서</h1>
          <div></div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          표시할 회비 정산 데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-2 sm:p-4 font-[family-name:var(--font-geist-mono)]"> {/* 전체 너비 살짝 조정 */}
      {/* 페이지 헤더 (영수증 외부) */}
      <div className="flex items-center justify-between mb-4 font-[family-name:var(--font-geist-sans)]">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="뒤로 가기">
          <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--muted-foreground-rgb))]" />
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold text-[rgb(var(--foreground-rgb))]">
          {currentData?.year}년 {currentData?.month}월 정산
        </h1>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="현재 영수증 인쇄">
            <FiPrinter className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--muted-foreground-rgb))]" />
          </button>
        </div>
      </div>

      {/* 영수증 및 좌우 이동 버튼 컨테이너 */}
      <div className="relative flex items-center justify-center">
        {/* 이전 달 버튼 */}
        <button
          onClick={handlePrevMonth}
          disabled={currentMonthIndex === 0 || isLoading}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 transform active:scale-90 -ml-3 sm:-ml-5"
          aria-label="이전 달 영수증"
        >
          <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* 영수증 카드 (가운데) */}
        <div className="w-full max-w-md transition-opacity duration-300 ease-in-out"> {/* 너비 제한 및 트랜지션 */}
          {currentData && <Receipt data={{...currentData, onDownloadPDF: handleDownloadPDF }} />}
        </div>

        {/* 다음 달 버튼 */}
        <button
          onClick={handleNextMonth}
          disabled={currentMonthIndex === financeData.length - 1 || isLoading}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 transform active:scale-90 -mr-3 sm:-mr-5"
          aria-label="다음 달 영수증"
        >
          <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}