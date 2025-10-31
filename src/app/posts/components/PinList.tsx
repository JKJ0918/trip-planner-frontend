// 상세 보기 안 핀 리스트
'use client';

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
  onSelect: (pin: Pin) => void;
  mapRef: { current: google.maps.Map | null };
};

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}`;

export default function PinList({ pins, onSelect, mapRef }: Props) {
  const handleClick = (pin: Pin) => {
    onSelect(pin);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">방문지 보기</h3>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pins.map((pin, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(pin)}
            className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 hover:bg-gray-50"
          >
            {/* 썸네일 */}
            {pin.images && pin.images.length > 0 && (
              <img
                src={`${pin.images[0]}`}
                alt={pin.name}
                className="w-full h-36 object-cover rounded-lg mb-2"
              />
            )}

            {/* 정보 */}
            <h4 className="font-semibold text-base">{pin.name}</h4>
            <p className="text-sm text-gray-500 truncate">{pin.address}</p>
            <p className="text-sm text-gray-400">{pin.category}</p>

            {/* 예산 표시 (있으면) */}
            {(pin.minCost || pin.maxCost) && (
              <p className="text-sm text-gray-400">
                금액 {pin.minCost} ~ {pin.maxCost} {pin.currency}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



