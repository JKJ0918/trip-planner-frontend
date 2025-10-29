import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from './uploadImage';

// 여행일지 제목, 여행도시 작성
export type TravelMainEntry = {
  title: string;
  locationSummary: string;
  description: string; // 여행 썸네일쪽 내용
  useFlight?: boolean; // 항공기 사용여부
  flightDepartureAirline?: string;
  flightDepartureName?: string;
  flightDepartureTime?: string;
  flightDepartureAirport?: string;  // 출국편 출발공항
  flightArrivalAirport?: string;    // 출국편 도착공항

  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
  flightReturnDepartureAirport?: string;  // 출국편 출발공항
  flightReturnArrivalAirport?: string;    // 귀국편 도착공항
  travelTrans?: string;
  totalBudget?: string;
  travelTheme?: string;
  review?: string;
  isAfterTravel?: boolean;
};

export type UploadedImage = {
  id: string;
  preview: string;
  file: File;
  url?: string;
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
  id: string;
  title: string;
  date: string;
  description: string;
  uploadedImages: UploadedImage[];
};

export type TravelPostSummary = {
  id: number;
  title: string;
  locationSummary: string;
  thumbnailUrl: string;
  authorNickname: string;
  createdAt: string;
  likeCount: number; // 게시글 목록 좋아요 추가
  views: number; // 조회수 
};

type Pin = {
  lat: number;
  lng: number;
  name: string;
  category: string;
  address: string;
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
  images?: File[];
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

  dateRangeList: string[]; // DateRangePicker 범위에서 찾기
  setDateRangeList: (dates: string[]) => void;

  journalDrafts: JournalDraft[];
  addJournalDraft: () => void;
  removeJournalDraft: (id: string) => void;
  updateJournalDraft: (id: string, updates: Partial<JournalDraft>) => void;
  addUploadedImageToDraft: (id: string, files: File[]) => Promise<void>;
  removeImageFromDraft: (id: string, imageId: string) => void;
  clearJournalDrafts: () => void;
  submitTripPlan: (startDate: string, endDate: string, pins: Pin[]) => Promise<void>;

  // 방문지 탭으로 위치 이동중
  selectedPinIndex: number | null;
  setSelectedPinIndex: (index: number | null) => void;
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  mapRef: google.maps.Map | null;
  setMapRef: (ref: google.maps.Map | null) => void;





  startDate: string;
  endDate: string;
  setTripPeriod: (start: string, end: string) => void;
  user: { id: string } | null;
  setUser: (user: { id: string }) => void;
};

