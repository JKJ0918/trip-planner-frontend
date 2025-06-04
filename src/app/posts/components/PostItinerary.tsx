'use client';

import { useState } from 'react';
import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

type Itinerary = {
  day: number;
  title: string;
  content: string;
  images: string[];
};

type Props = {
  itinerary: Itinerary[];
  startDate: string;
  endDate: string;
};

const BASE_URL = "http://localhost:8080";

// 날짜 계산 함수: startDate + day
function getDateByDay(startDate: string, day: number): string {
  const base = new Date(startDate);
  base.setDate(base.getDate() + (day - 1));
  if (!startDate || isNaN(new Date(startDate).getTime())) {
  return '날짜 오류';
}
  return base.toISOString().split('T')[0]; // YYYY-MM-DD
}

export default function PostItinerary({ itinerary, startDate, endDate }: Props) {

  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

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
            {item.day}일차 - {getDateByDay(startDate, item.day)} {item.title}
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
