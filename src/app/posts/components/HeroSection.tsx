// components/TravelPost/HeroSection.tsx
// 상세보기 표지
import React from 'react';

type HeroSectionProps = {
  title: string;
  locationSummary: string;
  dateRange: { startDate: string; endDate: string };
  thumbnailUrl: string;
  authorNickname: string;

  // 추가: 여행 정보
  useFlight?: boolean;
  flightDepartureAirline?: string;
  flightDepartureName?: string;
  flightDepartureTime?: string;
  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
  travelTrans?: string;
  totalBudget?: string;
  travelTheme?: string;
  review?: string;
  isAfterTravel?: boolean;
};


const BASE_URL = "http://localhost:8080"

export default function HeroSection({
  title,
  locationSummary,
  dateRange,
  thumbnailUrl,
  authorNickname,
  useFlight,
  flightDepartureAirline,
  flightDepartureName,
  flightDepartureTime,
  flightReturnAirline,
  flightReturnName,
  flightReturnTime,
  travelTrans,
  totalBudget,
  travelTheme,
  review,
  isAfterTravel,
}: HeroSectionProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md mb-8">
      {/* 이미지 영역 */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={`${BASE_URL}${thumbnailUrl}`}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-lg">
            📍 {locationSummary} | 🗓️ {dateRange.startDate} ~ {dateRange.endDate}
          </p>
          <p className="text-sm mt-1">작성자: @{authorNickname}</p>
        </div>
      </div>

      {/* 여행 정보 박스 */}
      <div className="bg-gray-50 p-4 text-sm text-gray-800">
        <h3 className="text-lg font-semibold mb-2">📖 여행 정보</h3>
        {useFlight && (
          <>
            <p>✈️ 출발 항공: {flightDepartureAirline} / {flightDepartureName} / {flightDepartureTime}</p>
            <p>✈️ 귀국 항공: {flightReturnAirline} / {flightReturnName} / {flightReturnTime}</p>
          </>
        )}
        <p>🚗 교통수단: {travelTrans}</p>
        <p>💰 총 예산: {totalBudget}</p>
        <p>🎨 테마: {travelTheme}</p>
        <p>📝 후기: {review}</p>
        <p>📅 여행 완료 여부: {isAfterTravel ? '여행 완료' : '여행 예정'}</p>
      </div>
    </div>
  );
}
