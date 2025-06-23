'use client';

import { useTripStore } from '../utils/tripstore';

export default function PinListPanel() {
  const pins = useTripStore((state) => state.pins);
  const deletePin = useTripStore((state) => state.deletePin); // 좌측 탭 메뉴에서 pin 삭제
  const setSelectedPinIndex = useTripStore((state) => state.setSelectedPinIndex);
  const setHighlightedIndex = useTripStore((state) => state.setHighlightedIndex);
  const highlightedIndex = useTripStore((state) => state.highlightedIndex);
  const mapRef = useTripStore((state) => state.mapRef); // pin 좌표로 지도 중심 이동


  return (
    <div className="p-4 bg-white shadow-md rounded-2xl max-h-[600px] overflow-y-auto">
      <ul className="space-y-3">
        {pins.map((pin, index) => (
          <li
            key={index}
              onClick={() => {
              setSelectedPinIndex(index);     // 지도 중심 이동
              setHighlightedIndex(index);     // 강조 효과 추가

              if (mapRef) {
                mapRef.panTo({ lat: pin.lat, lng: pin.lng }); // 지도 중심 이동
              }

            }}
            className={`cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm transition-all flex flex-col gap-1 ${
              highlightedIndex === index ? 'ring-2 ring-yellow-300' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800 text-sm">{index + 1}. {pin.name}</p>
                <p className="text-sm text-gray-500">{pin.category}</p>
                <p className="text-xs text-gray-400">{pin.address}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(index);
                }}
                className="text-red-400 hover:text-red-600 text-sm"
                title="삭제"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
        {pins.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            등록된 장소가 없습니다. 지도를 클릭해 장소를 추가해보세요.
          </p>
        )}
      </ul>
    </div>
  );
}
