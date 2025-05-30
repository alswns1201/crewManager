// src/components/finance/Receipt.tsx
'use client'; // 필요에 따라 (만약 내부에서 client-side hook 사용 시)

import React from 'react';
import { FiDollarSign, FiDownload } from 'react-icons/fi';
import type { MonthlyFinanceData } from '@/types/finance'; // 타입 임포트 (경로 확인!)

// 숫자 포맷팅 함수 (여기서도 필요하면 유지, 또는 utils로 분리)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

interface ReceiptProps {
  data: MonthlyFinanceData;
}

const Receipt: React.FC<ReceiptProps> = ({ data }) => {
  const { year, month, income, expenses, previousBalance, onDownloadPDF } = data;

  const totalIncome = income.details.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = previousBalance + totalIncome - totalExpenses;

  const currentMonthDisplay = `${year}년 ${month}월`;
  // 발행일은 Receipt가 렌더링될 때의 날짜로 하는 것이 적절할 수 있습니다.
  // 또는 data에 `issuedDate` 필드를 추가하여 전달받을 수도 있습니다.
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
        {/* 수입 내역 */}
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

        {/* 지출 내역 */}
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

        {/* 잔액 정보 */}
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
        
        {/* 최종 잔액 */}
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
        {onDownloadPDF && ( // onDownloadPDF prop이 있을 때만 버튼 렌더링
          <button 
            onClick={onDownloadPDF}
            className="font-[family-name:var(--font-geist-sans)] inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FiDownload className="w-3 h-3 mr-1.5" /> PDF 다운로드
          </button>
        )}
      </footer>
    </div>
  );
};

export default Receipt;