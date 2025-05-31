// src/app/layout.tsx
import type { Metadata } from "next";
import Link from 'next/link';
import { FiBell, FiSettings } from 'react-icons/fi';
import { Geist, Geist_Mono } from "next/font/google"; // 폰트 임포트
import "@/styles/globals.css"; // globals.css 임포트
import MobileBottomNav from '@/component/MobileBottomNav'; // 새로 만든 컴포넌트 임포트 (경로 확인)

const geistSans = Geist({
  variable: "--font-geist-sans",
  // subsets: ["latin"], // @vercel/font-geist 사용 시 subsets 옵션 없을 수 있음
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  // subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CrewManager Pro",
  description: "효율적인 크루 활동 관리를 위한 운영진용 대시보드입니다.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`antialiased bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))] font-sans pb-24 sm:pb-0`} // 모바일용 하단 패딩 추가, sm 이상에서는 제거
      >
        <div className="min-h-screen flex flex-col">
          {/* 헤더 */}
          <header className="sticky top-0 z-30 w-full bg-[rgb(var(--card-rgb))] shadow-md backdrop-blur-sm transition-colors duration-300">
            {/* ... (기존 헤더 내용) ... */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                CrewManager Pro
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  aria-label="알림"
                  className="p-2 rounded-full text-[rgb(var(--muted-foreground-rgb))] hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[rgb(var(--foreground-rgb))] transition-colors"
                >
                  <FiBell className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <Link
                  href="/settings"
                  aria-label="설정"
                  className="p-2 rounded-full text-[rgb(var(--muted-foreground-rgb))] hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[rgb(var(--foreground-rgb))] transition-colors"
                >
                  <FiSettings className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
                <div
                  aria-label="사용자 프로필"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  
                </div>
              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="text-center p-4 sm:p-6 text-xs sm:text-sm text-[rgb(var(--muted-foreground-rgb))] border-t border-[rgb(var(--card-border-rgb))] bg-[rgb(var(--card-rgb))] transition-colors duration-300">
            © {new Date().getFullYear()} CrewManager Pro. 모든 권리 보유.
          </footer>
        </div>

        {/* 모바일 하단 네비게이션 바 (모든 페이지에 적용) */}
        <MobileBottomNav />
      </body>
    </html>
  );
}