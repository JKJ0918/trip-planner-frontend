// 상세 보기 안 핀 리스트
'use client';

import { useEffect } from 'react';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
  images?: string[];      // 이미지 URL 목록
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
};


type Props = {
  pins: Pin[];
  onSelect: (pin: Pin) => void;
  mapRef: { current: google.maps.Map | null };
};

const BASE_URL = "http://localhost:8080";

export default function PinList({ pins, onSelect, mapRef }: Props) {
  const handleClick = (pin: Pin) => {
    onSelect(pin); // InfoWindow 열기
    if (mapRef.current) {
      mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <h3 className="text-xl font-semibold mb-2">📌 방문지 목록</h3>
      <ul className="divide-y divide-gray-200">
        {pins.map((pin, idx) => (
          <li
            key={idx}
            className="py-3 cursor-pointer hover:bg-gray-100 px-3 rounded"
            onClick={() => handleClick(pin)}
          >
            <div className="font-medium text-lg">{pin.name}</div>
            <div className="text-sm text-gray-500">{pin.address}</div>
            <div className="text-xs text-gray-400 mb-1">카테고리: {pin.category}</div>

            {pin.images && pin.images.length > 0 && (
              <img
                src={`http://localhost:8080${pin.images[0]}`}
                alt="대표 이미지"
                className="w-full h-36 object-cover rounded mb-2"
              />
            )}

            <div className="text-sm text-gray-600">
              💵 예산: {pin.minCost} ~ {pin.maxCost} {pin.currency}
            </div>
            <div className="text-sm text-gray-600">
              🕒 운영 시간: {pin.openTime} ~ {pin.closeTime}
            </div>
            <p className="text-sm text-gray-700 mt-1">{pin.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

