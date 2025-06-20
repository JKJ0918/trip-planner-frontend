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
      {/* 제목 입력 */}
      <TravelInfo />

      {/* 날짜 선택기 */}
      <DateRangePicker />

      {/* 지도 및 방문지 목록 */}
      <MyMap />
      


      {/* 일정 작성 */}
      <TravelJournal />

      {/* 작성 완료 버튼 */}
      <div className="text-center">
        <button
          onClick={() => {
            if (!startDate || !endDate) {
              alert("여행 기간을 설정해 주세요!");
              return;
            }
            submitTripPlan(startDate, endDate, pins);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          전체 작성 완료
        </button>
      </div>
    

    </div>
  );
}
