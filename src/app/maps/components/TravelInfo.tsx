import { useTripStore } from "../utils/tripstore";
import DateRangePicker from "./DateRangePicker";

export default function TravelInfo() {
  const { travelMainEntry, setTravelMainEntry } = useTripStore();
  const { isPublic, setIsPublic } = useTripStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTravelMainEntry({ [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <input name="title" value={travelMainEntry.title} onChange={handleChange} placeholder="제목" className="w-full text-xl font-semibold" />

      {/* 날짜 */}
      <DateRangePicker />

      {/* 도시 */}
      <input name="locationSummary" value={travelMainEntry.locationSummary} onChange={handleChange} placeholder="여행 도시" className="w-full" />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={travelMainEntry.useFlight || false}
          onChange={(e) => setTravelMainEntry({ useFlight: e.target.checked })}
          id="useFlight"
        />
        <label htmlFor="useFlight">항공기를 이용한 여행입니다</label>
      </div>


      {/* 항공편 정보 */}

      {travelMainEntry.useFlight && (
        <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-2 gap-2">
            {/* 출국 항공사 */}
            <input
              name="flightDepartureAirline"
              placeholder="출국 항공사 (예: 대한항공)"
              value={travelMainEntry.flightDepartureAirline || ''}
              onChange={handleChange}
            />
            <input name="flightDepartureName" value={travelMainEntry.flightDepartureName || ''} onChange={handleChange} placeholder="출국 항공편명" className="w-full" />
            <input name="flightDepartureTime" type="datetime-local" value={travelMainEntry.flightDepartureTime || ''} onChange={handleChange} className="w-full" />

            {/* 귀국 항공사 */}
            <input
              name="flightReturnAirline"
              placeholder="귀국 항공사 (예: 아시아나)"
              value={travelMainEntry.flightReturnAirline || ''}
              onChange={handleChange}
            />
            <input name="flightReturnName" value={travelMainEntry.flightReturnName || ''} onChange={handleChange} placeholder="귀국 항공편명" className="w-full" />
            <input name="flightReturnTime" type="datetime-local" value={travelMainEntry.flightReturnTime || ''} onChange={handleChange} className="w-full" />
          </div>
        </div>
      )}

      {/* 교통 수단 */}
      <input name="travelTrans" value={travelMainEntry.travelTrans || ''} onChange={handleChange} placeholder="교통 (예:버스, 자전거, 택시)" className="w-full" />


      {/* 경비 */}
      <input name="totalBudget" value={travelMainEntry.totalBudget || ''} onChange={handleChange} placeholder="예상 총 경비 (₩)" className="w-full" />

      {/* 테마 */}
      <input name="travelTheme" value={travelMainEntry.travelTheme || ''} onChange={handleChange} placeholder="여행 테마 (예: 힐링, 미식)" className="w-full" />

      {/* 여행 시점 체크 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAfterTravel"
          checked={travelMainEntry.isAfterTravel || false}
          onChange={(e) => setTravelMainEntry({ isAfterTravel: e.target.checked })}
        />
        <label htmlFor="isAfterTravel">이 여행은 이미 다녀온 여행입니다</label>
      </div>

      {/* 후기 입력 - 다녀온 경우에만 */}
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
        <input type="checkbox" id="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        <label htmlFor="isPublic">이 여행 계획을 게시판에 공개합니다</label>
      </div>
    </div>
  );
}
