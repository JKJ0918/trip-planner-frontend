'use client';

import { useRef } from 'react';
import { useTripStore } from '../utils/tripstore';

export default function TravelJournal() {
  const {
    journalDrafts,
    addJournalDraft,
    removeJournalDraft,
    updateJournalDraft,
    addUploadedImageToDraft,
    removeImageFromDraft,
    dateRangeList,
  } = useTripStore();

  const formatDateWithWeekday = (dateStr: string): string => {
    const date = new Date(dateStr);

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short', // 결과 예: 2025.06.25 (수)
    });
  };

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await addUploadedImageToDraft(id, Array.from(files));
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = '';
    }
  };

  const handleDeleteImage = (id: string, imageId: string) => {
    removeImageFromDraft(id, imageId);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mt-6">
      <h2 className="text-lg font-bold mb-4">📝 일일 일정</h2>

      <button
        onClick={addJournalDraft}
        className="mb-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        + 일정 추가
      </button>

      {journalDrafts.map((draft) => (
        <div key={draft.id} className="mb-6 border p-4 rounded relative">
          {/* 삭제 버튼 (오른쪽 위) */}
          <button
            onClick={() => removeJournalDraft(draft.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
            title="일정 삭제"
          >
            🗑️
          </button>

          {/* 날짜 선택 */}
          <label className="block mb-1 text-sm font-medium">날짜</label>
          <select
            value={draft.date}
            onChange={(e) =>
              updateJournalDraft(draft.id, { date: e.target.value })
            }
            className="border p-2 mb-2 block w-full"
          >
            <option value="">날짜를 선택하세요</option>
            {dateRangeList.map((date) => (
              <option key={date} value={date}>
                {formatDateWithWeekday(date)}
              </option>
            ))}
          </select>

          {/* 제목 */}
          <input
            type="text"
            placeholder="제목"
            value={draft.title}
            onChange={(e) =>
              updateJournalDraft(draft.id, { title: e.target.value })
            }
            className="border p-2 mb-2 block w-full"
          />

          {/* 설명 */}
          <textarea
            placeholder="설명"
            value={draft.description}
            onChange={(e) =>
              updateJournalDraft(draft.id, { description: e.target.value })
            }
            className="border p-2 mb-2 block w-full"
          />

          {/* 파일 선택 */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={(el) => {
              fileInputRefs.current[draft.id] = el;
            }}
            onChange={(e) => handleImageChange(e, draft.id)}
            className="hidden"
            id={`file-${draft.id}`}
          />

          <label
            htmlFor={`file-${draft.id}`}
            className="inline-block cursor-pointer bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          >
            📎 사진 첨부하기
          </label>

          {/* 이미지 미리보기 */}
          <div className="flex gap-2 flex-wrap mt-2">
            {draft.uploadedImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24">
                <img
                  src={img.preview}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  onClick={() => handleDeleteImage(draft.id, img.id)}
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
    </div>
  );
}
