export interface Flight { // 하나의 항공편 정보를 담는 타입 
  airline: string;
  airPlanecode: string;
  departureTime: string;
}

export interface FlightPage { // 목록과 페이지 정보를 담는 타입
  items: Flight[];
  nextPage: number | null;
  hasNext: boolean;
}

export const fetchFlights = async ({ // 항공편 데이터를 가져오는 비동기 함수
  departure,
  arrival,
  departureDate,
  returnDate,
  goPage = 1, // 출국편 정보 1페이지
  backPage = 1, // 귀국편 정보 1페이지
  size = 10,
}: {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate: string;
  goPage?: number;
  backPage?: number;
  size?: number;

}): Promise<{ go: FlightPage; back: FlightPage }> => { // 결과가 go, back 객체인 Promise
  const res = await fetch('http://localhost:8080/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      departure,
      arrival,
      departureDate,
      returnDate,
      goPage,
      backPage,
      size,
    }),
  });

  const data = await res.json();

  console.log("✅ fetchFlights 응답:", data);

  if (!res.ok) {
    throw new Error('Failed to fetch flights');
  }

  return data; // 응답받은 데이터 반환(반환 타입 : { go: FlightPage; back: FlightPage })
};
