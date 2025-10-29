// components/TravelPost/HeroSection.tsx
import React from 'react';

type HeroSectionProps = {
  title: string;
  locationSummary: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  thumbnailUrl: string;
  authorNickname: string;

  useFlight?: boolean;
  flightDepartureAirline?: string;
  flightDepartureName?: string;
  flightDepartureTime?: string;
  flightDepartureAirport?: string;
  flightArrivalAirport?: string;
  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
  flightReturnDepartureAirport?: string;
  flightReturnArrivalAirport?: string;
  travelTrans?: string;
  totalBudget?: string;
  travelTheme?: string;
  review?: string;
  isAfterTravel?: boolean;
};


// 날짜 표시
function formatDateWithDayAndPeriod(startStr: string, endStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const start = new Date(startStr);
  const end = new Date(endStr);

  const startDay = days[start.getDay()];
  const endDay = days[end.getDay()];

  const nights = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalDays = nights + 1;

  const format = (d: Date, day: string) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}(${day})`;

  return `${format(start, startDay)} ~ ${format(end, endDay)} ${nights}박 ${totalDays}일`;
}


export default function HeroSection({
  title,
  locationSummary,
  description,
  dateRange,
  thumbnailUrl,
  authorNickname,
  useFlight,
  flightDepartureAirline,
  flightDepartureName,
  flightDepartureTime,
  flightDepartureAirport,
  flightArrivalAirport,
  flightReturnAirline,
  flightReturnName,
  flightReturnTime,
  flightReturnDepartureAirport,
  flightReturnArrivalAirport,
  travelTrans,
  totalBudget,
  travelTheme,
  review,
  isAfterTravel,
}: HeroSectionProps) {
  return (
    <div className="w-full overflow-hidden mb-8">

      {/* 히어로 이미지 + 텍스트 오른쪽 */}
      <div className="flex flex-col md:flex-row gap-8 p-6">
        {/* 좌측 이미지 */}
        <div className="w-full md:w-1/2 h-64 md:h-96 rounded-xl overflow-hidden shadow">
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE}${thumbnailUrl}`}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>



        {/* 우측 텍스트 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">

          {/* 여행 상태 뱃지 */}
          <div className="mb-2">
            {isAfterTravel ? (
              <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full w-fit">
                여행 완료
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full w-fit">
                여행 예정
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-gray-700 mb-1">
            {locationSummary}
          </p>
          <p className="text-sm text-gray-500">
            {description}
          </p>
          <p className="text-sm text-gray-500">작성자: {authorNickname}</p>
        </div>
      </div>

      {/* 분리된 여행 정보 블록 */}
      <h3 className="text-xl font-semibold mb-3 pb-2 py-4">여행 정보</h3>
        <div className="text-sm space-y-1">

          {/* 여행 기간 */}
          <div className="py-4 border-b">
            <div className="font-semibold text-gray-700 mb-2">여행 기간</div>
            <div className="ml-4 text-gray-800">
              {formatDateWithDayAndPeriod(dateRange.startDate, dateRange.endDate)}
            </div>
          </div>


          {useFlight && (
            <div className="py-4 border-b">
              <div className="font-semibold text-gray-700 mb-4">항공 일정</div>

              <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-800">

                {/* 출국편 */}
                <div className="flex-1 rounded-lg p-1">
                  <p className="font-semibold text-black-600 mb-2">출국편</p>
                  <div className="flex items-center gap-2 mb-1">

                    <span className="font-medium">{flightDepartureAirline}</span> {flightDepartureName}
                  </div>
                  <p className="mb-1">{flightDepartureAirport} → {flightArrivalAirport}</p>
                  <p className="text-gray-500">{flightDepartureTime}</p>
                </div>

                {/* 귀국편 */}
                <div className="flex-1 rounded-lg p-1">
                  <p className="font-semibold text-black-600 mb-2">귀국편</p>
                  <div className="flex items-center gap-2 mb-1">

                    <span className="font-medium">{flightReturnAirline}</span> {flightReturnName}
                  </div>
                  <p className="mb-1">{flightReturnDepartureAirport} → {flightReturnArrivalAirport}</p>
                  <p className="text-gray-500">{flightReturnTime}</p>
                </div>

              </div>
            </div>
          )}



          {/* 교통수단 */}
          <div className="py-4 border-b">
            <div className="font-semibold text-gray-700">교통수단 </div>
            <div className="ml-4 text-gray-800">{travelTrans}</div>
          </div>

          {/* 예산 */}
          <div className="py-4 border-b">
            <div className="font-semibold text-gray-700">총 예산</div>
            <div className="ml-4 text-gray-800">{totalBudget} 원</div>
          </div>

          {/* 테마 */}
          <div className="py-4 border-b">
            <div className="font-semibold text-gray-700">테마</div>
            <div className="ml-4 text-gray-800">{travelTheme}</div>
          </div>
          {/* 후기 */}
          <div className="py-4 border-b">
            <div className="font-semibold text-gray-700">후기</div>
            <div className="ml-4 text-gray-800">{review || '-'}</div>
          </div>

        </div>
    </div>
  );
}
