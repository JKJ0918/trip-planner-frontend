'use client';

import BackFlightTable from './components/BackFlightTable';
import GoFlightTable from './components/GoFlightTable';
import React, { useState } from 'react';

export default function FlightSearchForm() {
  type Flight = {
  airline: string;
  airPlanecode: string;
  departureTime: string;
  };

  const [selectedGo, setSelectedGo] = useState<Flight | null>(null);
  const [selectedBack, setSelectedBack] = useState<Flight | null>(null);

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const handleSearch = () => {
    setIsSearchClicked(true);
    setSelectedGo(null);
    setSelectedBack(null);
  };

  

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* 검색 폼 */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">항공권 검색</h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            일정을 입력하고 항공 일정을 확인해 보세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="mt-12 max-w-lg mx-auto">
          <div className="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
            <div className="grid gap-4 lg:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">출발지</label>
                  <input type="text" placeholder="예: ICN"
                    className="input-field"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">도착지</label>
                  <input type="text" placeholder="예: KIX"
                    className="input-field"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">가는 날</label>
                  <input type="date"
                    className="input-field"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">오는 날</label>
                  <input type="date"
                    className="input-field"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid">
              <button
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      {isSearchClicked && (
        <div className="space-y-8">
          <GoFlightTable
            departure={departure}
            arrival={arrival}
            departureDate={departureDate.replace(/-/g, '')}
            returnDate={returnDate.replace(/-/g, '')}
            selectedFlight={selectedGo}
            onSelectFlight={setSelectedGo}
          />

          <BackFlightTable
            departure={departure}
            arrival={arrival}
            departureDate={departureDate.replace(/-/g, '')}
            returnDate={returnDate.replace(/-/g, '')}
            selectedFlight={selectedBack}
            onSelectFlight={setSelectedBack}
          />
        </div>
      )}

      {/* 선택 항공권 요약 */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">🧾 선택한 항공권</h2>
        {selectedGo && (
          <div className="p-4 rounded-lg border mb-2 bg-white shadow">
            ✈️ <strong>출국편</strong>: {selectedGo.airline} {selectedGo.airPlanecode} ({selectedGo.departureTime})
          </div>
        )}
        {selectedBack && (
          <div className="p-4 rounded-lg border bg-white shadow">
            🛬 <strong>귀국편</strong>: {selectedBack.airline} {selectedBack.airPlanecode} ({selectedBack.departureTime})
          </div>
        )}
      </div>
    </div>
  );
}
