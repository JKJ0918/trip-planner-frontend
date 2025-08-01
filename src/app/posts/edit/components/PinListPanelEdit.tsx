'use client';
// 게시글 수정에서 pinList에 관여함

import Image from 'next/image';

// Pin 타입 정의
type Pin = {
  lat: number; // 위도
  lng: number; // 경도
  name: string; // 위치명
  address: string; // 주소
  category: string; // 카테고리
  images?: (string | File)[]; // images?: string[]; // 이미지 URL 목록
  minCost?: string; // 금액(최소)
  maxCost?: string; // 금액(최대)
  currency?: string; // 화폐 단위
  openTime?: string; // 오픈시간
  closeTime?: string; // 마감시간
  description?: string; // 설명
};

type Props = {
    travelPinEntry: Pin[];
    onTravelPinEntryChange: (updatePins: Pin[]) => void;
}

const BASE_URL = "http://localhost:8080";

export default function PinListPanelEdit({ travelPinEntry, onTravelPinEntryChange }: Props) {
  const handleChange = (index: number, field: keyof Pin, value: string) => {
    const updated = [...travelPinEntry];
    updated[index] = { ...updated[index], [field]: value };
    onTravelPinEntryChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = travelPinEntry.filter((_, i) => i !== index);
    onTravelPinEntryChange(updated);
  };

  return (
    <div className="p-4 bg-white max-h-[600px] overflow-y-auto">
      <ul className="space-y-3">
        {travelPinEntry.map((pin, index) => {
          const imagePreview = pin.images?.[0];
          const extraCount = (pin.images?.length || 0) - 1;

          return (
            <li key={index} className="p-2 bg-gray-50 hover:bg-gray-100 rounded flex gap-4 items-center">
              {/* 이미지 섹션 */}
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                    <img
                        src={`${BASE_URL}${imagePreview}`}
                        alt="preview"
                        className="w-full h-full object-cover rounded"
                    />
                  {extraCount > 0 && (
                    <span className="absolute bottom-0 right-0 text-xs bg-black bg-opacity-60 text-white rounded px-1">
                      +{extraCount}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                  없음
                </div>
              )}

              {/* 정보 섹션 */}
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">
                  {index + 1}. {pin.name}
                </p>
                <p className="text-sm text-gray-500">{pin.category}</p>
                <p className="text-xs text-gray-400">{pin.address}</p>
              </div>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDelete(index)}
                className="text-red-400 hover:text-red-600 text-sm"
                title="삭제"
              >
                ✕
              </button>
            </li>
          );
        })}

        {travelPinEntry.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            등록된 장소가 없습니다.
          </p>
        )}
      </ul>
    </div>
  );
}