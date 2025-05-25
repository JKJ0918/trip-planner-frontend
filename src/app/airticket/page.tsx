'use client';

import GoFlightTable from './components/GoFlightTable';
import React, { useState } from 'react';

export default function FlightSearchForm() {
  const [departure, setDeparture] = useState(''); // 출발지
  const [arrival, setArrival] = useState(''); // 도착지
  const [departureDate, setDepartureDate] = useState(''); // 출국 날짜
  const [returnDate, setReturnDate] = useState(''); // 귀국 날짜
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const handleSearch = () => {
  setIsSearchClicked(true); // 검색 버튼 클릭 여부 표시
  };

  {/*// 데이터 요청함수
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
  console.log("전체응답", data);
  // go → 출국편, back → 귀국편
  setGoFlights(data.go || []);
  setBackFlights(data.back || []);

  console.log("출국편", data.go);
  console.log("귀국편", data.back);
}; */}




  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      {/* 검색 폼 */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              항공권 검색
            </h1>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              일정을 입력하고 항공 일정을 확인해 보세요. 
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          {/* Card */}
          <div className="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
              <div className="grid gap-4 lg:gap-6">
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">출발지</label>
                    <input type="text" 
                           className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                           placeholder="예 ICN"
                           value={departure}
                           onChange={(e) => setDeparture(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">도착지</label>
                    <input type="text"
                           className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                           placeholder="예 KIX"
                           value={arrival}
                           onChange={(e) => setArrival(e.target.value)}
                    />
                  </div>
                </div>
                {/* End Grid */}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">가는날</label>
                    <input type="date"
                           className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                           value={departureDate}
                           onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">오는날</label>
                    <input type="date"
                           className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                           value={returnDate}
                           onChange={(e) => setReturnDate(e.target.value)}
                           />
                  </div>
                </div>
                {/* End Grid */}
              </div>
              {/* End Grid */}

              <div className="mt-6 grid">
                <button 
                   className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                   onClick={handleSearch}
                   >검색</button>
              </div>
          </div>
          {/* End Card */}
        </div>

      </div>

    {isSearchClicked && (
      <GoFlightTable
        departure={departure}
        arrival={arrival}
        departureDate={departureDate.replace(/-/g, '')}
        returnDate={returnDate.replace(/-/g, '')}
      />
    )}

    </div>

  );
}
