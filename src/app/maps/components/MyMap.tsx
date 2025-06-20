'use client';

import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useLocationStore } from '@/app/main/utils/locationStore';
import { useTripStore } from '../utils/tripstore';

const containerStyle = {
  width: '100%',
  height: '600px',
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

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

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
    });
    setSelectedPos(null);
    setFormData({ name: '', category: '', address: '' });
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

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-4">
      {/* 지도 영역 */}
      <div className="flex-1">
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
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
              <div className="p-2 space-y-2">
                <input
                  type="text"
                  placeholder="장소 이름"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border p-1 w-full"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border p-1 rounded"
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
                  type="text"
                  placeholder="주소"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border p-1 w-full"
                />
                <button
                  onClick={handleAddPin}
                  className="bg-blue-500 text-white px-3 py-1 mt-1 rounded"
                >
                  핀 추가하기
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
              {editMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={pins[selectedPinIndex].name}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].name = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full"
                  />
                  <input
                    type="text"
                    value={pins[selectedPinIndex].category}
                    onChange={(e) => {
                      const newPins = [...pins];
                      newPins[selectedPinIndex].category = e.target.value;
                      setPins(newPins);
                    }}
                    className="border p-1 w-full"
                  />
                  <input
                    type="text"
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

      {/* 방문지 리스트 우측 */}
      <div className="w-full lg:w-[300px]">
        <div className="p-4 bg-white shadow-md rounded-2xl max-h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">등록된 방문지</h2>

          <ul className="space-y-3">
            {pins.map((pin, index) => (
              <li
                key={index}
                onClick={() => handleListClick(pin, index)}
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
                      handleDeletePin(index);
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
              <p className="text-sm text-gray-500 text-center py-2">등록된 장소가 없습니다. 원하는 장소를 지도 위에 클릭해보세요.</p>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}
