import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTripStore } from '../utils/tripstore';
import { generateDateRange } from '../utils/dateUtils'; // 날짜 배열 생성 유틸

export default function DateRangePicker() {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const setTripPeriod = useTripStore((state) => state.setTripPeriod);
  const setDateRangeList = useTripStore((state) => state.setDateRangeList);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);

    if (startDate && endDate) {
      handleDateRangeSelect(startDate, endDate);
    }
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    console.log("선택된 날짜:", startDate.toISOString(), endDate.toISOString());

    const dates = generateDateRange(startDate, endDate); // ISO 날짜 배열

    setTripPeriod(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    setDateRangeList(dates); // ✅ 날짜 리스트 저장
  };

  return (
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={range}
        months={2}
        direction="horizontal"
        minDate={new Date()}
      />

      <p>가는 편: {range[0].startDate?.toDateString()}</p>
      <p>오는 편: {range[0].endDate?.toDateString()}</p>
    </div>
  );
}
