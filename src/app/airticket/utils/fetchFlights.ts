export interface Flight {
  airline: string;
  airPlanecode: string;
  departureTime: string;
}

export interface FlightPage {
  items: Flight[];
  nextPage: number | null;
  hasNext: boolean;
}

export const fetchFlights = async ({
  departure,
  arrival,
  departureDate,
  returnDate,
  goPage = 1,
  backPage = 1,
  size = 10,
}: {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate: string;
  goPage?: number;
  backPage?: number;
  size?: number;
}): Promise<{ go: FlightPage; back: FlightPage }> => {
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

  return data;
};
