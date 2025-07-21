'use client';

import React from 'react';

import { TravelMainEntry } from '../types'; // 타입 선언이 있다면 사용
import DateRangePicker from '@/app/maps/components/DateRangePicker';

interface TravelInfoEditProps {
  travelMainEntry: TravelJournal;
  setTravelMainEntry: (entry: Partial<TravelJournal>) => void;
  handleDateChange: (ranges: any) => void;
}

export default function TravelInfoEdit({
  travelMainEntry,
  setTravelMainEntry,
  isPublic,
  setIsPublic,
  handleDateChange,
}: TravelInfoEditProps) {
  return (
    <div className="space-y-6">
      {/* 제목 */}
      <input
        name="title"
        value={travelMainEntry.title} //  travelMainEntry는 journalData
        onChange={handleDateChange} // handleChange는 입력값이 바뀔 때 상태를 바꾸는 함수
        placeholder="제목"
        className="w-full text-xl font-semibold"
      />

      {/* 날짜 */}
      <DateRangePicker />

      {/* 내용 요약 */}
      <textarea
        name="description"
        placeholder="여행과 관련된 내용을 적어주세요!"
        value={travelMainEntry.description || ''}
        onChange={handleChange}
        rows={3}
        className="w-full p-2 rounded border"
      />

      {/* 도시 */}
      <input
        name="locationSummary"
        value={travelMainEntry.locationSummary}
        onChange={handleChange}
        placeholder="여행 도시"
        className="w-full"
      />

      {/* 항공편 이용 여부 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={travelMainEntry.useFlight || false}
          onChange={(e) =>
            setTravelMainEntry({ useFlight: e.target.checked })
          }
          id="useFlight"
        />
        <label htmlFor="useFlight">항공기를 이용한 여행입니다</label>
      </div>

      {/* 항공편 정보 */}
      {travelMainEntry.useFlight && (
        <div className="grid grid-cols-2 gap-4">
          {/* 출국편 */}
          <div className="grid gap-2">
            <p className="font-semibold text-gray-600">출국편 정보</p>
            <input name="flightDepartureAirline" placeholder="항공사" value={travelMainEntry.flightDepartureAirline || ''} onChange={handleChange} />
            <input name="flightDepartureName" placeholder="항공편명" value={travelMainEntry.flightDepartureName || ''} onChange={handleChange} />
            <input name="flightDepartureAirport" placeholder="출발 공항" value={travelMainEntry.flightDepartureAirport || ''} onChange={handleChange} />
            <input name="flightArrivalAirport" placeholder="도착 공항" value={travelMainEntry.flightArrivalAirport || ''} onChange={handleChange} />
            <input name="flightDepartureTime" type="datetime-local" value={travelMainEntry.flightDepartureTime || ''} onChange={handleChange} />
          </div>

          {/* 귀국편 */}
          <div className="grid gap-2">
            <p className="font-semibold text-gray-600">귀국편 정보</p>
            <input name="flightReturnAirline" placeholder="항공사" value={travelMainEntry.flightReturnAirline || ''} onChange={handleChange} />
            <input name="flightReturnName" placeholder="항공편명" value={travelMainEntry.flightReturnName || ''} onChange={handleChange} />
            <input name="flightReturnDepartureAirport" placeholder="출발 공항" value={travelMainEntry.flightReturnDepartureAirport || ''} onChange={handleChange} />
            <input name="flightReturnArrivalAirport" placeholder="도착 공항" value={travelMainEntry.flightReturnArrivalAirport || ''} onChange={handleChange} />
            <input name="flightReturnTime" type="datetime-local" value={travelMainEntry.flightReturnTime || ''} onChange={handleChange} />
          </div>
        </div>
      )}

      {/* 교통 */}
      <input
        name="travelTrans"
        value={travelMainEntry.travelTrans || ''}
        onChange={handleChange}
        placeholder="교통 (예: 버스, 자전거)"
        className="w-full"
      />

      {/* 경비 */}
      <input
        name="totalBudget"
        value={travelMainEntry.totalBudget || ''}
        onChange={handleChange}
        placeholder="예상 총 경비 (₩)"
        className="w-full"
      />

      {/* 테마 */}
      <input
        name="travelTheme"
        value={travelMainEntry.travelTheme || ''}
        onChange={handleChange}
        placeholder="여행 테마 (예: 힐링, 미식)"
        className="w-full"
      />

      {/* 여행 완료 여부 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAfterTravel"
          checked={travelMainEntry.isAfterTravel || false}
          onChange={(e) => setTravelMainEntry({ isAfterTravel: e.target.checked })}
        />
        <label htmlFor="isAfterTravel">이 여행은 이미 다녀온 여행입니다</label>
      </div>

      {/* 후기 입력 */}
      {travelMainEntry.isAfterTravel && (
        <textarea
          name="review"
          placeholder="여행을 다녀온 후의 후기를 적어주세요!"
          value={travelMainEntry.review || ''}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 rounded border"
        />
      )}

      {/* 공개 여부 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic">이 여행 계획을 게시판에 공개합니다</label>
      </div>
    </div>
  );
}
