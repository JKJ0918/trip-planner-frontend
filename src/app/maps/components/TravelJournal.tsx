'use client';

import { useRef } from 'react';
import { useTripStore } from '../utils/tripstore';

export default function TravelJournal() {
  const {
    journalDrafts,
    updateJournalDraft,
    addUploadedImageToDraft,
    removeImageFromDraft,
    submitAllJournals,
  } = useTripStore();

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    date: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await addUploadedImageToDraft(date, Array.from(files));
    if (fileInputRefs.current[date]) fileInputRefs.current[date]!.value = '';
  };

  const handleDeleteImage = (date: string, imageId: string) => {
    removeImageFromDraft(date, imageId);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mt-6">
      <h2 className="text-lg font-bold mb-4">📝 여행일지 작성</h2>

      {journalDrafts.map((draft) => (
        <div key={draft.date} className="mb-6 border p-4 rounded">
          <h3 className="font-semibold mb-2">📅 {draft.date}</h3>

          <input
            type="text"
            placeholder="제목"
            value={draft.title}
            onChange={(e) =>
              updateJournalDraft(draft.date, { title: e.target.value })
            }
            className="border p-2 mb-2 block w-full"
          />

          <textarea
            placeholder="설명"
            value={draft.description}
            onChange={(e) =>
              updateJournalDraft(draft.date, { description: e.target.value })
            }
            className="border p-2 mb-2 block w-full"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            ref={(el) => {fileInputRefs.current[draft.date] = el;}}
            onChange={(e) => handleImageChange(e, draft.date)}
            className="hidden"
            id={`file-${draft.date}`}
          />

          <label
            htmlFor={`file-${draft.date}`}
            className="inline-block cursor-pointer bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          >
            📎 사진 첨부하기
          </label>

          <div className="flex gap-2 flex-wrap mt-2">
            {draft.uploadedImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24">
                <img
                  src={img.preview}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  onClick={() => handleDeleteImage(draft.date, img.id)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {draft.uploadedImages.length > 0
              ? `${draft.uploadedImages.length}장 업로드됨`
              : '선택된 파일 없음'}
          </p>
        </div>
      ))}

      <button
        onClick={submitAllJournals}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        전체 작성 완료
      </button>
    </div>
  );
}
