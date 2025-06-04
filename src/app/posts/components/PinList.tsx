'use client';

import { useEffect } from 'react';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
};

type Props = {
  pins: Pin[];
  onSelect: (pin: Pin) => void;
  mapRef: { current: google.maps.Map | null };
};

export default function PinList({ pins, onSelect, mapRef }: Props) {
  const handleClick = (pin: Pin) => {
    onSelect(pin); // InfoWindow 열기

    if (mapRef.current) {
      mapRef.current.panTo({ lat: pin.lat, lng: pin.lng }); // 지도 중심 이동
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <h3 className="text-xl font-semibold mb-2">📌 방문지 목록</h3>
      <ul className="divide-y divide-gray-200">
        {pins.map((pin, idx) => (
          <li
            key={idx}
            className="py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
            onClick={() => handleClick(pin)}
          >
            <div className="font-medium">{pin.name}</div>
            <div className="text-sm text-gray-500">{pin.address}</div>
            <div className="text-xs text-gray-400">카테고리: {pin.category}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
