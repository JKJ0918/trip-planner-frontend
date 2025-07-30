'use client';

import React, { useState } from 'react';
import DateRangePickerEdit from './DateRangePickerEdit';

//import { TravelMainEntry } from '../types'; // 타입 선언이 있다면 사용

type TravelJournal = {
  id: number;
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  description: string; // 내용 요약
  locationSummary: string;
  useFlight: boolean; // 항공편 이용여부
  flightDepartureAirline: string; // 출국편 항공사
  flightDepartureName: string; // 출국편 항공편명
  flightDepartureAirport: string; // 출국편 출발 공항
  flightArrivalAirport: string; // 출국편 도착 공항
  flightDepartureTime: string;// 출국편 출발시간
  flightReturnAirline: string; // 귀국편 항공사
  flightReturnName: string; // 귀국편 항공편명
  flightReturnDepartureAirport: string; // 귀국편 출발 공항
  flightReturnArrivalAirport: string; // 귀국편 도착 공항
  flightReturnTime: string; // 귀국편 출발시간
  travelTrans: string; // 교통수단
  totalBudget: string; // 경비(예산)
  travelTheme: string; // 여행 테마
  isAfterTravel: boolean; // 여행 완료 여부
  review: string; // 여행 후기
  isPublic: boolean; // 공개 여부
};

// 아래 인터페이스 사용과 props 구조 분해 할당 부분 이유
// 이유 1: 타입 안전성 확보

// 만약 부모가 travelMainEntry를 빼먹거나 타입이 맞지 않으면 컴파일 단계에서 에러를 잡아줌.

// 예: travelMainEntry를 string으로 넘기면 TypeScript가 "타입 불일치!" 에러를 발생.

// 이유 2: 코드 가독성

// props.travelMainEntry 대신 travelMainEntry라고 바로 쓸 수 있어 편리.

// 이유 3: 재사용성

// TravelInfoEdit는 독립적인 UI 컴포넌트로, 부모 컴포넌트에서 다양한 데이터를 넘겨줄 수 있도록 설계됨.

interface TravelInfoEditProps { // interface는 TypeScript에서 객체가 어떤 속성을 가져야 하는지를 정의하는 문법, 
  // 즉, TravelInfoEdit은 3개의 props를 반드시 받아야 한다는 것을 명시
  travelMainEntry: TravelJournal; // TravelJournal 타입의 데이터를 받아야 한다. 
  setTravelMainEntry: (entry: Partial<TravelJournal>) => void; // Partial<TravelJournal> → TravelJournal의 속성 중 일부만 전달해도 된다는 의미, void -> 리턴값이 없다. -> 부모의 상태를 변경하는 함수
  handleDataChange: (ranges: any) => void; // 날짜 변경 시 호출되는 이벤트 핸들러, ranges라는 매개변수를 받고 리턴값은 없다는 의미
}


export default function TravelInfoEdit({ // function TravelInfoEdit({ ... }: TravelInfoEditProps) -> props를 구조 분해 할당하는 문법
  travelMainEntry,
  setTravelMainEntry,
  handleDataChange,
  
}: TravelInfoEditProps) {

//DateRangePicker에 값 Date값 넣기
const [selectedDateRange, setSelectedDateRange] = useState({ 
  startDate: new Date(travelMainEntry.dateRange.startDate), // 문자열을 Date로 변환
  endDate: new Date(travelMainEntry.dateRange.endDate),
});
  
  return (
    <div className="space-y-6">
      {/* 제목 */}
      <input
        name="title"
        value={travelMainEntry.title} //  travelMainEntry는 journalData
        onChange={handleDataChange} // handleChange는 입력값이 바뀔 때 상태를 바꾸는 함수
        placeholder="제목"
        className="w-full text-xl font-semibold"
      />

      {/* 날짜 이 부분을 새로 만들고 싶습니다.*/}
      <DateRangePickerEdit
        startDate={selectedDateRange.startDate}
        endDate={selectedDateRange.endDate}
        onChange={(start, end) => {
          setSelectedDateRange({ startDate: start, endDate: end });
          setTravelMainEntry({
            dateRange: {
              startDate: start.toISOString().split('T')[0],
              endDate: end.toISOString().split('T')[0],
            },
          });
        }}
      />


      {/* 내용 요약 */}
      <textarea
        name="description"
        placeholder="여행과 관련된 내용을 적어주세요!"
        value={travelMainEntry.description || ''}
        onChange={handleDataChange}
        rows={3}
        className="w-full p-2 rounded border"
      />

      {/* 도시 */}
      <input
        name="locationSummary"
        value={travelMainEntry.locationSummary}
        onChange={handleDataChange}
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
            <input name="flightDepartureAirline" placeholder="항공사" value={travelMainEntry.flightDepartureAirline || ''} onChange={handleDataChange} />
            <input name="flightDepartureName" placeholder="항공편명" value={travelMainEntry.flightDepartureName || ''} onChange={handleDataChange} />
            <input name="flightDepartureAirport" placeholder="출발 공항" value={travelMainEntry.flightDepartureAirport || ''} onChange={handleDataChange} />
            <input name="flightArrivalAirport" placeholder="도착 공항" value={travelMainEntry.flightArrivalAirport || ''} onChange={handleDataChange} />
            <input name="flightDepartureTime" type="datetime-local" value={travelMainEntry.flightDepartureTime || ''} onChange={handleDataChange} />
          </div>

          {/* 귀국편 */}
          <div className="grid gap-2">
            <p className="font-semibold text-gray-600">귀국편 정보</p>
            <input name="flightReturnAirline" placeholder="항공사" value={travelMainEntry.flightReturnAirline || ''} onChange={handleDataChange} />
            <input name="flightReturnName" placeholder="항공편명" value={travelMainEntry.flightReturnName || ''} onChange={handleDataChange} />
            <input name="flightReturnDepartureAirport" placeholder="출발 공항" value={travelMainEntry.flightReturnDepartureAirport || ''} onChange={handleDataChange} />
            <input name="flightReturnArrivalAirport" placeholder="도착 공항" value={travelMainEntry.flightReturnArrivalAirport || ''} onChange={handleDataChange} />
            <input name="flightReturnTime" type="datetime-local" value={travelMainEntry.flightReturnTime || ''} onChange={handleDataChange} />
          </div>
        </div>
      )}

      {/* 교통 */}
      <input
        name="travelTrans"
        value={travelMainEntry.travelTrans || ''}
        onChange={handleDataChange}
        placeholder="교통 (예: 버스, 자전거)"
        className="w-full"
      />

      {/* 경비 */}
      <input
        name="totalBudget"
        value={travelMainEntry.totalBudget || ''}
        onChange={handleDataChange}
        placeholder="예상 총 경비 (₩)"
        className="w-full"
      />

      {/* 테마 */}
      <input
        name="travelTheme"
        value={travelMainEntry.travelTheme || ''}
        onChange={handleDataChange}
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
          onChange={handleDataChange}
          rows={3}
          className="w-full p-2 rounded border"
        />
      )}

      {/* 공개 여부 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={travelMainEntry.isPublic || false}
          onChange={(e) => setTravelMainEntry({ isPublic: e.target.checked })}
        />
        <label htmlFor="isPublic">이 여행 계획을 게시판에 공개합니다</label>
      </div>
    </div>
  );
}
