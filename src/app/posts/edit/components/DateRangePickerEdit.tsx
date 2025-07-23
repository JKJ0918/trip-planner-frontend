'use client';

import { useState, useEffect } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

type Props = {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
};

export default function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [range, setRange] = useState([
    {
      startDate,
      endDate,
      key: 'selection',
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  // startDate 또는 endDate가 바뀔 때 range 동기화
  useEffect(() => {
    setRange([{ startDate, endDate, key: 'selection' }]);
  }, [startDate, endDate]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const newRange = ranges.selection;
    if (newRange.startDate && newRange.endDate) {
      setRange([{
        startDate: newRange.startDate,
        endDate: newRange.endDate,
        key: 'selection',
      }]);
      onChange(newRange.startDate, newRange.endDate);
    }
  };

  const format = (date: Date) =>
  date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short', // (수)
    });

    const start = range[0].startDate;
    const end = range[0].endDate;

  return (
    <div className="space-y-2">
      {/* 날짜 요약 버튼 */}
        <button
        onClick={() => setIsOpen(true)}
        className="text-xl text-gray-800 font-semibold hover:bg-gray-100 transition"
        >
        {start && end
            ? `${format(start)} - ${format(end)}`
            : '여행 기간을 선택하세요'}
        </button>


      {/* 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 반투명 배경 */}
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* 모달 본체 */}
          <div className="relative z-50 bg-white rounded-2xl p-6 shadow-xl w-[47%] max-w-5xl">
            <h3 className="text-xl font-bold mb-4">여행 기간 설정</h3>
            <DateRange
              editableDateInputs={true}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={2}
              direction="horizontal"
              // minDate={new Date()}
            />
            <div className="text-right mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
