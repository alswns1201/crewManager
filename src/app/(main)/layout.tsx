// src/app/layout.tsx
import type { Metadata } from "next";
import Link from 'next/link';
import { FiBell, FiSettings } from 'react-icons/fi';
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import MobileBottomNav from '@/component/MobileBottomNav';
import UserProfile from '@/component/UserProfile'; // 새로 만든 UserProfile 컴포넌트 임포트

// ... (폰트 및 metadata 설정은 기존과 동일) ...
const geistSans = Geist({ variable: "--font-geist-sans", display: 'swap' });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", display: 'swap' });

export const metadata: Metadata = {
  title: "CrewManager Pro",
  description: "효율적인 크루 활동 관리를 위한 운영진용 대시보드입니다.",
  icons: { icon: '/favicon.ico' },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`antialiased bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))] font-sans pb-24 sm:pb-0`}
      >
        <div className="min-h-screen flex flex-col">
          {/* 헤더 */}
          <header className="sticky top-0 z-30 w-full bg-[rgb(var(--card-rgb))] shadow-md backdrop-blur-sm transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                CrewManager Pro
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* 알림과 설정 버튼은 그대로 둡니다. */}
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
                
                {/* [변경점] 기존 div를 UserProfile 컴포넌트로 교체합니다. */}
                <UserProfile />

              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 및 푸터 (기존과 동일) */}
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="text-center p-4 sm:p-6 text-xs sm:text-sm text-[rgb(var(--muted-foreground-rgb))] border-t border-[rgb(var(--card-border-rgb))] bg-[rgb(var(--card-rgb))] transition-colors duration-300">
            © {new Date().getFullYear()} CrewManager Pro. 모든 권리 보유.
          </footer>
        </div>

        <MobileBottomNav />
      </body>
    </html>
  );
}