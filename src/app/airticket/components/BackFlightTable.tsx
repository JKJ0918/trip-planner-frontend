'use client';

import { useRef, useEffect } from 'react';
import { useBackFlights } from '../hooks/useBackFlights';

type Flight = {
  airline: string;
  airPlanecode: string;
  departureTime: string;
};

type BackFlightTableProps = {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate: string;
  selectedFlight: any;
  onSelectFlight: (flight: any) => void;
};

function BackFlightTable({
  departure,
  arrival,
  departureDate,
  returnDate,
  selectedFlight,
  onSelectFlight,
}: BackFlightTableProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBackFlights({
    departure,
    arrival,
    departureDate,
    returnDate,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <h3 className="text-l font-semibold mt-6 mb-2 text-gray-500">귀국편 검색 결과</h3>

      <div
        ref={scrollRef}
        className="border border-gray-200 p-2 h-[400px] overflow-y-auto rounded-lg dark:border-neutral-700"
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th></th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">항공사</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">항공편명</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">출발시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {data?.pages.map((page, pageIndex) =>
              page.items.map((flight, i) => {
                const isChecked =
                  selectedFlight?.airline === flight.airline &&
                  selectedFlight?.airPlanecode === flight.airPlanecode &&
                  selectedFlight?.departureTime === flight.departureTime;

                return (
                  <tr key={`${pageIndex}-${i}`}>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="radio"
                        name="backFlight"
                        checked={isChecked}
                        onChange={() => onSelectFlight(flight)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                      {flight.airline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                      {flight.airPlanecode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                      {flight.departureTime}
                    </td>
                  </tr>
                );
              })
            )}
            {isFetchingNextPage && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-sm text-gray-400">
                  로딩 중...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BackFlightTable;
