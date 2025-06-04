// components/TravelPost/HeroSection.tsx
import React from 'react';

type HeroSectionProps = {
  title: string;
  locationSummary: string;
  dateRange: { startDate: string; endDate: string };
  thumbnailUrl: string;
  authorNickname: string;
};

const BASE_URL = "http://localhost:8080"

export default function HeroSection({
  title,
  locationSummary,
  dateRange,
  thumbnailUrl,
  authorNickname,
}: HeroSectionProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md mb-8">
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={`${BASE_URL}${thumbnailUrl}`}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-lg">
            📍 {locationSummary} | 🗓️ {dateRange.startDate} ~ {dateRange.endDate}
          </p>
          <p className="text-sm mt-1">작성자: @{authorNickname}</p>
        </div>
      </div>
    </div>
  );
}
