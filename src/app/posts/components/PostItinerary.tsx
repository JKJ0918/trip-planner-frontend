'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}`; // 나중에 배포시 삭제 예정

export default function PostItinerary({ itinerary, startDate, endDate }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  const formatDateWithWeekday = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-3">
        여행 일정 <span className="font-normal text-xl font-bold mb-6">({startDate} - {endDate})</span>
      </h3>
      <ol className="relative border-s border-blue-300 ml-6">
        {itinerary.map((item, index) => (
          <li key={item.day} className="mb-10 ms-6">
            {/* 타임라인 ● */}
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"></path>
                </svg>
            </span>

            {/* 날짜 */}
            <time className="block mb-1 text-m font-semibold text-blue-700">
              {formatDateWithWeekday(item.date)}
            </time>

            {/* 제목 */}
            <h3 className="text-lg font-bold text-gray-900">
              {item.title}
            </h3>

            {/* 본문 내용 */}
            <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
              {item.content}
            </p>

            {/* 이미지 */}
            {item.images?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {item.images.map((img, i) => {
                  const fullUrl = `${img}`;
                  return (
                    <img
                      key={i}
                      src={fullUrl}
                      alt={`img-${item.day}-${i}`}
                      className="rounded-md object-cover h-40 w-full cursor-pointer hover:opacity-90"
                      onClick={() => {
                        setLightboxImages(item.images.map(i => `${BASE_URL}${i}`));
                        setLightboxIndex(i);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* 라이트박스 */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxImages.map(src => ({ src }))}
      />

    </div>
  );
}
