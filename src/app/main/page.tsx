'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from './components/LocationSearch';

export default function MainPage() {
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (location) {
      router.push(`/planner?location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        여행지를 먼저 선택해보세요
      </h1>
      <LocationSearch />
    </div>
  );
}
