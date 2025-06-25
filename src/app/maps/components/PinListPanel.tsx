'use client';

import { useTripStore } from '../utils/tripstore';
import Image from 'next/image';

export default function PinListPanel() {
  const pins = useTripStore((state) => state.pins);
  const deletePin = useTripStore((state) => state.deletePin);
  const setSelectedPinIndex = useTripStore((state) => state.setSelectedPinIndex);
  const setHighlightedIndex = useTripStore((state) => state.setHighlightedIndex);
  const highlightedIndex = useTripStore((state) => state.highlightedIndex);
  const mapRef = useTripStore((state) => state.mapRef);

  return (
    <div className="p-4 bg-white max-h-[600px] overflow-y-auto">
      <ul className="space-y-3">
        {pins.map((pin, index) => {
          const imagePreview = pin.images?.[0];
          const extraCount = (pin.images?.length || 0) - 1;

          return (
            <li
              key={index}
              onClick={() => {
                setSelectedPinIndex(index);     // InfoWindow 띄우기
                setHighlightedIndex(index);     // 마커 강조
                if (mapRef) {
                  mapRef.panTo({ lat: pin.lat, lng: pin.lng });
                }
              }}
              className={`cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-m transition-all flex gap-4 items-center ${
                highlightedIndex === index ? '' : ''
              }`}
            >
              {/* 이미지 섹션 */}
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                  <Image
                    src={URL.createObjectURL(imagePreview)}
                    alt="preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                  {extraCount > 0 && (
                    <span className="absolute bottom-0 right-0 text-xs bg-black bg-opacity-60 text-white rounded px-1">
                      +{extraCount}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded shrink-0 flex items-center justify-center text-sm text-gray-500">
                  없음
                </div>
              )}

              {/* 텍스트 정보 */}
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">
                  {index + 1}. {pin.name}
                </p>
                <p className="text-sm text-gray-500">{pin.category}</p>
                <p className="text-xs text-gray-400">{pin.address}</p>
              </div>

              {/* 삭제 버튼 */}
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
            </li>
          );
        })}

        {pins.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            등록된 장소가 없습니다. 지도를 클릭해 장소를 추가해보세요.
          </p>
        )}
      </ul>
    </div>
  );
}
