// src/app/(auth)/signup/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiArrowRight, FiLoader } from 'react-icons/fi'; // 로딩 아이콘 추가
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';

type Role = 'CREW_MEMBER' | 'CREW_LEADER';

// [신규] 프론트엔드에서 사용할 크루 데이터 타입 (logoUrl 포함)
interface Crew {
  id: string;
  name: string;
  logoUrl?: string; // 로고는 프론트에서 동적으로 추가
}

export default function SignupStep1Page() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('CREW_MEMBER');
  const [newCrewName, setNewCrewName] = useState('');
  
  const [crews, setCrews] = useState<Crew[]>([]);
  const [isLoadingCrews, setIsLoadingCrews] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        setIsLoadingCrews(true);
        setApiError(null);

        // [중요] 호출 주소가 Spring API가 아닌 Next.js의 API 라우트로 변경됩니다.
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crew/all`,{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '크루 목록을 불러오는 데 실패했습니다.');
        }

        const crewData: Crew[] = await response.json();
        
        // 백엔드에는 로고 정보가 없으므로, 프론트엔드에서 임시 로고를 매핑합니다.
        // const crewsWithLogos = data.map((crew, index) => ({
        //   ...crew,
        //   logoUrl: `/logos/crew${(index % 4) + 1}.png`
        // }));
        
        setCrews(crewData);

      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoadingCrews(false);
      }
    };

    fetchCrews();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const params = new URLSearchParams();
    params.set('role', role);

    if (role === 'CREW_LEADER') {
      if (!newCrewName.trim()) {
        setFormError('새로운 크루 이름을 입력해주세요.');
        return;
      }
      params.set('crewName', newCrewName.trim());
    } else if (role === 'CREW_MEMBER') {
      if (!selectedCrewId) {
        setFormError('참여할 크루를 선택해주세요.');
        return;
      }
      const selectedCrew = crews.find(crew => crew.id === selectedCrewId);
      if (selectedCrew) {
        params.set('crewName', selectedCrew.name);
      }
    }

    router.push(`/signup/details?${params.toString()}`);
  };

  // UI 렌더링 부분은 이전과 동일하게 유지 (로딩/에러 처리 포함)
  return (
    <div className="w-full max-w-lg space-y-6 p-8 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">회원가입 (1/2)</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">환영합니다! 가입 유형을 선택해주세요.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {formError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{formError}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">가입 유형 <span className="text-red-500">*</span></label>
            <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'CREW_MEMBER' ? 'bg-blue-50 border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}><div className="flex items-center space-x-4"><input type="radio" name="role" value="CREW_MEMBER" checked={role === 'CREW_MEMBER'} onChange={() => setRole('CREW_MEMBER')} className="form-radio h-5 w-5 text-blue-600"/><span><span className="font-semibold text-base"><FiUsers className="inline mr-2 mb-1"/>일반 회원</span><span className="block text-sm text-gray-500 mt-1">크루에 참여하여 활동합니다.</span></span></div></label>
                <label className={`flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all ${role === 'CREW_LEADER' ? 'bg-blue-50 border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}><div className="flex items-center space-x-4"><input type="radio" name="role" value="CREW_LEADER" checked={role === 'CREW_LEADER'} onChange={() => setRole('CREW_LEADER')} className="form-radio h-5 w-5 text-blue-600"/><span><span className="font-semibold text-base"><FiUsers className="inline mr-2 mb-1"/>크루 장</span><span className="block text-sm text-gray-500 mt-1">새로운 크루를 개설합니다.</span></span></div></label>
            </div>
          </div>
          
          {role === 'CREW_MEMBER' && (
            <div className="pt-4 space-y-3">
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200">참여할 크루 선택 <span className="text-red-500">*</span></label>
              
              {isLoadingCrews ? (
                <div className="flex justify-center items-center h-24 text-gray-500">
                  <FiLoader className="animate-spin h-6 w-6 mr-3" />
                  <span>크루 목록을 불러오는 중...</span>
                </div>
              ) : apiError ? (
                <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-sm">{apiError}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {
                  crews.length > 0 ? 
                  crews.map((crew) => (
                    <label key={crew.id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedCrewId === crew.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="crew" value={crew.id} checked={selectedCrewId === crew.id} onChange={() => setSelectedCrewId(crew.id)} className="sr-only"/>
                      {/* <Image src={crew.logoUrl || '/logos/default.png'} alt={`${crew.name} 로고`} width={40} height={40} className="rounded-full mr-3 bg-gray-200" /> */}
                      <span className="font-medium text-gray-800 dark:text-gray-200">{crew.name}</span>
                    </label>
                  ))
                  :
                  <><span>등록된 크루가 없습니다</span></>
                }
                </div>
              )}
            </div>
          )}

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