'use client';

import React, { useState } from 'react';

export default function FlightSearchForm() {
  const [departure, setDeparture] = useState(''); // 출발지
  const [arrival, setArrival] = useState(''); // 도착지
  const [departureDate, setDepartureDate] = useState(''); // 출국 날짜
  const [returnDate, setReturnDate] = useState(''); // 귀국 날짜

  const handleSwap = () => { // 출발지 <-> 도착지 
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const handleSearch = async () => {
  const res = await fetch("http://localhost:8080/api/flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      departure,
      arrival,
      departureDate: departureDate.replace(/-/g, ""), // 2024-05-25 → 20240525
      returnDate: returnDate.replace(/-/g, ""),
    }),
  });

  const data = await res.json();

  // 예: go → 출국편, back → 귀국편
  console.log("출국편", data.go);
  console.log("귀국편", data.back);
};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">항공권 검색</h2>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">출발지</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="예: ICN"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="p-2 mt-5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={handleSwap}
          aria-label="Switch departure and arrival"
        >
          🔁
        </button>

        <div className="flex-1">
          <label className="block text-sm font-medium">도착지</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="예: PUS"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">가는 날짜</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">오는 날짜</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
    </div>
  );
}
