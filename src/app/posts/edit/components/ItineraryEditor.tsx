// ✅ ItineraryEditor.tsx (일정 + 이미지 업로드 편집기)
'use client';

import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

type DayJournal = {
  title: string;
  content: string;
  imageUrls: string[];
  newImages?: File[];
  deletedImages?: string[];
};

type ItineraryEditorProps = {
  itinerary: DayJournal[];
  startDate: Date;
  onItineraryChange: (updated: DayJournal[]) => void;
};

const BASE_URL = 'http://localhost:8080';

export default function ItineraryEditor({ itinerary, startDate, onItineraryChange }: ItineraryEditorProps) {
  const [localItinerary, setLocalItinerary] = useState<DayJournal[]>([]);

  useEffect(() => {
    setLocalItinerary(itinerary);
  }, [itinerary]);

  const handleChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...localItinerary];
    updated[index][field] = value;
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  const handleAddEntry = () => {
    const newEntry: DayJournal = {
      title: '',
      content: '',
      imageUrls: [],
      newImages: [],
      deletedImages: [],
    };
    const updated = [...localItinerary, newEntry];
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  const handleRemoveEntry = (index: number) => {
    const updated = localItinerary.filter((_, i) => i !== index);
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  const handleImageUpload = (index: number, files: FileList | null) => {
    if (!files) return;
    const updated = [...localItinerary];
    const newFiles = Array.from(files);
    updated[index].newImages = [...(updated[index].newImages || []), ...newFiles];
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  const handleRemoveImage = (entryIndex: number, imageUrl: string) => {
    const updated = [...localItinerary];
    updated[entryIndex].imageUrls = updated[entryIndex].imageUrls.filter((url) => url !== imageUrl);
    updated[entryIndex].deletedImages = [
      ...(updated[entryIndex].deletedImages || []),
      imageUrl,
    ];
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  const handleRemoveNewImage = (entryIndex: number, fileIndex: number) => {
    const updated = [...localItinerary];
    updated[entryIndex].newImages?.splice(fileIndex, 1);
    setLocalItinerary(updated);
    onItineraryChange(updated);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">일일 일정</h2>
        <button
          onClick={handleAddEntry}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + 일정 추가
        </button>
      </div>

      {localItinerary.map((entry, index) => (
        <div key={index} className="p-4 border rounded relative bg-white">
          <p className="mb-1 font-medium">
            {index + 1}일차 ({format(addDays(startDate, index), 'yyyy년 M월 d일', { locale: ko })})
          </p>

          <input
            type="text"
            value={entry.title}
            onChange={(e) => handleChange(index, 'title', e.target.value)}
            placeholder="일정 제목"
            className="w-full border rounded p-2 mb-2"
          />

          <textarea
            value={entry.content}
            onChange={(e) => handleChange(index, 'content', e.target.value)}
            placeholder="일정 내용"
            className="w-full border rounded p-2 mb-2"
            rows={3}
          />

          {/* ✅ 이미지 리스트들 */}
          <div className="flex flex-wrap gap-2 mb-2">
            {/* 기존 이미지 */}
            {(entry.imageUrls || []).map((url, imgIdx) => (
              <div key={imgIdx} className="relative w-24 h-24">
                <img
                  src={`${BASE_URL}${url}`}
                  alt={`uploaded-${imgIdx}`}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveImage(index, url)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            ))}

            {/* 새로 업로드된 이미지 */}
            {(entry.newImages || []).map((file, imgIdx) => (
              <div key={imgIdx} className="relative w-24 h-24">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`new-${imgIdx}`}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveNewImage(index, imgIdx)}
                  className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-5 h-5 text-xs"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(index, e.target.files)}
            className="mt-2"
          />

          <button
            onClick={() => handleRemoveEntry(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="일정 삭제"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
