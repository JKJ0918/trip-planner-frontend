'use client';

import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useLocationStore } from '@/app/main/utils/locationStore';
import { useTripStore } from '../utils/tripstore';

const containerStyle = {
  width: '100%',
  height: '834px',
};

const center = {
  lat: 37.5665,
  lng: 126.978,
};

type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
};


export default function MyMap() {
  const pins = useTripStore((state) => state.pins);
  const setPins = useTripStore((state) => state.setPins);
  const addPin = useTripStore((state) => state.addPin);
  const deletePin = useTripStore((state) => state.deletePin);

  const { lat, lng } = useLocationStore();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat, lng });
  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const setMapRef = useTripStore((state) => state.setMapRef);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    minCost: '',
    maxCost: '',
    currency: '₩',
    openTime: '',
    closeTime: '',
    description: '',
  });


  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPos({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }, []);

  const handleAddPin = () => {
    if (!selectedPos) return;
    addPin({
      lat: selectedPos.lat,
      lng: selectedPos.lng,
      name: formData.name,
      category: formData.category,
      address: formData.address,
      // 확장된 필드 예시:
      minCost: formData.minCost,
      maxCost: formData.maxCost,
      currency: formData.currency,
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      description: formData.description,
      // 추후 이미지도 함께 연동 가능
    });
    setSelectedPos(null);
    setFormData({
      name: '',
      category: '',
      address: '',
      minCost: '',
      maxCost: '',
      currency: '₩',
      openTime: '',
      closeTime: '',
      description: '',
    });
  };


  const handleListClick = (pin: Pin, index: number) => {
    if (highlightedIndex === index) {
      setHighlightedIndex(null);
      setSelectedPinIndex(null);
    } else {
      if (mapRef.current) {
        mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
      }
      setHighlightedIndex(index);
      setSelectedPinIndex(index);
      setEditMode(false);
    }
  };

  const handleDeletePin = (index: number) => {
    deletePin(index);
    setSelectedPinIndex(null);
  };

  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImage = e.target.files[0];
    const file = e.target.files?.[0];
    if (!file) return; // 유효한 파일이 없을 경우 리턴
    if (images.length < 3) {
      setImages((prev) => [...prev, newImage]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };



  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      {/* 지도 영역 */}
      <div className="flex-1">
        <GoogleMap
          // onLoad={onLoad}
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
            setMapRef(map); // Zustand에 저장
          }}

        >
          {pins.map((pin, index) => (
            <Marker
              key={index}
              position={{ lat: pin.lat, lng: pin.lng }}
              label={{
                text: `${index + 1}`,
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              icon={{
                url:
                  highlightedIndex === index
                    ? 'http://maps.google.com/mapfiles/ms/icons/white-dot.png'
                    : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => {
                if (highlightedIndex === index) {
                  setHighlightedIndex(null);
                  setSelectedPinIndex(null);
                } else {
                  setHighlightedIndex(index);
                  setSelectedPinIndex(index);
                  setEditMode(false);
                }
              }}
            />
          ))}

          {selectedPos && (
            <InfoWindow position={selectedPos} onCloseClick={() => setSelectedPos(null)}>
              <div className="w-64 p-3 space-y-2 text-sm">

                {/* 이미지 미리보기 및 삭제 */}
                <div className="flex gap-1.5 overflow-x-auto">
                  {images.map((img, index) =>
                    img instanceof File ? (
                      <div key={index} className="relative w-18 h-18">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="rounded border w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5"
                        >
                          ×
                        </button>
                      </div>
                    ) : null
                  )}
                </div>

                {/* 이미지 업로드 */}
                {images.length < 3 && (
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                )}
                {/* 사용자에게 보이는 커스텀 버튼 */}

                {images.length < 3 && (
                  <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block bg-gray-400 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                >
                  이미지 추가
                </label>
                )}

                {images.length > 0 && (
                  <p className="text-xs text-gray-600">{images.length}장 추가됨</p>
                )}

                <input
                  type="text"
                  placeholder="장소 이름"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-1 rounded"
                />

                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-1 rounded"
                >
                  <option value="">카테고리 선택</option>
                  <option value="숙소">🏨 숙소</option>
                  <option value="음식점">🍽️ 음식점</option>
                  <option value="의료">🏥 의료</option>
                  <option value="행정">🏛️ 행정</option>
                  <option value="공항">✈️ 공항</option>
                  <option value="도시">🌆 도시</option>
                </select>

                <input
                  type="text"
                  placeholder="주소"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-1 rounded"
                />

                {/* 비용 */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="최소 비용"
                    value={formData.minCost}
                    onChange={(e) => setFormData({ ...formData, minCost: e.target.value })}
                    className="w-1/2 p-1 rounded"
                  />
                  <span>~</span>
                  <input
                    type="number"
                    placeholder="최대 비용"
                    value={formData.maxCost}
                    onChange={(e) => setFormData({ ...formData, maxCost: e.target.value })}
                    className="w-1/2 p-1 rounded"
                  />
                </div>

                <select
                  className="w-full p-1 rounded"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="₩">₩ 원</option>
                  <option value="$">$ 달러</option>
                  <option value="€">€ 유로</option>
                  <option value="¥">¥ 엔</option>
                </select>

                {/* 운영시간 */}
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    className="w-1/2 p-1 rounded"
                  />
                  <span>~</span>
                  <input
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    className="w-1/2 p-1 rounded"
                  />
                </div>

                {/* 내용 */}
                <textarea
                  placeholder="내용"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-1 rounded resize-none"
                  rows={3}
                />




                <button
                  onClick={handleAddPin}
                  className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                >
                  방문지 입력
                </button>
              </div>
            </InfoWindow>


          )}

          {selectedPinIndex !== null && (
            <InfoWindow
              position={{
                lat: pins[selectedPinIndex].lat + 0.00004,
                lng: pins[selectedPinIndex].lng,
              }}
              onCloseClick={() => setSelectedPinIndex(null)}
            >
              {editMode ? ( // 수정
                <div className="space-y-2">
                  <input
                    type="text" // 이름
                    value={pins[selectedPinIndex].name}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].name = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full"
                  />
                  <select
                    value={pins[selectedPinIndex].category} // 카테고리
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].category = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="숙소">🏨 숙소</option>
                    <option value="음식점">🍽️ 음식점</option>
                    <option value="의료">🏥 의료</option>
                    <option value="행정">🏛️ 행정</option>
                    <option value="공항">✈️ 공항</option>
                    <option value="도시">🌆 도시</option>
                  </select>


                  <input
                    type="text" // 주소
                    value={pins[selectedPinIndex].address}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].address = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full"
                  />
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    저장
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold">{pins[selectedPinIndex].name}</h3>
                  <p>{pins[selectedPinIndex].category}</p>
                  <p className="text-sm text-gray-600">{pins[selectedPinIndex].address}</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      handleDeletePin(selectedPinIndex);
                      setSelectedPinIndex(null);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              )}
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

    </div>
  );
}
