// src/components/common/Toast.tsx
"use client";

import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) {
    return null;
  }

  const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 sm:top-8 p-4 rounded-lg shadow-xl flex items-center space-x-3 z-50 transition-all duration-300 ease-in-out"; // 상단 중앙
  // 만약 상단 오른쪽을 원하시면:
  // const baseClasses = "fixed top-5 right-5 sm:top-8 sm:right-8 p-4 rounded-lg shadow-xl flex items-center space-x-3 z-50 transition-all duration-300 ease-in-out";

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const IconComponent = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiCheckCircle,
  }[type];

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}> {/* 애니메이션 수정 */}
      <IconComponent size={24} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-white/20">
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;