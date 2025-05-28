// pages/map.tsx
'use client';

import dynamic from 'next/dynamic';
import DateRangePicker from './components/DateRangePicker';

// SSR 비활성화로 동적 import
const MyMap = dynamic(() => import('./components/MyMap'), { ssr: false });

export default function MapPage() {
  return (
    <div>
      <h1>지도 테스트</h1>
      <MyMap />
      <DateRangePicker/>
    </div>
  );
}
