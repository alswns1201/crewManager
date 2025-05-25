// src/app/layout.tsx
import type { Metadata } from "next";
import Link from 'next/link';
import { FiBell, FiSettings } from 'react-icons/fi';
import { Geist, Geist_Mono } from "next/font/google"; // 폰트 임포트
import "../styles/globals.css"; // globals.css 임포트

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // 폰트 로딩 전략
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // 폰트 로딩 전략
});

export const metadata: Metadata = {
  title: "CrewManager Pro",
  description: "효율적인 크루 활동 관리를 위한 운영진용 대시보드입니다.",
  icons: {
    icon: '/favicon.ico', // favicon.ico가 public 폴더에 있다고 가정
    // apple: '/apple-touch-icon.png', // 필요시 추가
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
        className={`antialiased bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))] font-sans`} // font-sans는 geistSans 변수를 참조
      >
        <div className="min-h-screen flex flex-col">
          {/* 헤더 */}
          <header className="sticky top-0 z-30 w-full bg-[rgb(var(--card-rgb))] shadow-md backdrop-blur-sm transition-colors duration-300">
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
                {/* 사용자 프로필 - 추후 NextAuth.js 등과 연동 */}
                <div
                  aria-label="사용자 프로필"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  A {/* 예: 사용자 이니셜 또는 이미지 */}
                </div>
              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children} {/* 페이지별 컨텐츠가 여기에 렌더링됩니다. */}
          </main>

          {/* 푸터 */}
          <footer className="text-center p-4 sm:p-6 text-xs sm:text-sm text-[rgb(var(--muted-foreground-rgb))] border-t border-[rgb(var(--card-border-rgb))] bg-[rgb(var(--card-rgb))] transition-colors duration-300">
            © {new Date().getFullYear()} CrewManager Pro. 모든 권리 보유.
          </footer>
        </div>
      </body>
    </html>
  );
}