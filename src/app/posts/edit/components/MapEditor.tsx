'use client';

import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
};

type MapEditorProps = {
  pins: Pin[];
  onPinsChange: (updatedPins: Pin[]) => void;
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function MapEditor({ pins, onPinsChange }: MapEditorProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [localPins, setLocalPins] = useState<Pin[]>(pins);
  const [pendingPin, setPendingPin] = useState<Pin | null>(null);
  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (pins.length > 0) {
      mapRef.current?.panTo({ lat: pins[0].lat, lng: pins[0].lng });
    }
  }, [pins]);

  useEffect(() => {
    setLocalPins(pins);
  }, [pins]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    setSelectedPinIndex(null); // 기존 핀 선택 해제
    setIsEditing(false);
    setPendingPin({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      name: '',
      category: '',
      address: '',
    });
  };

  const handleRegisterPin = () => {
    if (!pendingPin) return;
    const updated = [...localPins, pendingPin];
    setLocalPins(updated);
    onPinsChange(updated);
    setPendingPin(null);
  };

  const handleCancelPending = () => {
    setPendingPin(null);
  };

  const handleInputChange = (field: keyof Pin, value: string) => {
    if (selectedPinIndex === null) return;
    const updatedPins = [...localPins];
    updatedPins[selectedPinIndex] = {
      ...updatedPins[selectedPinIndex],
      [field]: value,
    };
    setLocalPins(updatedPins);
    onPinsChange(updatedPins);
  };

  if (!isLoaded) return <div>지도를 불러오는 중...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={12}
        onClick={handleMapClick}
        onLoad={onLoad}
      >
        {localPins.map((pin, index) => (
          <Marker
            key={index}
            position={{ lat: pin.lat, lng: pin.lng }}
            onClick={() => {
              setPendingPin(null);
              setSelectedPinIndex(index);
              setIsEditing(false);
            }}
          />
        ))}

        {/* InfoWindow for existing pin */}
        {selectedPinIndex !== null && (
          <InfoWindow
            position={{
              lat: localPins[selectedPinIndex].lat,
              lng: localPins[selectedPinIndex].lng,
            }}
            onCloseClick={() => {
              setSelectedPinIndex(null);
              setIsEditing(false);
            }}
          >
            <div className="space-y-1" style={{ minWidth: '200px' }}>
              {isEditing ? (
                <>
                  <input
                    className="border w-full px-1 py-0.5"
                    value={localPins[selectedPinIndex].name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  <input
                    className="border w-full px-1 py-0.5"
                    value={localPins[selectedPinIndex].category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  <input
                    className="border w-full px-1 py-0.5"
                    value={localPins[selectedPinIndex].address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => setIsEditing(false)}
                    >
                      저장
                    </button>
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => setIsEditing(false)}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>이름:</strong> {localPins[selectedPinIndex].name}</p>
                  <p><strong>카테고리:</strong> {localPins[selectedPinIndex].category}</p>
                  <p><strong>주소:</strong> {localPins[selectedPinIndex].address}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => setIsEditing(true)}
                    >
                      수정
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        const updated = localPins.filter((_, i) => i !== selectedPinIndex);
                        setLocalPins(updated);
                        onPinsChange(updated);
                        setSelectedPinIndex(null);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for pending pin */}
        {pendingPin && (
          <InfoWindow
            position={{ lat: pendingPin.lat, lng: pendingPin.lng }}
            onCloseClick={handleCancelPending}
          >
            <div className="space-y-2" style={{ minWidth: '200px' }}>
              <div>
                <label>이름</label>
                <input
                  type="text"
                  className="w-full border px-1 py-0.5 rounded"
                  value={pendingPin.name}
                  onChange={(e) => setPendingPin({ ...pendingPin, name: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label>카테고리</label>
                <input
                  type="text"
                  className="w-full border px-1 py-0.5 rounded"
                  value={pendingPin.category}
                  onChange={(e) => setPendingPin({ ...pendingPin, category: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label>주소</label>
                <input
                  type="text"
                  className="w-full border px-1 py-0.5 rounded"
                  value={pendingPin.address}
                  onChange={(e) => setPendingPin({ ...pendingPin, address: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={handleRegisterPin}
                >
                  등록
                </button>
                <button
                  className="bg-gray-300 text-black px-3 py-1 rounded"
                  onClick={handleCancelPending}
                >
                  취소
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 핀 목록 */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">📍 여행지 목록</h2>
        <ul className="space-y-1">
          {localPins.map((pin, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded border"
              onClick={() => {
                mapRef.current?.panTo({ lat: pin.lat, lng: pin.lng });
                setPendingPin(null);
                setSelectedPinIndex(index);
                setIsEditing(false);
              }}
            >
              <div className="font-medium">{pin.name || '이름 없음'}</div>
              <div className="text-sm text-gray-500">{pin.address || '주소 없음'}</div>
              <div className="text-xs text-gray-400">카테고리: {pin.category || '없음'}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
