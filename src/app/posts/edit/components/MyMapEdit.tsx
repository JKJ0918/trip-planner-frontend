// 📁 MyMapEdit.tsx

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
        const updated = [...pins, newPin];
        onUpdatePin(updated);
        setSelectedPinIndex(updated.length - 1);
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

      {selectedPinIndex !== null && (
        <InfoWindow
          position={{ lat: pins[selectedPinIndex].lat, lng: pins[selectedPinIndex].lng }}
          onCloseClick={() => {
            setSelectedPinIndex(null);
            setEditMode(false);
          }}
        >
          {editMode ? (
            <div className="w-64 p-2 space-y-2 text-sm">
              <h3 className="text-center text-blue-600 font-semibold">정보 수정</h3>

              {pins[selectedPinIndex].images?.map((img, i) => {
                const src = img instanceof File ? URL.createObjectURL(img) : `${BASE_URL}${img}`;
                return (
                  <div key={i} className="relative w-20 h-16">
                    <img src={src} className="w-full h-full object-cover rounded border" alt={`img-${i}`} />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {(pins[selectedPinIndex].images?.length || 0) < 3 && (
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              )}

              <input
                value={pins[selectedPinIndex].name}
                onChange={(e) => {
                  const copy = [...pins];
                  copy[selectedPinIndex].name = e.target.value;
                  onUpdatePin(copy);
                }}
                className="w-full border p-1 rounded"
                placeholder="장소 이름"
              />

              <select
                value={pins[selectedPinIndex].category}
                onChange={(e) => {
                  const copy = [...pins];
                  copy[selectedPinIndex].category = e.target.value;
                  onUpdatePin(copy);
                }}
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
                value={pins[selectedPinIndex].address}
                onChange={(e) => {
                  const copy = [...pins];
                  copy[selectedPinIndex].address = e.target.value;
                  onUpdatePin(copy);
                }}
                className="w-full border p-1 rounded"
                placeholder="주소"
              />

              <div className="flex gap-1">
                <input
                  type="number"
                  value={pins[selectedPinIndex].minCost || ''}
                  onChange={(e) => {
                    const copy = [...pins];
                    copy[selectedPinIndex].minCost = e.target.value;
                    onUpdatePin(copy);
                  }}
                  placeholder="최소 비용"
                  className="border p-1 w-1/2 rounded"
                />
                <input
                  type="number"
                  value={pins[selectedPinIndex].maxCost || ''}
                  onChange={(e) => {
                    const copy = [...pins];
                    copy[selectedPinIndex].maxCost = e.target.value;
                    onUpdatePin(copy);
                  }}
                  placeholder="최대 비용"
                  className="border p-1 w-1/2 rounded"
                />
              </div>

              <select
                value={pins[selectedPinIndex].currency || '₩'}
                onChange={(e) => {
                  const copy = [...pins];
                  copy[selectedPinIndex].currency = e.target.value;
                  onUpdatePin(copy);
                }}
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
                  value={pins[selectedPinIndex].openTime || ''}
                  onChange={(e) => {
                    const copy = [...pins];
                    copy[selectedPinIndex].openTime = e.target.value;
                    onUpdatePin(copy);
                  }}
                  className="border p-1 w-1/2 rounded"
                />
                <input
                  type="time"
                  value={pins[selectedPinIndex].closeTime || ''}
                  onChange={(e) => {
                    const copy = [...pins];
                    copy[selectedPinIndex].closeTime = e.target.value;
                    onUpdatePin(copy);
                  }}
                  className="border p-1 w-1/2 rounded"
                />
              </div>

              <textarea
                value={pins[selectedPinIndex].description || ''}
                onChange={(e) => {
                  const copy = [...pins];
                  copy[selectedPinIndex].description = e.target.value;
                  onUpdatePin(copy);
                }}
                className="w-full border p-1 rounded resize-none"
                placeholder="설명"
                rows={3}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="w-64 text-sm p-2 space-y-2">
              <h3 className="text-center text-blue-600 font-semibold">방문지 정보</h3>
                <div className="flex gap-1">
                {pins[selectedPinIndex].images?.slice(0, 3).map((img, i) => {
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
              <p className="font-bold text-gray-800">{pins[selectedPinIndex].name}</p>
              <p>{pins[selectedPinIndex].category} / {pins[selectedPinIndex].address}</p>
              <p>{pins[selectedPinIndex].minCost} ~ {pins[selectedPinIndex].maxCost} {pins[selectedPinIndex].currency}</p>
              <p>운영시간: {pins[selectedPinIndex].openTime} ~ {pins[selectedPinIndex].closeTime}</p>
              <p className="whitespace-pre-wrap text-xs text-gray-700">
                {pins[selectedPinIndex].description}
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
          )}
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
