// tripstore.ts (최종 리팩토링 버전)
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from './uploadImage';

export type UploadedImage = {
  id: string;
  url: string;
  preview: string;
};

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

  journalDrafts: JournalDraft[];
  setJournalDrafts: (drafts: JournalDraft[]) => void;
  updateJournalDraft: (date: string, updates: Partial<JournalDraft>) => void;
  addUploadedImageToDraft: (date: string, files: File[]) => Promise<void>,
  removeImageFromDraft: (date: string, imageId: string) => void,
  clearJournalDrafts: () => void;
  submitAllJournals: () => Promise<void>,
  
};

export const useTripStore = create<TripState>((set, get) => ({
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
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const url = await uploadImage(file);
        if (!url) return null;
        return { id: uuidv4(), url, preview };
      })
    );
    const filtered = uploaded.filter((img): img is UploadedImage => img !== null);

    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.date === date
          ? { ...draft, uploadedImages: [...draft.uploadedImages, ...filtered] }
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

  submitAllJournals: async () => {
    const { journalDrafts } = get();
    for (const draft of journalDrafts) {
      const res = await fetch('http://localhost:8080/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: draft.date,
          title: draft.title,
          description: draft.description,
          photos: draft.uploadedImages.map((img) => img.url),
        }),
      });

      if (!res.ok) {
        throw new Error(`저장 실패: ${draft.date}`);
      }
    }
    alert('모든 여행일지를 저장했습니다!');
    set({ journalDrafts: [] });
  },
}));
