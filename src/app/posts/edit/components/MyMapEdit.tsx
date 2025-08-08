// MyMapEdit.tsx

'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';

const BASE_URL = 'http://localhost:8080';

interface Pin {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
  images?: (string | File)[];
}

interface MyMapEditProps {
  pins: Pin[];
  onUpdatePin: (updatedPins: Pin[]) => void;
}

export default function MyMapEdit({ pins, onUpdatePin }: MyMapEditProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const center = useMemo(() => {
    if (pins.length > 0) return { lat: pins[0].lat, lng: pins[0].lng };
    return { lat: 37.5665, lng: 126.9780 };
  }, [pins]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || selectedPinIndex === null) return;
    const file = e.target.files[0];
    const copy = [...pins];
    const currentImages = copy[selectedPinIndex].images || [];
    if (currentImages.length < 3) {
      copy[selectedPinIndex].images = [...currentImages, file];
      onUpdatePin(copy);
    }
  };

  const handleDeleteImage = (imgIndex: number) => {
    if (selectedPinIndex === null) return;
    const copy = [...pins];
    copy[selectedPinIndex].images = copy[selectedPinIndex].images?.filter((_, i) => i !== imgIndex);
    onUpdatePin(copy);
  };

  const [newPin, setNewPin] = useState<Pin | null>(null); // 임시 새 핀
  // pins 배열에 즉시 추가하지 말고, 임시 핀(newPin)에만 저장
  // 저장 버튼을 눌렀을 때에만 pins에 추가하고 onUpdatePin() 호출
  // InfoWindow에서 editMode === true && newPin !== null인 경우 newPin을 렌더링

  if (!isLoaded) return <div>Loading...</div>;

  return (

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '834px' }}
        center={center}
        zoom={12}
              onLoad={(map) => {
              mapRef.current = map;
            }}
        onClick={(e) => {
          const newPin: Pin = {
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
            name: '',
            address: '',
            category: '',
            images: [],
          };
          // const updated = [...pins, newPin];
          setNewPin({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
            name: '',
            address: '',
            category: '',
            images: [],
          });
          setSelectedPinIndex(null);
          setEditMode(true); // 새 핀 클릭 시 바로 수정모드 진입
        }}
      >

      {pins.map((pin, index) => (
        <Marker
          key={index}
          position={{ lat: pin.lat, lng: pin.lng }}
          draggable
          onDragEnd={(e) => {
            const copy = [...pins];
            copy[index].lat = e.latLng?.lat() || pin.lat;
            copy[index].lng = e.latLng?.lng() || pin.lng;
            onUpdatePin(copy);
          }}
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
            }
            setSelectedPinIndex(index);
            setEditMode(false);
          }}
        />
      ))}

