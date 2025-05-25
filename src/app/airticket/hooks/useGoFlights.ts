import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFlights, FlightPage } from '../utils/fetchFlights';

export const useGoFlights = ({
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
    queryKey: ['goFlights', departure, arrival, departureDate, returnDate],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;

      const data = await fetchFlights({
        departure,
        arrival,
        departureDate,
        returnDate,
        goPage: page,
        backPage: 1, // 고정
        size,
      });

        console.log("📥 받은 go 응답:", data.go);

      return data.go;

      
    },
    getNextPageParam: (lastPage) =>
        
      lastPage.hasNext ? lastPage.nextPage : undefined,

    initialPageParam: 1,

    
  });
};
