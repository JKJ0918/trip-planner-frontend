// components/MyMap.tsx
'use client';

import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '650px',
  height: '650px',
}

const center = {
  lat: 37.5665,
  lng: 126.9780, // 서울
};

export default function MyMap(){
    const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // .env 파일에서 관리
  });

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  );

}