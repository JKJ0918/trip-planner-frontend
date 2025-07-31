import React, { useState, useMemo } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
// import { Pin } from '../page';

type Pin = {
  lat: number; // 위도
  lng: number; // 경도
  name: string; // 위치명
  address: string; // 주소
  category: string; // 카테고리
  images?: string[]; // 이미지 URL 목록
  minCost?: string; // 금액(최소)
  maxCost?: string; // 금액(최대)
  currency?: string; // 화폐 단위
  openTime?: string; // 오픈시간
  closeTime?: string; // 마감시간
  description?: string; // 설명
};

const containerStyle = {
  width: '100%',
  height: '834px',
};

interface MyMapEditProps {
  pins: Pin[];
  onUpdatePin?: (updatedPins: Pin[]) => void;
}
const BASE_URL = "http://localhost:8080";
export default function MyMapEdit({ pins, onUpdatePin }: MyMapEditProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);

  const [editMode, setEditMode] = useState(false); // pin 정보 수정 상태 추가

  // 핀이 있으면 첫 번째 핀을 중심 좌표로 사용, 없으면 서울
  const center = useMemo(() => {
    if (pins.length > 0) {
      return { lat: pins[0].lat, lng: pins[0].lng };
    }
    return { lat: 37.5665, lng: 126.9780 }; // default: 서울
  }, [pins]);

  if (!isLoaded) return <div>지도를 불러오는 중...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {pins.map((pin, index) => (
        <Marker
          key={index}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => {
            setSelectedPinIndex(index);
            setEditMode(false); // 상세 보기부터 보여주기
          }}
        />
      ))}

      {selectedPinIndex !== null && (
        <InfoWindow
          position={{
            lat: pins[selectedPinIndex].lat,
            lng: pins[selectedPinIndex].lng,
          }}
          onCloseClick={() => {
            setSelectedPinIndex(null);
            setEditMode(false);
          }}
        >
          <div className="w-64 p-2">
            <h3 className="text-md font-semibold">{pins[selectedPinIndex].name}</h3>
            <p className="text-sm text-gray-600">{pins[selectedPinIndex].address}</p>
            <div className="flex gap-1 mt-2">
              {pins[selectedPinIndex].images?.slice(0, 3).map((url, i) => ( 
                /*pins[selectedPinIndex]: 현재 선택한 마커(핀)의 데이터

                .images?: 이미지 배열 (없을 수도 있으므로 optional chaining 사용)

                .slice(0, 2): 이미지가 2개 이상이어도 처음 2개까지만 보여줌 -> 3개까지로 바꿈, 3개가 한도임

                .map((url, i) => ...): 각 이미지 URL에 대해 반복 렌더링 (index i도 같이 줌)*/
                <img
                  key={i} // 반복문에서 React가 구분할 수 있도록 고유한 key 설정
                  src={`${BASE_URL}${url}`} // 상대경로 앞에 백엔드 주소 붙이기
                  className="w-20 h-16 rounded object-cover"
                  alt={`pin-img-${i}`}
                />
              ))}
            </div>
            <p className="text-xs mt-1">
              {pins[selectedPinIndex].minCost} ~ {pins[selectedPinIndex].maxCost} {pins[selectedPinIndex].currency}
              <br />
              운영시간: {pins[selectedPinIndex].openTime} ~ {pins[selectedPinIndex].closeTime}
            </p>
          </div>

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
                const newPins = [...pins];
                newPins.splice(selectedPinIndex, 1); // 삭제
                onUpdatePin?.(newPins);
                setSelectedPinIndex(null);
              }}
            >
              삭제
            </button>
          </div>

        </InfoWindow>
      )}
    </GoogleMap>
  );
}
