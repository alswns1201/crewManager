"use client";

import { useRouter } from "next/navigation";
import { FiLogOut } from 'react-icons/fi';
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      }
     
    );
    const text = await res.text();
    console.log("로그아웃 응답:", text); // 콘솔 확인용

    setMessage("로그아웃 되었습니다."); // 메시지 상태 업데이트

    setTimeout(() => {
      router.push("/login"); // 1.5초 후 이동
    }, 1500);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <FiLogOut />
        로그아웃
      </button>
    </>
  );
}