// src/app/layout.tsx
import type { Metadata } from "next";
import Link from 'next/link';
import { FiBell, FiSettings } from 'react-icons/fi';
import { Geist, Geist_Mono } from "next/font/google"; // 폰트 임포트
import "@/styles/globals.css"; // globals.css 임포트

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

export default function AuthLayout({
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
      
          {/* 메인 컨텐츠 영역 */}
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="text-center p-4 sm:p-6 text-xs sm:text-sm text-[rgb(var(--muted-foreground-rgb))] border-t border-[rgb(var(--card-border-rgb))] bg-[rgb(var(--card-rgb))] transition-colors duration-300">
            © {new Date().getFullYear()} CrewManager Pro. 모든 권리 보유.
          </footer>
        </div>

        {/*하단 없음*/}
        <></>
      </body>
    </html>
  );
}