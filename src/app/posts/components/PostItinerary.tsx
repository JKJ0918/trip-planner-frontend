'use client';

import { useState } from 'react';
import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

type Itinerary = {
  day: number;
  title: string;
  content: string;
  images: string[];
  date: string;
};

type Props = {
  itinerary: Itinerary[];
  startDate: string;
  endDate: string;
};

const BASE_URL = "http://localhost:8080";


export default function PostItinerary({ itinerary, startDate, endDate }: Props) {

  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  const formatDateWithWeekday = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short', // 'long'으로 하면 "수요일"
    });
  };

  const toggleDay = (day: number) => {
    setOpenDays(prev => {
      const newSet = new Set(prev);
      newSet.has(day) ? newSet.delete(day) : newSet.add(day);
      return newSet;
    });
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        📝 여행 일정 <span className="text-base font-normal">({startDate} ~ {endDate})</span>
      </h2>

      {itinerary.map((item) => (
        <div key={item.day} className="border rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 font-semibold bg-gray-100 hover:bg-gray-200"
            onClick={() => toggleDay(item.day)}
          >
            {formatDateWithWeekday(item.date)} {item.title}
          </button>
          {openDays.has(item.day) && (
            <div className="p-4 space-y-3 text-sm">
              <p className="whitespace-pre-line">{item.content}</p>

                {item.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {item.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={`${BASE_URL}${url}`}
                        onClick={() => {
                          setLightboxImages(item.images.map(img => `${BASE_URL}${img}`));
                          setLightboxIndex(idx);
                        }}
                        alt={`itinerary-${item.day}-img-${idx}`}
                        className="rounded-md object-cover h-40 w-full cursor-pointer hover:opacity-90"
                      />
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      ))}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxImages.map(src => ({ src }))}
      />
    </div>
  );
}
