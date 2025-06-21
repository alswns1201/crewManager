// src/app/(auth)/signup/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image'; // Image 컴포넌트 추가

type Role = 'CREW_MEMBER' | 'CREW_LEADER';

// [신규] 크루 선택을 위한 목업 데이터
const mockCrews = [
  { id: 'crew-1', name: '멋쟁이 개발자들', logoUrl: '/logos/crew1.png' }, // public/logos/crew1.png 에 이미지 필요
  // { id: 'crew-2', name: '달리는 디자이너', logoUrl: '/logos/crew2.png' },
  // { id: 'crew-3', name: '기획하는 사람들', logoUrl: '/logos/crew3.png' },
  // { id: 'crew-4', name: '열정! 마케터즈', logoUrl: '/logos/crew4.png' },
];

export default function SignupStep1Page() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('CREW_MEMBER');
  const [newCrewName, setNewCrewName] = useState('');
  
  // [신규] 일반 회원이 선택한 크루 ID를 저장할 상태
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const params = new URLSearchParams();
    params.set('role', role);

    // [개선] 역할에 따른 유효성 검사 및 데이터 처리 강화
    if (role === 'CREW_LEADER') {
      if (!newCrewName.trim()) {
        setError('새로운 크루 이름을 입력해주세요.');
        return;
      }
      params.set('crewName', newCrewName.trim());
    } else if (role === 'CREW_MEMBER') {
      if (!selectedCrewId) {
        setError('참여할 크루를 선택해주세요.');
        return;
      }
      // 선택된 크루의 이름을 찾아서 파라미터에 추가
      const selectedCrew = mockCrews.find(crew => crew.id === selectedCrewId);
      if (selectedCrew) {
        params.set('crewName', selectedCrew.name);
      }
    }

    router.push(`/signup/details?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-lg space-y-6 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">회원가입 (1/2)</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">환영합니다! 가입 유형을 선택해주세요.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">가입 유형 <span className="text-red-500">*</span></label>
            <div className="flex flex-col sm:flex-row gap-4">
                {/* 일반 회원 옵션 */}
                <label className={`flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'CREW_MEMBER' ? 'bg-blue-50 border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}><div className="flex items-center space-x-4"><input type="radio" name="role" value="CREW_MEMBER" checked={role === 'CREW_MEMBER'} onChange={() => setRole('CREW_MEMBER')} className="form-radio h-5 w-5 text-blue-600"/><span><span className="font-semibold text-base"><FiUsers className="inline mr-2 mb-1"/>일반 회원</span><span className="block text-sm text-gray-500 mt-1">크루에 참여하여 활동합니다.</span></span></div></label>
                {/* 크루 장 옵션 */}
                <label className={`flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'CREW_LEADER' ? 'bg-blue-50 border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}><div className="flex items-center space-x-4"><input type="radio" name="role" value="CREW_LEADER" checked={role === 'CREW_LEADER'} onChange={() => setRole('CREW_LEADER')} className="form-radio h-5 w-5 text-blue-600"/><span><span className="font-semibold text-base"><FiUsers className="inline mr-2 mb-1"/>크루 장</span><span className="block text-sm text-gray-500 mt-1">새로운 크루를 개설합니다.</span></span></div></label>
            </div>
          </div>
          
          {/* [신규] '일반 회원' 선택 시 크루 선택 UI */}
          {role === 'CREW_MEMBER' && (
            <div className="pt-4 space-y-3">
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200">참여할 크루 선택 <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockCrews.map((crew) => (
                  <label key={crew.id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedCrewId === crew.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input type="radio" name="crew" value={crew.id} checked={selectedCrewId === crew.id} onChange={() => setSelectedCrewId(crew.id)} className="sr-only"/>
                    <Image src={crew.logoUrl} alt={`${crew.name} 로고`} width={40} height={40} className="rounded-full mr-3 bg-gray-200" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{crew.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* '크루 장' 선택 시 새 크루 이름 입력 */}
          {role === 'CREW_LEADER' && (
            <div className="pt-4">
              <label htmlFor="new-crew-name" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">새 크루 이름 <span className="text-red-500">*</span></label>
              <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FaPlus className="h-4 w-4 text-gray-400"/></div><input id="new-crew-name" type="text" value={newCrewName} onChange={(e) => setNewCrewName(e.target.value)} required className="w-full px-4 py-3 pl-11 text-base border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"/></div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            <span>다음 단계로</span><FiArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}