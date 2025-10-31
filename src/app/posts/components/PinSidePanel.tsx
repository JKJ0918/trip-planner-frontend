// PinSidePanel.tsx
'use client';

import { useEffect, useState } from 'react';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
  images?: string[];
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
};

export default function PinSidePanel({
  pin,
  onClose,
}: {
  pin: Pin;
  onClose: () => void;
}) {
  const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}`;
  const [idx, setIdx] = useState(0);

  const images = pin.images ?? [];
  const total = images.length;

  const prev = () => setIdx((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setIdx((i) => (i === total - 1 ? 0 : i + 1));

  useEffect(() => {
    setIdx(0);
    
  }, [pin])
 



  return (
    <aside className="bg-white shadow-lg rounded-xl p-4 w-full lg:w-80 sticky top-24 max-h-[75vh] overflow-y-auto animate-slideIn">
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">✖</button>

      <h2 className="text-xl font-bold mb-1">{pin.name}</h2>
      <p className="text-sm text-gray-600 mb-1">주소 {pin.address}</p>
      <p className="text-xs text-gray-500 mb-3">카테고리 {pin.category}</p>

      {/* ▶︎ 이미지 캐러셀 */}
      {total > 0 && (
        <div className="relative mb-3">
          {/* 이미지 */}
          <div className="relative w-full h-48 overflow-hidden rounded-lg mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={`${img}`}
                alt={`slide-${i}`}
                className={`absolute top-0 left-0 w-full h-48 object-cover rounded-lg transition-transform duration-300 ${
                  i === idx
                    ? 'translate-x-0 z-10'
                    : i < idx
                    ? '-translate-x-full z-0'
                    : 'translate-x-full z-0'
                }`}
              />
            ))}
          </div>



          {/* 좌우 화살표 */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white rounded-full shadow"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white rounded-full shadow"
              >
                ›
              </button>
            </>
          )}

          {/* 인디케이터 점 */}
          {total > 1 && (
            <div className="flex justify-center gap-1 mt-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block w-2 h-2 rounded-full ${i === idx ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}


      <div className="space-y-2 text-sm text-gray-800">

        {/* 금액 */}
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4b5563" viewBox="0 0 256 256">
            <path d="M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" />
          </svg>
          <span>금액 {pin.minCost} ~ {pin.maxCost} {pin.currency}</span>
        </div>

        {/* 이용시간 */}
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4b5563" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
          </svg>
          <span>이용 시간 {pin.openTime} ~ {pin.closeTime}</span>
        </div>

      </div>

      {/* 설명 */}
      <div className="mt-4 flex items-start gap-2 text-sm text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4b5563" viewBox="0 0 256 256">
          <path d="M232,72H160a40,40,0,0,0-32,16A40,40,0,0,0,96,72H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V80A8,8,0,0,0,232,72ZM96,192H32V88H96a24,24,0,0,1,24,24v88A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V112a24,24,0,0,1,24-24h64Z" />
        </svg>
        <p className="whitespace-pre-line">{pin.description}</p>
      </div>

    </aside>
  );
}
