// components/MyMap.tsx
'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useLocationStore } from '@/app/main/utils/locationStore';

const containerStyle = {
  width: '100%',
  height: '600px',
}

 const center = {
  lat: 37.5665, // 기본값: 서울
  lng: 126.9780,
   };


type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string
}

export default function MyMap(){

  const { lat, lng } = useLocationStore();
  // ✅ 최초 1번만 지도 중심 상태로 설정
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat,
    lng,
  });

  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);

  const [editMode, setEditMode] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

    const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // .env 파일에서 관리

  });

  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
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

    setPins([
      ...pins,
      {
        lat: selectedPos.lat,
        lng: selectedPos.lng,
        name: formData.name,
        category: formData.category,
        address: formData.address,
      },
    ]);

    setSelectedPos(null);
    setFormData({ name: '', category: '', address: '' });
  };

  if (!isLoaded) return <p>Loading...</p>;

  const handleListClick = (pin: Pin, index: number) => {
    if (highlightedIndex === index) {
      setHighlightedIndex(null);
      setSelectedPinIndex(null);
    } else {
      if (mapRef.current) {
        mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
        //mapRef.current.setZoom(16);
      }
      setHighlightedIndex(index);
      setSelectedPinIndex(index);
      setEditMode(false);
    }
  };

  const handleDeletePin = (index: number) => {
  const newPins = [...pins];
  newPins.splice(index, 1);
  setPins(newPins);
  setHighlightedIndex(null); // 선택 해제
};


  return (
    <div>
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
              ? 'http://maps.google.com/mapfiles/ms/icons/white-dot.png' // 선택된 마커는 하얀색
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
         }}
          onClick={() => {
              // 선택된 마커를 다시 클릭하면 해제
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
          <InfoWindow
            position={selectedPos}
            onCloseClick={() => setSelectedPos(null)}
          >
            <div className="p-2 space-y-2">
              <input
                type="text"
                placeholder="장소 이름"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-1 w-full"
              />
              <input
                type="text"
                placeholder="카테고리"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border p-1 w-full"
              />
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
                  setSelectedPinIndex(null); // InfoWindow 닫기
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </div>
          )}
        </InfoWindow>
      )}

      <Marker position={center} />
      </GoogleMap>
      {/* 지도 아래 목록 */}
      <div className="p-4 bg-white shadow-md">
        <h2 className="text-lg font-bold mb-2">📍 등록된 방문지</h2>
        <ul className="space-y-2">
          {pins.map((pin, index) => (
            <li
              key={index}
              onClick={() => handleListClick(pin, index)}
              className={`cursor-pointer border p-2 flex justify-between items-start transition duration-150 ease-in-out ${
                highlightedIndex === index
                  ? 'bg-yellow-100 border-yellow-400 border-2'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div>
                <p><strong>{index + 1}.</strong> {pin.name}</p>
                <p className="text-sm text-gray-600">{pin.category} / {pin.address}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 중첩 방지
                  handleDeletePin(index);
                }}
                className="text-red-500 font-bold ml-4"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}