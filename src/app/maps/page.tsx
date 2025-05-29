'use client';

import dynamic from 'next/dynamic';
import DateRangePicker from './components/DateRangePicker';
import TravelJournal from './components/TravelJournal';

const MyMap = dynamic(() => import('./components/MyMap'), { ssr: false });

export default function MapPage() {
  return (
    <div className="p-4 space-y-6">
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

    </div>
  );
}
