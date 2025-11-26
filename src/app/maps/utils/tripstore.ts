// =======================
// 외부 라이브러리 & 유틸 함수 import
// =======================
import { create } from 'zustand';        // zustand 전역 상태 관리
import { v4 as uuidv4 } from 'uuid';     // 고유 ID 생성용
import { uploadImage } from './uploadImage'; // 이미지 업로드(Cloud/서버) 함수


// =======================
// 타입 선언부 (상태 구조 정의)
// =======================

// 여행일지 메인 정보 (제목/도시/항공/예산/후기 등)
export type TravelMainEntry = {
  title: string;              // 여행 제목
  locationSummary: string;    // 여행 도시/지역 한 줄 요약
  description: string;        // 썸네일/메인 소개글

  useFlight?: boolean;        // 항공편 사용 여부
  // 출국편 정보
  flightDepartureAirline?: string;   // 항공사
  flightDepartureName?: string;      // 편명
  flightDepartureTime?: string;      // 출발 시간
  flightDepartureAirport?: string;   // 출발 공항
  flightArrivalAirport?: string;     // 도착 공항

  // 귀국편 정보
  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
  flightReturnDepartureAirport?: string;  // 귀국 출발 공항
  flightReturnArrivalAirport?: string;    // 귀국 도착 공항

  travelTrans?: string;       // 현지 교통 수단 정보
  totalBudget?: string;       // 전체 예산
  travelTheme?: string;       // 여행 테마 (가족여행, 혼자, 맛집 위주 등)
  review?: string;            // 여행을 다녀온 후기(회고)
  isAfterTravel?: boolean;    // 사전 계획인지 / 여행 후 기록인지 표시
};

// 업로드된 이미지 한 장에 대한 정보
export type UploadedImage = {
  id: string;        // 프론트에서 관리용 UUID
  preview: string;   // URL.createObjectURL 로 만든 미리보기 주소
  file: File;        // 실제 업로드할 File 객체
  url?: string;      // 서버/클라우드에 업로드된 최종 URL (저장 후 채워짐)
};

// 일자별 로그에 들어가는 개별 엔트리
export type TravelEntry = {
  id: string;          // 엔트리 고유 ID
  title: string;       // 하루 중 소제목
  description: string; // 내용
  photos: string[];    // 해당 엔트리와 연결된 이미지 URL 목록
};

// 한 날짜에 대한 여행 로그 (여러 엔트리를 가질 수 있음)
export type TravelLog = {
  date: string;        // "YYYY-MM-DD"
  entries: TravelEntry[];
};

// 작성 중인 일일 여행 초안(프론트 전용 구조)
// 백엔드에 보내기 전에 사용자가 수정/업로드하는 임시 데이터
export type JournalDraft = {
  id: string;                 // 초안 식별용 UUID
  title: string;              // 일정 제목
  date: string;               // 선택 날짜 (현재는 index 기반으로도 사용)
  description: string;        // 일정 설명
  uploadedImages: UploadedImage[]; // 아직 업로드 전/후의 이미지 목록
};

// 게시글 목록 화면에서 사용되는 요약 데이터
export type TravelPostSummary = {
  id: number;
  title: string;
  locationSummary: string;
  thumbnailUrl: string;
  authorNickname: string;
  createdAt: string;
  likeCount: number; // 좋아요 수
  views: number;     // 조회수
};

// 지도에 표시되는 핀 정보
type Pin = {
  lat: number;          // 위도
  lng: number;          // 경도
  name: string;         // 장소 이름
  category: string;     // 카테고리(맛집, 관광지, 카페 등)
  address: string;      // 주소

  // 선택 입력(가격, 시간, 설명 등)
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;

  // 아직 업로드 전일 수도 있는 이미지들 (File 또는 나중에 string URL로 전환)
  images?: File[];
};

