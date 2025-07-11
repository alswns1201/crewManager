// app/layout.tsx (제공해주신 코드에서 변경 없음)

"use client";

import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { CrewProvider } from "@/context/CrewContext";
import CrewSidebar from "@/component/common/CrewSidebar";
import MobileBottomNav from "@/component/MobileBottomNav";
import LogoutButton from "@/component/common/LogoutButton";
import Link from "next/link";
import { FiBell, FiSettings, FiMenu } from "react-icons/fi";
import { isToday, parseISO } from "date-fns";

const geistSans = Geist({ variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 헤더 구조를 조금 더 명확하게 수정합니다.
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gray-50 text-gray-800 font-sans pb-20 sm:pb-0">
        <CrewProvider>
          <CrewSidebar open={isSidebarOpen} setOpen={setSidebarOpen} />
          {isSidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              aria-hidden="true"
            ></div>
          )}
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm shadow-sm flex justify-between items-center px-4 sm:px-6 h-16 border-b">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 sm:hidden"
                  aria-label="메뉴 열기"
                >
                  <FiMenu size={24} />
                </button>
                <Link href="/" className="text-xl font-bold text-gray-800">
                  CrewManager Pro
                </Link>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <FiBell className="w-5 h-5 text-gray-600" />
                </button>
                <Link href="/settings" className="p-2 rounded-full hover:bg-gray-100">
                  <FiSettings className="w-5 h-5 text-gray-600" />
                </Link>
                <LogoutButton />
              </div>
            </header>
            <main className="flex-grow p-4 sm:p-8">{children}</main>
          </div>
          <MobileBottomNav />
        </CrewProvider>
      </body>
    </html>
  );
}