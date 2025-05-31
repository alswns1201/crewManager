// src/app/finance/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiPrinter, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Receipt from '@/component/finance/Receipt';
import type { MonthlyFinanceData } from '@/types/finance'; // 타입 임포트 (경로 확인!)

// --- 목업 데이터 (페이지 내부에 유지하거나, 별도 파일로 분리 가능) ---
const ALL_MOCK_DATA: MonthlyFinanceData[] = [
  {
    year: 2024, month: 5, previousBalance: 400000,
    income: { total: 2850000, details: [{ description: "정기 회비 (5월)", amount: 2850000, date: "2024-05-01" }] },
    expenses: [
      { id: 'exp001-may', description: "5월 정기런 음료", amount: 120000, date: "2024-05-05", category: "간식비" },
      { id: 'exp002-may', description: "홍보물 제작", amount: 80000, date: "2024-05-15", category: "운영비" },
    ],
  },
  {
    year: 2024, month: 6, previousBalance: 0, // 계산 필요
    income: { total: 2700000, details: [{ description: "정기 회비 (6월)", amount: 2700000, date: "2024-06-01" }] },
    expenses: [
      { id: 'exp001-jun', description: "6월 회식 지원", amount: 300000, date: "2024-06-18", category: "행사비" },
    ],
  },
  {
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

// 이전 달 잔액 계산 로직 (페이지 내부에 유지 또는 utils로 분리)
const calculatePreviousBalances = (data: MonthlyFinanceData[]): MonthlyFinanceData[] => {
  const processedData = [...data]; // 원본 배열 수정을 피하기 위해 복사
  for (let i = 0; i < processedData.length; i++) {
    if (i > 0) {
      const prevMonthData = processedData[i-1];
      const prevTotalIncome = prevMonthData.income.details.reduce((sum, item) => sum + item.amount, 0);
      const prevTotalExpenses = prevMonthData.expenses.reduce((sum, item) => sum + item.amount, 0);
      processedData[i].previousBalance = prevMonthData.previousBalance + prevTotalIncome - prevTotalExpenses;
    }
  }
  return processedData;
};

export default function FinancePage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 초기값을 0으로 변경하여 첫 번째 데이터부터 시작
  const [financeData, setFinanceData] = useState<MonthlyFinanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // 목업 데이터에 이월금 계산 적용
    const processedMockData = calculatePreviousBalances(ALL_MOCK_DATA);
    setFinanceData(processedMockData);
    // 가장 최근 달을 기본으로 보여주려면 인덱스 조정
    setCurrentMonthIndex(processedMockData.length > 0 ? processedMockData.length - 1 : 0);
    setIsLoading(false);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) => 
      (prevIndex < financeData.length - 1 ? prevIndex + 1 : financeData.length - 1)
    );
  };
  
  const currentData = financeData[currentMonthIndex];

  const handleDownloadPDF = () => {
    if (currentData) {
      alert(`${currentData.year}년 ${currentData.month}월 영수증 PDF 다운로드 시작! (실제 기능 구현 필요)`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] font-[family-name:var(--font-geist-sans)]">
        <p className="text-lg text-[rgb(var(--muted-foreground-rgb))]">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!currentData && !isLoading) {
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
    <div className="max-w-lg mx-auto p-2 sm:p-4 font-[family-name:var(--font-geist-mono)]">
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

      <div className="relative flex items-center justify-center">
        <button
          onClick={handlePrevMonth}
          disabled={currentMonthIndex === 0 || isLoading}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 transform active:scale-90 -ml-3 sm:-ml-5"
          aria-label="이전 달 영수증"
        >
          <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-full max-w-md transition-opacity duration-300 ease-in-out">
          {currentData && <Receipt data={{...currentData, onDownloadPDF: handleDownloadPDF }} />}
        </div>

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