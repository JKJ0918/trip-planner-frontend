import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTripStore } from '../utils/tripstore';
import { generateDateRange } from '../utils/dateUtils';

export default function DateRangePicker() {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const setTripPeriod = useTripStore((state) => state.setTripPeriod);

  const setJournalDrafts = useTripStore((state) => state.setJournalDrafts);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);

    // zustand에 draft 생성
    if (startDate && endDate) {
      handleDateRangeSelect(startDate, endDate);
    }
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    
    console.log("선택된 날짜:", startDate.toISOString(), endDate.toISOString()); // ✅ 콘솔 확인


    const dates = generateDateRange(startDate, endDate);

    setTripPeriod(
      startDate.toISOString().split("T")[0], // "2025-05-29"
      endDate.toISOString().split("T")[0]    // "2025-05-30"
    );
    
    setJournalDrafts(
      dates.map((date) => ({
        date,
        title: '',
        description: '',
        uploadedImages: [],
      }))
    );
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
