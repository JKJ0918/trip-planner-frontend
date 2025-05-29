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
  const dates = generateDateRange(startDate, endDate);

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
