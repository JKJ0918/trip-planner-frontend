'use client';

import { Location } from '../types/location';
import { useRouter } from 'next/navigation';
import { useLocationStore } from '../utils/locationStore';

interface Props {
  location: Location;
  onClose: () => void;
}

export default function LocationModal({ location, onClose }: Props) {
  const router = useRouter();

  const handlePlanClick = () => {
    useLocationStore.getState().setLocation(location.latitude, location.longitude);
    router.push('/maps');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <img src={location.imageUrl} alt={location.name} className="w-full h-48 object-cover rounded" />

        <h2 className="text-2xl font-bold mt-4">{location.name}</h2>
        <p className="text-gray-600 mb-2">{location.country}</p>
        <p className="text-sm text-gray-800 mb-2">{location.description}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p><strong>비자:</strong> {location.visa}</p>
          <p><strong>항공:</strong> {location.flight}</p>
          <p><strong>전압:</strong> {location.voltage}</p>
          <p><strong>시차:</strong> {location.timezone}</p>
        </div>

        <button
          onClick={handlePlanClick}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ✈️ 일정 만들기
        </button>
      </div>
    </div>
  );
}