export const useTripStore = create<TripState>((set, get) => ({
  startDate: '',
  endDate: '',
  setTripPeriod: (start, end) => set({ startDate: start, endDate: end }),

  dateRangeList: [],
  setDateRangeList: (dates) => set({ dateRangeList: dates }),

  user: null,
  setUser: (user) => set({ user }),

  pins: [],
  setPins: (pins) => set({ pins }),
  addPin: (pin: Pin) => set((state) => ({
  pins: [...state.pins, pin],
  })), // addPin 확장
  deletePin: (index) =>
    set((state) => ({ pins: state.pins.filter((_, i) => i !== index) })),

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
    description: '', // 여행 썸네일쪽 내용
    useFlight: false,       // boolean의 초기값 false로 
    isAfterTravel: false,   
    flightDepartureAirline: '',
    flightDepartureName: '',
    flightDepartureTime: '',
    flightDepartureAirport: '', // 출국편 출발공항
    flightArrivalAirport: '',    // 출국편 도착공항
    flightReturnAirline: '',
    flightReturnName: '',
    flightReturnTime: '',
    flightReturnDepartureAirport: '',  // 출국편 출발공항
    flightReturnArrivalAirport: '',    // 귀국편 도착공항
    travelTrans: '',
    totalBudget: '',
    travelTheme: '',
    review: '',
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
  addJournalDraft: () =>
    set((state) => ({
      journalDrafts: [
        ...state.journalDrafts,
        {
          id: uuidv4(),
          date: '',
          title: '',
          description: '',
          uploadedImages: [],
        },
      ],
    })),
  removeJournalDraft: (id) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.filter((draft) => draft.id !== id),
    })),
  updateJournalDraft: (id, updates) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.id === id ? { ...draft, ...updates } : draft
      ),
    })),
  clearJournalDrafts: () => set({ journalDrafts: [] }),

  addUploadedImageToDraft: async (id, files) => {
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      url: undefined,
    }));

    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.id === id
          ? { ...draft, uploadedImages: [...draft.uploadedImages, ...newImages] }
          : draft
      ),
    }));
  },

  removeImageFromDraft: (id, imageId) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              uploadedImages: draft.uploadedImages.filter((img) => img.id !== imageId),
            }
          : draft
      ),
    })),

  selectedPinIndex: null,
  setSelectedPinIndex: (index) => set({ selectedPinIndex: index }),
  highlightedIndex: null, // 추가
  setHighlightedIndex: (index: number | null) => set({ highlightedIndex: index }), // 추가
  mapRef: null,
  setMapRef: (ref: google.maps.Map | null) => set({ mapRef: ref }),


  submitTripPlan: async (startDate, endDate, pins) => {
    const { journalDrafts, user, travelMainEntry, isPublic } = get();

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!travelMainEntry.title || !travelMainEntry.locationSummary) {
      alert('여행 제목과 도시명을 모두 입력해 주세요.');
      return;
    }

    for (const draft of journalDrafts) {
      if (!draft.title || !draft.description) {
        alert('모든 일정의 제목과 설명을 입력해 주세요.');
        return;
      }
    }

    try {
      const start = new Date(startDate);
      const journals = await Promise.all(
        journalDrafts.map(async (draft, i) => {
          const uploadedUrls: string[] = [];

          for (const image of draft.uploadedImages) {
            if (!image.url) {
              const resultUrl = await uploadImage(image.file);
              if (resultUrl) uploadedUrls.push(resultUrl);
            } else {
              uploadedUrls.push(image.url);
            }
          }

          // 실제 날짜 계산 (ISO 형식으로 변환)
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

          return {
            date: dateStr,
            title: draft.title,
            description: draft.description,
            photos: uploadedUrls,
          };
        })
      );

      const processedPins = await Promise.all( // pin 이미지 처리
        pins.map(async (pin) => {
          const uploadedPinImages: string[] = [];

          if (pin.images && pin.images.length > 0) {
            for (const image of pin.images) {
              if (image instanceof File) {
                const resultUrl = await uploadImage(image); // 이미지 저장함수
                if (resultUrl) uploadedPinImages.push(resultUrl);
              } else if (typeof image === 'string') {
                uploadedPinImages.push(image);
              }
            }
          }

          return {
            ...pin,
            images: uploadedPinImages,
          };
        })
      );

      const payload = {
        startDate,
        endDate,
        userId: user.id,
        title: travelMainEntry.title,
        locationSummary: travelMainEntry.locationSummary,
        description: travelMainEntry.description,
        isPublic,
        useFlight: travelMainEntry.useFlight,
        flightDepartureAirline: travelMainEntry.flightDepartureAirline,
        flightDepartureName: travelMainEntry.flightDepartureName,
        flightDepartureTime: travelMainEntry.flightDepartureTime,
        flightDepartureAirport: travelMainEntry.flightDepartureAirport,  // 출국편 출발공항
        flightArrivalAirport: travelMainEntry.flightArrivalAirport,    // 출국편 도착공항
        flightReturnAirline: travelMainEntry.flightReturnAirline,
        flightReturnName: travelMainEntry.flightReturnName,
        flightReturnTime: travelMainEntry.flightReturnTime,
        flightReturnDepartureAirport: travelMainEntry.flightReturnDepartureAirport,  // 출국편 출발공항
        flightReturnArrivalAirport: travelMainEntry.flightReturnArrivalAirport,    // 귀국편 도착공항
        travelTrans: travelMainEntry.travelTrans,
        totalBudget: travelMainEntry.totalBudget,
        travelTheme: travelMainEntry.travelTheme,
        review: travelMainEntry.review,
        isAfterTravel: travelMainEntry.isAfterTravel,
        pins: processedPins,
        journals,
      };

      console.log(payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/journals`, {
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
