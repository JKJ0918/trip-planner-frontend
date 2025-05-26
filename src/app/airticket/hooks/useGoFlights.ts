import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFlights, FlightPage } from '../utils/fetchFlights'; // 페이지 단위로 호출

export const useGoFlights = ({ // custom hook 선언
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
    // 캐시를 구분하는 key, 이 값이 같으면 이전 데이를 재사용
    // 항공편 조회 조건이 바뀌면 캐시를 무효화하고 새로운 데이터를 불러옴
    queryFn: async ({ pageParam = 1 }) => {
      // pageParam=현재 페이지 번호. 처음 기본값 1
      // 무한 스크롤로 호출될 때마다 이 값이 바뀜
      const page = pageParam as number; // pageParam을 number로 캐스팅

      const data = await fetchFlights({
        departure,
        arrival,
        departureDate,
        returnDate,
        goPage: page, // 현재 스크롤의 페이지 수 
        backPage: 1, // 귀국편 보류중.
        size,
      });

        console.log("📥 받은 go 응답:", data.go);

      return data.go; // tanStack Query 내부에 저장됨.

      
    },
    getNextPageParam: (lastPage) =>
      // 마지막 페이지 정보를 바탕으로 다음 페이지가 있는지 판단  
      lastPage.hasNext ? lastPage.nextPage : undefined,

    initialPageParam: 1,

    
  });
};