{(selectedPinIndex !== null || newPin !== null) && (
  <InfoWindow
    position={
      selectedPinIndex !== null
        ? { lat: pins[selectedPinIndex].lat, lng: pins[selectedPinIndex].lng }
        : { lat: newPin!.lat, lng: newPin!.lng }
    }
    onCloseClick={() => {
      setSelectedPinIndex(null);
      setNewPin(null);     // 임시 핀 닫기
      setEditMode(false);
    }}
  >
    <div className="w-64 p-2 space-y-2 text-sm">
      {(() => {
        const isNew = selectedPinIndex === null;                 // 새 핀 편집 중?
        const editingPin = isNew ? newPin! : pins[selectedPinIndex]; // 현재 편집 대상

        // 대상 업데이트(새 핀은 setNewPin, 기존 핀은 onUpdatePin)
        const setEditingPin = (patch: Partial<Pin>) => {
          const updated = { ...editingPin, ...patch };
          if (isNew) {
            setNewPin(updated);
          } else {
            const copy = [...pins];
            copy[selectedPinIndex] = updated;
            onUpdatePin(copy);
          }
        };

        // 이미지 업로드/삭제도 편집 대상에 맞춰 공통 처리
        const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          const cur = editingPin.images || [];
          if (cur.length >= 3) return;
          setEditingPin({ images: [...cur, file] });
        };

        const handleDeleteImg = (i: number) => {
          const cur = editingPin.images || [];
          setEditingPin({ images: cur.filter((_, idx) => idx !== i) });
        };

        // 보기 모드: 기존 핀만 사용 (임시 핀은 생성 전이라 보기 모드 의미가 적음)
        if (!editMode && !isNew) {
          return (
            <div className="space-y-2">
              <h3 className="text-center text-blue-600 font-semibold">방문지 정보</h3>
              <div className="flex gap-1">
                {editingPin.images?.slice(0, 3).map((img, i) => {
                  const src = img instanceof File ? URL.createObjectURL(img) : `${BASE_URL}${img}`;
                  return (
                    <img
                      key={i}
                      src={src}
                      className="w-16 h-16 object-cover rounded border"
                      alt={`pin-img-${i}`}
                    />
                  );
                })}
              </div>

              <p className="font-bold text-gray-800">{editingPin.name}</p>
              <p>{editingPin.category} / {editingPin.address}</p>
              <p>
                {editingPin.minCost} ~ {editingPin.maxCost} {editingPin.currency}
              </p>
              <p>운영시간: {editingPin.openTime} ~ {editingPin.closeTime}</p>
              <p className="whitespace-pre-wrap text-xs text-gray-700">
                {editingPin.description}
              </p>

              <div className="flex justify-end gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => setEditMode(true)}
                >
                  수정
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    const copy = [...pins];
                    copy.splice(selectedPinIndex, 1);
                    onUpdatePin(copy);
                    setSelectedPinIndex(null);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        }

        // 편집 모드(새 핀/기존 핀 공통)
        return (
          <div className="space-y-2">
            <h3 className="text-center text-blue-600 font-semibold">
              {isNew ? '새 방문지 입력' : '정보 수정'}
            </h3>

            {/* 이미지 프리뷰/삭제 */}
            {editingPin.images?.map((img, i) => {
              const src = img instanceof File ? URL.createObjectURL(img) : `${BASE_URL}${img}`;
              return (
                <div key={i} className="relative w-20 h-16 inline-block mr-1">
                  <img src={src} className="w-full h-full object-cover rounded border" alt={`img-${i}`} />
                  <button
                    onClick={() => handleDeleteImg(i)}
                    className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {(editingPin.images?.length || 0) < 3 && (
              <input type="file" accept="image/*" onChange={handleUpload} />
            )}

            {/* 공통 입력들 */}
            <input
              value={editingPin.name}
              onChange={(e) => setEditingPin({ name: e.target.value })}
              className="w-full border p-1 rounded"
              placeholder="장소 이름"
            />

            <select
              value={editingPin.category}
              onChange={(e) => setEditingPin({ category: e.target.value })}
              className="w-full border p-1 rounded"
            >
              <option value="">카테고리 선택</option>
              <option value="숙소">숙소</option>
              <option value="음식점">음식점</option>
              <option value="의료">의료</option>
              <option value="행정">행정</option>
              <option value="공항">공항</option>
              <option value="도시">도시</option>
            </select>

            <input
              value={editingPin.address}
              onChange={(e) => setEditingPin({ address: e.target.value })}
              className="w-full border p-1 rounded"
              placeholder="주소"
            />

            <div className="flex gap-1">
              <input
                type="number"
                value={editingPin.minCost || ''}
                onChange={(e) => setEditingPin({ minCost: e.target.value })}
                placeholder="최소 비용"
                className="border p-1 w-1/2 rounded"
              />
              <input
                type="number"
                value={editingPin.maxCost || ''}
                onChange={(e) => setEditingPin({ maxCost: e.target.value })}
                placeholder="최대 비용"
                className="border p-1 w-1/2 rounded"
              />
            </div>

            <select
              value={editingPin.currency || '₩'}
              onChange={(e) => setEditingPin({ currency: e.target.value })}
              className="border p-1 w-full rounded"
            >
              <option value="₩">₩ 원</option>
              <option value="$">$ 달러</option>
              <option value="€">€ 유로</option>
              <option value="¥">¥ 엔</option>
            </select>

            <div className="flex gap-1">
              <input
                type="time"
                value={editingPin.openTime || ''}
                onChange={(e) => setEditingPin({ openTime: e.target.value })}
                className="border p-1 w-1/2 rounded"
              />
              <input
                type="time"
                value={editingPin.closeTime || ''}
                onChange={(e) => setEditingPin({ closeTime: e.target.value })}
                className="border p-1 w-1/2 rounded"
              />
            </div>

            <textarea
              value={editingPin.description || ''}
              onChange={(e) => setEditingPin({ description: e.target.value })}
              className="w-full border p-1 rounded resize-none"
              placeholder="설명"
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (isNew && newPin) {
                    onUpdatePin([...pins, newPin]); // ✅ 새 핀은 여기서만 실제 추가
                    setNewPin(null);
                  }
                  setEditMode(false);
                  setSelectedPinIndex(null);
                }}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                저장
              </button>

              {isNew && (
                <button
                  onClick={() => {
                    setNewPin(null);  // 취소하면 임시 핀 폐기
                    setEditMode(false);
                  }}
                  className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  </InfoWindow>
)}

    </GoogleMap>
  );
}
