'use client';

import { useEffect } from 'react';
import { useGoFlights } from '../hooks/useGoFlights';

interface Props {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate: string;
}

const GoFlightTable: React.FC<Props> = ({
  departure,
  arrival,
  departureDate,
  returnDate,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGoFlights({
    departure,
    arrival,
    departureDate,
    returnDate,
  });

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

        console.log("🌀 스크롤 이벤트 발생");

        if (nearBottom) {
        console.log("🔽 바닥 근처 도달");
        }


      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        console.log("🚀 fetchNextPage 실행!");
        fetchNextPage();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <h3 className="text-l font-semibold mt-6 mb-2 text-gray-500">출국편 검색 결과</h3>

      <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">항공사</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">항공편명</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">출발시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {data?.pages.map((page, pageIndex) =>
              page.items.map((flight, i) => (
                <tr key={`${pageIndex}-${i}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{flight.airline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{flight.airPlanecode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{flight.departureTime}</td>
                </tr>
              ))
            )}
            {isFetchingNextPage && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-sm text-gray-400">로딩 중...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoFlightTable;
