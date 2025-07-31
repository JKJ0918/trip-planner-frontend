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
  images?: File[];
};


export default function MyMap() {
  const pins = useTripStore((state) => state.pins);
  const setPins = useTripStore((state) => state.setPins);
  const addPin = useTripStore((state) => state.addPin);
  const deletePin = useTripStore((state) => state.deletePin);

  const { lat, lng } = useLocationStore();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat, lng });

  // 수정 후: Zustand로부터 받아오기
  const selectedPinIndex = useTripStore((state) => state.selectedPinIndex);
  const setSelectedPinIndex = useTripStore((state) => state.setSelectedPinIndex);
  const highlightedIndex = useTripStore((state) => state.highlightedIndex);
  const setHighlightedIndex = useTripStore((state) => state.setHighlightedIndex);

  const [editMode, setEditMode] = useState(false);
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

    const newPin: Pin = {
      lat: selectedPos.lat,
      lng: selectedPos.lng,
      name: formData.name,
      category: formData.category,
      address: formData.address,
      minCost: formData.minCost,
      maxCost: formData.maxCost,
      currency: formData.currency,
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      description: formData.description,
      images: images, // 이미지도 함께 저장
    };

    addPin(newPin);          // Zustand에 저장
    setSelectedPos(null);    // InfoWindow 닫기
    setFormData({            // form 초기화
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
    setImages([]); // 이미지 초기화
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
                  <option value="숙소">숙소</option>
                  <option value="음식점">음식점</option>
                  <option value="의료">의료</option>
                  <option value="행정">행정</option>
                  <option value="공항">공항</option>
                  <option value="도시">도시</option>
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
          {/*수정 모드*/}
          {selectedPinIndex !== null && (
            <InfoWindow
              position={{
                lat: pins[selectedPinIndex].lat + 0.00004,
                lng: pins[selectedPinIndex].lng,
              }}
              onCloseClick={() => setSelectedPinIndex(null)}
            >
              {editMode ? (
                <div className="space-y-2 text-sm w-64">
                  <h3 className="text-center text-blue-600 font-semibold">정보 입력</h3>

                  {/* 이미지 수정 UI */}
                  <div className="flex gap-1.5 overflow-x-auto">
                    {(pins[selectedPinIndex].images || []).map((img, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`img-${i}`}
                          className="rounded border w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            const updatedPins = [...pins];
                            updatedPins[selectedPinIndex].images = updatedPins[selectedPinIndex].images?.filter((_, idx) => idx !== i);
                            setPins(updatedPins);
                          }}
                          className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 이미지 업로드 */}
                  {(pins[selectedPinIndex].images?.length || 0) < 3 && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="edit-image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const updatedPins = [...pins];
                          updatedPins[selectedPinIndex].images = [...(updatedPins[selectedPinIndex].images || []), file];
                          setPins(updatedPins);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="edit-image-upload"
                        className="cursor-pointer inline-block bg-gray-400 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                      >
                        이미지 추가
                      </label>
                    </>
                  )}

                  {/* 이름 */}
                  <input
                    type="text"
                    value={pins[selectedPinIndex].name}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].name = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full rounded"
                    placeholder="장소 이름"
                  />

                  {/* 카테고리 */}
                  <select
                    value={pins[selectedPinIndex].category}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].category = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="숙소">🏨 숙소</option>
                    <option value="음식점">🍽️ 음식점</option>
                    <option value="의료">🏥 의료</option>
                    <option value="행정">🏛️ 행정</option>
                    <option value="공항">✈️ 공항</option>
                    <option value="도시">🌆 도시</option>
                  </select>

                  {/* 주소 */}
                  <input
                    type="text"
                    value={pins[selectedPinIndex].address}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].address = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full rounded"
                    placeholder="주소"
                  />

                  {/* 비용 */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={pins[selectedPinIndex].minCost || ''}
                      onChange={(e) => {
                        const newPins = [...pins];
                        newPins[selectedPinIndex].minCost = e.target.value;
                        setPins(newPins);
                      }}
                      placeholder="최소 비용"
                      className="border p-1 w-1/2 rounded"
                    />
                    <span>~</span>
                    <input
                      type="number"
                      value={pins[selectedPinIndex].maxCost || ''}
                      onChange={(e) => {
                        const newPins = [...pins];
                        newPins[selectedPinIndex].maxCost = e.target.value;
                        setPins(newPins);
                      }}
                      placeholder="최대 비용"
                      className="border p-1 w-1/2 rounded"
                    />
                  </div>

                  {/* 화폐 */}
                  <select
                    value={pins[selectedPinIndex].currency || '₩'}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].currency = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full rounded"
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
                      value={pins[selectedPinIndex].openTime || ''}
                      onChange={(e) => {
                        const newPins = [...pins];
                        newPins[selectedPinIndex].openTime = e.target.value;
                        setPins(newPins);
                      }}
                      className="border p-1 w-1/2 rounded"
                    />
                    <span>~</span>
                    <input
                      type="time"
                      value={pins[selectedPinIndex].closeTime || ''}
                      onChange={(e) => {
                        const newPins = [...pins];
                        newPins[selectedPinIndex].closeTime = e.target.value;
                        setPins(newPins);
                      }}
                      className="border p-1 w-1/2 rounded"
                    />
                  </div>

                  {/* 설명 */}
                  <textarea
                    value={pins[selectedPinIndex].description || ''}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].description = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full rounded resize-none"
                    rows={3}
                    placeholder="내용 입력"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                // 상세 보기
                <div className="w-64 text-sm space-y-2">
                  <h3 className="text-center text-blue-600 font-semibold">방문지 정보</h3>
                  {pins[selectedPinIndex].images && pins[selectedPinIndex].images.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto">
                      {pins[selectedPinIndex].images.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          alt={`img-${i}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{pins[selectedPinIndex].name}</p>
                    <p className="text-gray-600">{pins[selectedPinIndex].category}</p>
                    <p className="text-xs text-gray-500">{pins[selectedPinIndex].address}</p>
                  </div>
                  {(pins[selectedPinIndex].minCost || pins[selectedPinIndex].maxCost) && (
                    <p className="text-xs text-gray-600">
                      비용: {pins[selectedPinIndex].minCost || '0'} ~ {pins[selectedPinIndex].maxCost || '0'} {pins[selectedPinIndex].currency || '₩'}
                    </p>
                  )}
                  {(pins[selectedPinIndex].openTime || pins[selectedPinIndex].closeTime) && (
                    <p className="text-xs text-gray-600">
                      운영시간: {pins[selectedPinIndex].openTime || '-'} ~ {pins[selectedPinIndex].closeTime || '-'}
                    </p>
                  )}
                  {pins[selectedPinIndex].description && (
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">
                      {pins[selectedPinIndex].description}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        handleDeletePin(selectedPinIndex);
                        setSelectedPinIndex(null);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

    </div>
  );
}