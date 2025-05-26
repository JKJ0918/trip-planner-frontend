import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFlights, FlightPage } from '../utils/fetchFlights';

export const useBackFlights = ({
  departure,
  arrival,
  departureDate,
  returnDate,
  size = 10,
}: {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate: string;
  size?: number;
}) => {
  return useInfiniteQuery<FlightPage>({
    queryKey: ['backFlights', departure, arrival, departureDate, returnDate],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;

      const data = await fetchFlights({
        departure,
        arrival,
        departureDate,
        returnDate,
        goPage: 1, // 출국편은 고정
        backPage: page, // 귀국편 페이지 변화
        size,
      });

      console.log("📥 받은 back 응답:", data.back);

      return data.back;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });
};