// =======================
// TripState: zustand 전역 상태 구조
// =======================
type TripState = {

  // 여행 메인 정보 (제목/도시/테마/비행 등)
  travelMainEntry: TravelMainEntry;
  setTravelMainEntry: (entry: Partial<TravelMainEntry>) => void;

  // 지도 핀 관리
  pins: Pin[];
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  deletePin: (index: number) => void;

  // 일자별 여행 로그 (실제 저장용 구조)
  travelLogs: TravelLog[];
  addLogEntry: (date: string, entry: TravelEntry) => void;
  deleteLogEntry: (date: string, entryId: string) => void;



  // 게시글 공개 여부
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;

  // 선택된 여행 기간 정보 (DateRangePicker에서 사용)
  dateRangeList: string[]; // 선택된 날짜 문자열 배열
  setDateRangeList: (dates: string[]) => void;

  // 일일 일정 작성 초안 (UI 내부 전용 구조)
  journalDrafts: JournalDraft[];
  addJournalDraft: () => void;
  removeJournalDraft: (id: string) => void;
  updateJournalDraft: (id: string, updates: Partial<JournalDraft>) => void;
  addUploadedImageToDraft: (id: string, files: File[]) => Promise<void>;
  removeImageFromDraft: (id: string, imageId: string) => void;
  clearJournalDrafts: () => void;

  // 최종 여행 계획 제출 함수
  submitTripPlan: (startDate: string, endDate: string, pins: Pin[]) => Promise<void>;

  // 지도/핀 관련 UI 상태 (선택된 핀 / 하이라이트 핀 / mapRef)
  selectedPinIndex: number | null;
  setSelectedPinIndex: (index: number | null) => void;
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  mapRef: google.maps.Map | null;
  setMapRef: (ref: google.maps.Map | null) => void;

  // 여행 전체 기간 (시작/종료일)
  startDate: string;
  endDate: string;
  setTripPeriod: (start: string, end: string) => void;

  // 로그인한 사용자 정보 (userId만 사용)
  user: { id: string } | null;
  setUser: (user: { id: string }) => void;
};

