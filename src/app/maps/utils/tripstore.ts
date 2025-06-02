// tripstore.ts (최종 리팩토링 버전)
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from './uploadImage';

// 여행일지 제목, 여행도시 작성
export type TravelMainEntry = {
  title: string;
  locationSummary: string; // 여행 도시
}

export type UploadedImage = {
  id: string;
  preview: string;
  file: File; // 서버 업로드 전 실제 파일
  url?: string; // 업로드 후 URL (아직 업로드 안 됐으면 undefined)
};

// 여행 일지 작성 관련
export type TravelEntry = {
  id: string;
  title: string;
  description: string;
  photos: string[];
};

export type TravelLog = {
  date: string;
  entries: TravelEntry[];
};

export type JournalDraft = { 
  date: string;
  title: string;
  description: string;
  uploadedImages: UploadedImage[];
};

// 여행일지 게시글 작성
export type TravelPostSummary = {
  id: number;
  title: string;
  locationSummary: string;
  thumbnailUrl: string;
  authorNickname: string;
  createdAt: string;
};

type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
};

type TripState = {
  pins: Pin[];
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  deletePin: (index: number) => void;

  travelLogs: TravelLog[];
  addLogEntry: (date: string, entry: TravelEntry) => void;
  deleteLogEntry: (date: string, entryId: string) => void;

  travelMainEntry: TravelMainEntry;
  setTravelMainEntry: (entry: Partial<TravelMainEntry>) => void;

  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  
  journalDrafts: JournalDraft[];
  setJournalDrafts: (drafts: JournalDraft[]) => void;
  updateJournalDraft: (date: string, updates: Partial<JournalDraft>) => void;
  addUploadedImageToDraft: (date: string, files: File[]) => Promise<void>,
  removeImageFromDraft: (date: string, imageId: string) => void,
  clearJournalDrafts: () => void;
  submitTripPlan: (startDate: string, endDate: string, pins: Pin[]) => Promise<void>

  startDate: string;
  endDate: string;
  setTripPeriod: (start: string, end: string) => void;
  user: { id: string } | null;
  setUser: (user: { id: string; }) => void;
  
};

export const useTripStore = create<TripState>((set, get) => ({

  startDate: '',
  endDate: '',
  setTripPeriod: (start, end) => set({ startDate: start, endDate: end }),
  user: null, // 처음엔 없음
  setUser: (user) => set({ user }), // 제출누르면 생김

  pins: [],
  setPins: (pins) => set({ pins }),
  addPin: (pin) => set((state) => ({ pins: [...state.pins, pin] })),
  deletePin: (index) => set((state) => ({ pins: state.pins.filter((_, i) => i !== index) })),

  travelLogs: [],
  addLogEntry: (date, entry) =>
    set((state) => {
      const existing = state.travelLogs.find((log) => log.date === date);
      if (existing) {
        existing.entries.push(entry);
        return { travelLogs: [...state.travelLogs] };
      }
      return { travelLogs: [...state.travelLogs, { date, entries: [entry] }] };
    }),
  deleteLogEntry: (date, entryId) =>
    set((state) => ({
      travelLogs: state.travelLogs.map((log) =>
        log.date === date
          ? { ...log, entries: log.entries.filter((e) => e.id !== entryId) }
          : log
      ),
    })),

  travelMainEntry: {
    title: '',
    locationSummary: '',
  },
  setTravelMainEntry: (entry) =>
    set((state) => ({
      travelMainEntry: {
        ...state.travelMainEntry,
        ...entry,
      },
    })),

  isPublic: true,
  setIsPublic: (value) => set({ isPublic: value }),

  journalDrafts: [],
  setJournalDrafts: (drafts) => set({ journalDrafts: drafts }),
  clearJournalDrafts: () => set({ journalDrafts: [] }),

  updateJournalDraft: (date, updates) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.date === date ? { ...draft, ...updates } : draft
      ),
    })),

  addUploadedImageToDraft: async (date, files) => {
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      url: undefined, // 아직 서버에 안 올렸음
    }));

    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.date === date
          ? {
              ...draft,
              uploadedImages: [...draft.uploadedImages, ...newImages],
            }
          : draft
      ),
    }));
  },


  removeImageFromDraft: (date, imageId) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.date === date
          ? {
              ...draft,
              uploadedImages: draft.uploadedImages.filter((img) => img.id !== imageId),
            }
          : draft
      ),
    })),

  submitTripPlan: async (startDate, endDate, pins, ) => {
    const { journalDrafts, user, travelMainEntry, isPublic } = get();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 메인 제목/도시 유효성 검사
    if (!travelMainEntry.title || !travelMainEntry.locationSummary) {
      alert("여행 제목과 도시명을 모두 입력해 주세요.");
      return;
    }

    // 유효성 검사
    for (const draft of journalDrafts) {
      if (!draft.title || !draft.description) {
        alert(`"${draft.date}"의 제목과 설명을 모두 입력해 주세요.`);
        return;
      }
    }

    try {
      const journals = await Promise.all(
        journalDrafts.map(async (draft) => {
          const uploadedUrls: string[] = [];

          for (const image of draft.uploadedImages) {
            // 아직 업로드된 적이 없다면 서버에 전송
            if (!image.url) {
              const resultUrl = await uploadImage(image.file);
              if (resultUrl) uploadedUrls.push(resultUrl);
            } else {
              uploadedUrls.push(image.url); // 이미 업로드된 이미지
            }
          }

          return {
            date: draft.date,
            title: draft.title,
            description: draft.description,
            photos: uploadedUrls,
          };
        })
      );


      const payload = {
        startDate,
        endDate,
        userId: user.id,
        title: travelMainEntry.title, // 추가
        locationSummary: travelMainEntry.locationSummary, // 추가
        isPublic,
        pins,
        journals, // 여행 일정들
      };

      console.log(payload);

      const res = await fetch('http://localhost:8080/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('저장 실패');
      alert('저장 성공!');
      set({ journalDrafts: [], pins: [] });

    } catch (err) {
      console.error(err);
      alert(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  },



}));
