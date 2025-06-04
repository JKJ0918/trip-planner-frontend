// maps page.tsx
'use client';

import dynamic from 'next/dynamic';
import DateRangePicker from './components/DateRangePicker';
import TravelJournal from './components/TravelJournal';
import { useTripStore } from './utils/tripstore';
import { useEffect } from 'react';
import { fetchUserInfoJ } from './utils/fetchUserInfoJ';
import TravelInfo from './components/TravelInfo';

const MyMap = dynamic(() => import('./components/MyMap'), { ssr: false });



export default function MapPage() {

  const { startDate, endDate, pins, submitTripPlan } = useTripStore();
  const setUser = useTripStore((state) => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUserInfoJ();
        setUser({id: user.userId});
      } catch (err) {
        console.error("유저 정보를 불러오지 못했습니다:", err);
      }
    };
    loadUser();
  }, []);

  return (
    <div className="p-4 space-y-6">

      <TravelInfo />
      
      <h1 className="text-xl font-bold">📍 지도 테스트</h1>
      
      {/* 지도 및 방문지 목록 */}
      <MyMap />
      
      {/* 날짜 선택기 */}
      <div className="bg-white p-4 shadow-md rounded">
        <h2 className="text-lg font-semibold mb-2">🗓️ 여행 기간 설정</h2>
        <DateRangePicker />
      </div>

      {/* 일정 작성 */}
      <div className="bg-white p-4 shadow-md rounded">
        <h2 className="text-lg font-semibold mb-2">일정 작성</h2>
        <TravelJournal />
      </div>

      {/* 작성 완료 버튼 */}
      <div className="text-right">
        <button
          onClick={() => {
            if (!startDate || !endDate) {
              alert("여행 기간을 설정해 주세요!");
              return;
            }
            submitTripPlan(startDate, endDate, pins);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          전체 작성 완료
        </button>
      </div>
    

    </div>
  );
}
