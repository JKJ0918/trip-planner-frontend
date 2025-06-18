// page.tsx (EditPostPage)
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import MapEditor from '../components/MapEditor';
import ItineraryEditor from '../components/ItineraryEditor';
import { generateDateRange } from '@/app/maps/utils/dateUtils';

type TravelJournal = {
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

type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
};

type DayJournal = { // 일별 일정표
  date?: string;
  title: string;
  content: string;
  imageUrls: string[];
  newImages?: File[];
  deletedImages?: string[];
};

const parseLocalDate = (dateString: string): Date => {
  return new Date(dateString.replace(/-/g, '/'));
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [journalData, setJournalData] = useState<TravelJournal | null>(null);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  useEffect(() => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    const dateList = generateDateRange(start, end);
    setAvailableDates(dateList);
  }, [range]);



  useEffect(() => { // 특정 게시글 불러오기
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/journals/public/${id}`);
        const data = await res.json();

        const enhancedItinerary = data.itinerary.map((entry: any) => ({
          ...entry,
          date: entry.date || '',
          imageUrls: entry.images ?? [],
          newImages: [],
          deletedImages: [],
        }));
        console.log("data.itinerary:", JSON.stringify(data.itinerary, null, 2));
        setJournalData({ ...data, itinerary: enhancedItinerary });
        setRange([
          {
            startDate: parseLocalDate(data.dateRange.startDate),
            endDate: parseLocalDate(data.dateRange.endDate),
            key: 'selection',
          },
        ]);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);

    if (!journalData) return;

    setJournalData({
      ...journalData,
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    });

  };

  // 수정 본 저장 함수
  const handleSave = async () => {
    if (!journalData) return;

    try {
      const updatedItinerary = await Promise.all(
        journalData.itinerary.map(async (entry, dayIndex) => {
          // 1. 새 이미지 업로드
          const uploadedUrls: string[] = [];
          if (entry.newImages && entry.newImages.length > 0) {
            const formData = new FormData();
            entry.newImages.forEach((file) => formData.append('files', file));

            const res = await fetch(`http://localhost:8080/api/images/edit/upload`, {
              method: 'POST',
              body: formData,
            });

            const data = await res.json();
            uploadedUrls.push(...data.imageUrls); // 백엔드에서 URL 배열 리턴된다고 가정
          }

          // 2. 삭제할 이미지 서버에 전달
          if (entry.deletedImages && entry.deletedImages.length > 0) {
            await fetch(`http://localhost:8080/api/images/edit/delete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrls: entry.deletedImages }),
            });
          }

          // 3. 이미지 URL 최종 조합
          const finalImages = [
            ...(entry.imageUrls || []),
            ...uploadedUrls,
          ];

          return {
            title: entry.title,
            content: entry.content,
            images: finalImages,
            date: entry.date || null, // 날짜 정보 포함
          };
        })
      );
    
      // 4. 전체 업데이트 요청
      const res = await fetch(`http://localhost:8080/api/journals/public/edit/${journalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...journalData,
          itinerary: updatedItinerary,
        }),
        credentials: 'include',
      });
      console.log(JSON.stringify(res, null, 2));

      if (res.ok) {
        alert('수정이 완료되었습니다!');
      } else {
        throw new Error('수정 실패');
      }
    } catch (err) {
      console.error('저장 중 오류 발생:', err);
      alert('저장에 실패했습니다.');
    }
  };

  // 삭제 함수
  const handleDelete = async () => {
    const confirm = window.confirm('정말 이 게시글을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8080/api/journals/public/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('삭제가 완료되었습니다.');
        router.push('/posts'); // 삭제 후 이동할 페이지 경로
      } else {
        throw new Error('삭제 실패');
      }
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert('삭제에 실패했습니다.');
    }
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
            ranges={range}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            rangeColors={['#3b82f6']}
            months={1}
            direction="horizontal"
          />
        </div>

        <MapEditor
          pins={journalData.pins}
          onPinsChange={(updatedPins) =>
            setJournalData({ ...journalData, pins: updatedPins })
          }
        />

        <ItineraryEditor
          itinerary={journalData.itinerary}
          onItineraryChange={(updatedItinerary) =>
            setJournalData({ ...journalData, itinerary: updatedItinerary })
          }
          availableDates={availableDates}
        />
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded mt-6"
        onClick={handleSave}
      >
        수정 완료
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleDelete}
      >
        삭제
      </button>

    </div>
  );
}