// =======================
// zustand 스토어 구현부
// =======================
export const useTripStore = create<TripState>((set, get) => ({

    // ---------- 여행 메인 정보 초기값 ----------
  travelMainEntry: {
    title: '',
    locationSummary: '',
    description: '', // 여행 썸네일쪽 내용

    useFlight: false,       // 항공편 사용 여부 초기값
    isAfterTravel: false,   // 여행 이후 기록 여부

    // 출국편 정보
    flightDepartureAirline: '',
    flightDepartureName: '',
    flightDepartureTime: '',
    flightDepartureAirport: '', // 출국편 출발공항
    flightArrivalAirport: '',   // 출국편 도착공항

    // 귀국편 정보
    flightReturnAirline: '',
    flightReturnName: '',
    flightReturnTime: '',
    flightReturnDepartureAirport: '',  // 귀국편 출발공항
    flightReturnArrivalAirport: '',    // 귀국편 도착공항

    travelTrans: '',
    totalBudget: '',
    travelTheme: '',
    review: '',
  },

  // 부분 업데이트를 허용하는 메인 정보 setter
  setTravelMainEntry: (entry) =>
    set((state) => ({
      travelMainEntry: {
        ...state.travelMainEntry, // 기존 값 유지
        ...entry,                 // 전달된 필드만 덮어쓰기
      },
  })),

  // ---------- 여행 기간 관리 ----------
  startDate: '',
  endDate: '',
  setTripPeriod: (start, end) => set({ startDate: start, endDate: end }),

  // ---------- DateRangePicker 선택 날짜 리스트 ----------
  dateRangeList: [],
  setDateRangeList: (dates) => set({ dateRangeList: dates }),

  // ---------- 사용자 정보 관리 ----------
  user: null,
  setUser: (user) => set({ user }),

  // ---------- 지도 핀 상태 관리 ----------
  pins: [],
  // 핀 전체를 한 번에 교체
  setPins: (pins) => set({ pins }),
  // 핀 한 개 추가
  addPin: (pin: Pin) =>
    set((state) => ({
      pins: [...state.pins, pin],
    })),
  // index 기준으로 핀 삭제
  deletePin: (index) =>
    set((state) => ({
      pins: state.pins.filter((_, i) => i !== index),
    })),

  // ---------- TravelLogs (실제 일자별 로그 구조) ----------
  travelLogs: [],
  addLogEntry: (date, entry) =>
    set((state) => {
      // 이미 해당 날짜의 로그가 있는지 찾기
      const existing = state.travelLogs.find((log) => log.date === date);
      if (existing) {
        // 기존 날짜에 엔트리 추가
        existing.entries.push(entry);
        // 참조는 유지되지만, 새로운 배열로 감싸서 React가 변경 인식하도록
        return { travelLogs: [...state.travelLogs] };
      }
      // 해당 날짜 로그가 없으면 새로 추가
      return { travelLogs: [...state.travelLogs, { date, entries: [entry] }] };
    }),
  deleteLogEntry: (date, entryId) =>
    set((state) => ({
      travelLogs: state.travelLogs.map((log) =>
        log.date === date
          // 해당 날짜의 entries 중 특정 id만 제거
          ? { ...log, entries: log.entries.filter((e) => e.id !== entryId) }
          : log
      ),
    })),



  // ---------- 게시글 공개 여부 ----------
  isPublic: true, // 기본값: 공개
  setIsPublic: (value) => set({ isPublic: value }),

  // ---------- 일일 일정 초안(journalDrafts) 관리 ----------
  journalDrafts: [],
  // 새 초안 한 개 추가
  addJournalDraft: () =>
    set((state) => ({
      journalDrafts: [
        ...state.journalDrafts,
        {
          id: uuidv4(),      // uuid로 초안 식별자 생성
          date: '',
          title: '',
          description: '',
          uploadedImages: [],
        },
      ],
    })),
  // 특정 초안 삭제
  removeJournalDraft: (id) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.filter((draft) => draft.id !== id),
    })),
  // 특정 초안의 일부 필드 업데이트
  updateJournalDraft: (id, updates) =>
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.id === id ? { ...draft, ...updates } : draft
      ),
    })),
  // 초안 전체 삭제 (초기화)
  clearJournalDrafts: () => set({ journalDrafts: [] }),

  // 특정 초안에 이미지 파일들을 추가
  addUploadedImageToDraft: async (id, files) => {
    // 전달된 File 목록을 UploadedImage 구조로 변환
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file), // 브라우저에서만 사용 가능한 미리보기 URL
      url: undefined,                     // 아직 서버에 업로드되지 않았으므로 undefined
    }));

    // 해당 초안의 uploadedImages에 새 이미지들 추가
    set((state) => ({
      journalDrafts: state.journalDrafts.map((draft) =>
        draft.id === id
          ? { ...draft, uploadedImages: [...draft.uploadedImages, ...newImages] }
          : draft
      ),
    }));
  },

  // 특정 초안에서 개별 이미지 제거
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

  // ---------- 지도 UI 상태 ----------
  selectedPinIndex: null, // 리스트/지도에서 선택된 핀 index
  setSelectedPinIndex: (index) => set({ selectedPinIndex: index }),

  highlightedIndex: null, // 마우스 오버 등으로 하이라이트된 핀 index
  setHighlightedIndex: (index: number | null) => set({ highlightedIndex: index }),

  mapRef: null, // Google Maps Map 인스턴스 참조
  setMapRef: (ref: google.maps.Map | null) => set({ mapRef: ref }),

  // =======================
  // 여행 계획 제출 로직
  // =======================
  submitTripPlan: async (startDate, endDate, pins) => {
    const { journalDrafts, user, travelMainEntry, isPublic } = get();

    // --- 1) 기본 유효성 검사 ---
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!travelMainEntry.title || !travelMainEntry.locationSummary) {
      alert('여행 제목과 도시명을 모두 입력해 주세요.');
      return;
    }

    // 모든 일일 초안에 제목/설명이 들어갔는지 검사
    for (const draft of journalDrafts) {
      if (!draft.title || !draft.description) {
        alert('모든 일정의 제목과 설명을 입력해 주세요.');
        return;
      }
    }

    try {
      // --- 2) 일자별 Journal 데이터 생성 ---
      const start = new Date(startDate);

      const journals = await Promise.all(
        journalDrafts.map(async (draft, i) => {
          const uploadedUrls: string[] = [];

          // 초안에 있는 이미지들을 실제 서버에 업로드
          for (const image of draft.uploadedImages) {
            if (!image.url) {
              // 아직 업로드되지 않은 경우 -> uploadImage 호출
              const resultUrl = await uploadImage(image.file);
              if (resultUrl) uploadedUrls.push(resultUrl);
            } else {
              // 이미 업로드되어 url이 존재하면 그대로 사용
              uploadedUrls.push(image.url);
            }
          }

          // i번째 초안을 여행 시작일로부터 i일 뒤 날짜로 계산
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환

          // 백엔드에 보낼 journal 한 건
          return {
            date: dateStr,
            title: draft.title,
            description: draft.description,
            photos: uploadedUrls,
          };
        })
      );

      // --- 3) 핀 이미지 처리 (Pin.images -> URL 배열로 변환) ---
      const processedPins = await Promise.all(
        pins.map(async (pin) => {
          const uploadedPinImages: string[] = [];

          if (pin.images && pin.images.length > 0) {
            for (const image of pin.images) {
              if (image instanceof File) {
                // File 타입이면 업로드 후 URL 획득
                const resultUrl = await uploadImage(image);
                if (resultUrl) uploadedPinImages.push(resultUrl);
              } else if (typeof image === 'string') {
                // 이미 string URL이면 그대로 사용 (수정 페이지 등에서)
                uploadedPinImages.push(image);
              }
            }
          }

          // images를 URL 배열로 바꾼 새 Pin 객체 반환
          return {
            ...pin,
            images: uploadedPinImages,
          };
        })
      );

      // --- 4) 최종 payload 생성 (백엔드 DTO 구조와 매칭) ---
      const payload = {
        startDate,
        endDate,
        userId: user.id,

        // 메인 정보
        title: travelMainEntry.title,
        locationSummary: travelMainEntry.locationSummary,
        description: travelMainEntry.description,
        isPublic,

        // 항공 정보
        useFlight: travelMainEntry.useFlight,
        flightDepartureAirline: travelMainEntry.flightDepartureAirline,
        flightDepartureName: travelMainEntry.flightDepartureName,
        flightDepartureTime: travelMainEntry.flightDepartureTime,
        flightDepartureAirport: travelMainEntry.flightDepartureAirport,
        flightArrivalAirport: travelMainEntry.flightArrivalAirport,
        flightReturnAirline: travelMainEntry.flightReturnAirline,
        flightReturnName: travelMainEntry.flightReturnName,
        flightReturnTime: travelMainEntry.flightReturnTime,
        flightReturnDepartureAirport: travelMainEntry.flightReturnDepartureAirport,
        flightReturnArrivalAirport: travelMainEntry.flightReturnArrivalAirport,

        // 기타 정보
        travelTrans: travelMainEntry.travelTrans,
        totalBudget: travelMainEntry.totalBudget,
        travelTheme: travelMainEntry.travelTheme,
        review: travelMainEntry.review,
        isAfterTravel: travelMainEntry.isAfterTravel,

        // 핀 + 일자별 저널
        pins: processedPins,
        journals,
      };

      console.log(payload); // 디버깅용 출력

      // --- 5) 백엔드로 POST 요청 보내기 ---
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/journals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키(JWT 등) 전송
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('저장 실패');

      alert('저장 성공!');
      // 저장 후, 일일 초안과 핀 리스트 초기화
      set({ journalDrafts: [], pins: [] });
    } catch (err) {
      console.error(err);
      alert(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  },
}));
