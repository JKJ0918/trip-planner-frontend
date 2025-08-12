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
      weekday: 'short',
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
    if (fileInputRefs.current[id]) fileInputRefs.current[id]!.value = '';
  };

  const handleDeleteImage = (id: string, imageId: string) => {
    removeImageFromDraft(id, imageId);
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <button
        onClick={addJournalDraft}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        + 일정 추가
      </button>
      <label className="rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"> 일청 추가 버튼을 눌러 일별 계획를 작성해 보세요.</label>

      {journalDrafts.map((draft) => (
        <div
          key={draft.id}
          className="mb-6 p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm relative"
        >

          {/* 날짜 선택 */}
          <div className="flex justify-between items-center mb-4 gap-2">
            <select
              value={draft.date}
              onChange={(e) => updateJournalDraft(draft.id, { date: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"
            >
              <option value="">날짜 선택</option>
              {dateRangeList.map((date) => (
                <option key={date} value={date}>
                  {formatDateWithWeekday(date)}
                </option>
              ))}
            </select>

            {/* 삭제 버튼 (오른쪽 위) */}
            <button
              onClick={() => removeJournalDraft(draft.id)}
              className="text-gray-400 hover:text-red-600 text-lg"
              title="일정 삭제"
            >
              ✕
            </button>
          </div>
 
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={draft.title}
            onChange={(e) => updateJournalDraft(draft.id, { title: e.target.value })}
            className="w-full mb-4 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <hr className="my-3 border-t border-gray-300" />

          <textarea
            placeholder="설명을 입력하세요"
            value={draft.description}
            onChange={(e) => updateJournalDraft(draft.id, { description: e.target.value })}
            className="w-full mb-4 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />

          <hr className="my-3 border-t border-gray-300" />

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
            className="inline-flex items-center gap-2 cursor-pointer bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition"
          >
            📎 사진 첨부하기
          </label>

          <div className="flex gap-3 flex-wrap mt-4">
            {draft.uploadedImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden shadow border">
                <img src={img.preview} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteImage(draft.id, img.id)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {draft.uploadedImages.length > 0
              ? `${draft.uploadedImages.length}장 첨부됨`
              : '아직 첨부된 이미지가 없습니다.'}
          </p>
        </div>
      ))}
    </div>
  );
}
