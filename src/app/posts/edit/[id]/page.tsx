// app/posts/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
// DateRangepicker
import { parseISO } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import MapEditor from '../components/MapEditor';


type TravelJournal = { // 여행일정 전체
  id: number;
  title: string;
  locationSummary: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  pins: Pin[];
  itinerary: DayJournal[];
};

type Pin = { // 핀 타입
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
};

type DayJournal = { // 일일 여행 일정
  date: string;
  title: string;
  content: string;
  imageUrls: string[];
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [journalData, setJournalData] = useState<TravelJournal | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/journals/public/${id}`);
        const data = await res.json();
        setJournalData(data);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [id]);


  // 컴포넌트 내에 추가
  const [dateRange, setDateRange] = useState({
    startDate: new Date(), // 초기값 아무거나(초기 null 발생 가능성이 있음)
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => { // 값을 받아오면 ISO 타입으로 변환
    if (journalData) {
      setDateRange({
        startDate: parseISO(journalData.dateRange.startDate),
        endDate: parseISO(journalData.dateRange.endDate),
        key: 'selection',
      });
    }
  }, [journalData]);

  // 날짜 변경 시 journalData에 반영
  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ ...dateRange, startDate, endDate });

    if (!journalData) return; // journalData null 방지
    
    setJournalData({
      ...journalData,
      dateRange: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      }
    });
  };


  if (!journalData) return <div>불러오는 중...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">여행일지 수정</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">제목</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={journalData.title}
            onChange={(e) =>
              setJournalData({ ...journalData, title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">여행 도시</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={journalData.locationSummary}
            onChange={(e) =>
              setJournalData({ ...journalData, locationSummary: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">여행 날짜</label>
          <DateRange
            ranges={[dateRange]}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            rangeColors={['#3b82f6']}
          />
        </div>

        <MapEditor
          pins={journalData.pins}
          onPinsChange={(updatedPins) =>
            setJournalData({ ...journalData, pins: updatedPins })
          }
        />

      </div>
    </div>
  );
}
