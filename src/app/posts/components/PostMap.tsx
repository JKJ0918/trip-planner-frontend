'use client';

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useCallback, useState } from 'react';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
  images?: string[];      // 이미지 URL 목록
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
};


type Props = {
  pins: Pin[];
  selectedPin: Pin | null;
  setSelectedPin: (pin: Pin | null) => void;
  mapRef: { current: google.maps.Map | null }; // 줄 안 그어지는 타입 사용
};

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780,
};

// 지도 중심 초기값
const initialCenter = {
  lat: 37.5665,
  lng: 126.9780,
};


export default function PostMap({
  pins,
  selectedPin,
  setSelectedPin,
  mapRef,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [mapCenter] = useState(initialCenter); 

  const handleMarkerClick = useCallback(
    (pin: Pin) => {
      setSelectedPin(pin);
      if (mapRef.current) {
        mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
      }
    },
    [setSelectedPin, mapRef]
  );

  if (!isLoaded) return <p>지도를 불러오는 중입니다...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter} // 초기값만 지정, 이후엔 자동 유지
      zoom={12}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {pins.map((pin, idx) => (
        <Marker
          key={idx}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => handleMarkerClick(pin)}
        />
      ))}


    </GoogleMap>
  );
}
