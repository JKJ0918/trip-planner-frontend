'use client'

import { useTripStore } from "../utils/tripstore";
import DateRangePicker from "./DateRangePicker";

export default function TravelInfo() {
  const { travelMainEntry, setTravelMainEntry } = useTripStore();
  const { isPublic, setIsPublic } = useTripStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTravelMainEntry({ [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* 제목 입력 */}
      <input
        type="text"
        name="title"
        value={travelMainEntry.title}
        onChange={handleChange}
        placeholder="제목"
        className="w-full text-xl font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition"
      />

      {/* 날짜 선택 */}
      <DateRangePicker />

      {/* 여행 도시 입력 */}
      <input
        type="text"
        name="locationSummary"
        value={travelMainEntry.locationSummary}
        onChange={handleChange}
        placeholder="여행 도시를 입력하세요 (예: 시드니, 멜버른)"
        className="w-full text-lg text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 transition"
      />

      {/* 공개 여부 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="accent-blue-500"
        />
        <label htmlFor="isPublic" className="text-l text-gray-600">
          이 여행 계획을 게시판에 공개합니다
        </label>
      </div>
    </div>
  );
}
