// page.tsx (EditPostPage) - 글 수정 페이지
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
// import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ItineraryEditor from '../components/ItineraryEditor';
import { generateDateRange } from '@/app/maps/utils/dateUtils';
import MyMap from '@/app/maps/components/MyMap';
import TravelInfoEdit from '../components/TravelInfoEdit';
import PinListPanelEdit from '../components/PinListPanelEdit';
import MyMapEdit from '../components/MyMapEdit';

type TravelJournal = {
  id: number;
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  description: string; // 내용 요약
  locationSummary: string;
  useFlight: boolean; // 항공편 이용여부
  flightDepartureAirline: string; // 출국편 항공사
  flightDepartureName: string; // 출국편 항공편명
  flightDepartureAirport: string; // 출국편 출발 공항
  flightArrivalAirport: string; // 출국편 도착 공항
  flightDepartureTime: string;// 출국편 출발시간
  flightReturnAirline: string; // 귀국편 항공사
  flightReturnName: string; // 귀국편 항공편명
  flightReturnDepartureAirport: string; // 귀국편 출발 공항
  flightReturnArrivalAirport: string; // 귀국편 도착 공항
  flightReturnTime: string; // 귀국편 출발시간
  travelTrans: string; // 교통수단
  totalBudget: string; // 경비(예산)
  travelTheme: string; // 여행 테마
  isAfterTravel: boolean; // 여행 완료 여부
  review: string; // 여행 후기
  isPublic: boolean; // 공개 여부
  pins: Pin[];
  itinerary: DayJournal[];
};

type Pin = {
  lat: number; // 위도
  lng: number; // 경도
  name: string; // 위치명
  address: string; // 주소
  category: string; // 카테고리
  images?: (string | File)[]; // images?: string[]; // 이미지 URL 목록
  minCost?: string; // 금액(최소)
  maxCost?: string; // 금액(최대)
  currency?: string; // 화폐 단위
  openTime?: string; // 오픈시간
  closeTime?: string; // 마감시간
  description?: string; // 설명
  
};

type DayJournal = { // 일별 일정표
  date?: string;
  title: string;
  content: string;
  imageUrls: string[];
  newImages?: File[];
  deletedImages?: string[];
};

const parseLocalDate = (dateString: string): Date => {
  return new Date(dateString.replace(/-/g, '/'));
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();


  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  useEffect(() => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    const dateList = generateDateRange(start, end);
    setAvailableDates(dateList);
  }, [range]);

  type TabType = '여행 일정' | '방문지' | '상세 일정'; // 문자열 종류 제한
  // React의 useState 훅
  // TabType | null: 탭이 선택되지 않은 상태 (null)도 허용, 미클릭 actibveTab = null, 클릭시 -> '여행 일정' 등..
  const [activeTab, setActiveTab] = useState<TabType | null>(null); 

  const toggleTab = (tab: typeof activeTab) => { // tab은 '여행 일정' | '방문지' | '상세 일정' | null 중 하나여야 함
    setActiveTab((prev) => (prev === tab ? null : tab)); // setActiveTab() 안에 함수를 넣어서 이전 값(prev)을 기반으로 새로운 상태를 계산
    // 같은탭 클릭시 닫음(null), 다른탭 클릭시 새로운 탭 전환(tab(정해진 타입에서))
    // prev 는  '화살표 함수 안의 매개변수로 자동 제공' React가 알아서 넘겨주는 값이고, 우리가 원하는 이름으로 쓸 수 있음
    // 연산 후 나온 값을 setActiveTab 하여 activeTab 의 값이 된다고 보면 됨
  };

  // 게시글을 서버에서 불러왔을 때 전체 데이터를 저장하는 기본 상태
  const [journalData, setJournalData] = useState<TravelJournal | null>(null); 

  const setTravelMainEntry = (entry: Partial<TravelJournal>) => {
    // entry란? 우리가 부분적으로 수정할 값들을 전달하는 매개변수
    // setTravelMainEntry({ title: "새 제목" }); setTravelMainEntry({ locationSummary: "오사카" });
    // Partial<TravelJournal> 란? 타입스크립트 문법 TravelJournal 타입의 모든 속성을 "선택적으로" 포함해도 된다 즉, 전부 다 안 넣어도 되게 Partial을 사용
    if (!journalData) return;
    // journalData가 아직 서버에서 불러오기 전이라서 null일 경우,
    // 실수로 수정하려고 하면 에러가 나니까 그냥 함수 종료하는 안전장치

    setJournalData((prev) => ({ // setJournalData((prev) => { ... }) 의 뜻? 상태 업데이트 함수 안에 함수형 업데이트를 쓰고 있음, 
       // React는 최신 상태를 기반으로 업데이트하기 위해 아래처럼 쓸 수 있음
       // setState((prev) => newValueBasedOn(prev))

      ...prev!, // ! 이유 : prev는 타입상 TravelJournal | null일 수 있어서 경고가 나는데,
                // 우리는 이미 위에서 if (!journalData) return;으로 null 체크를 했으므로,
                // "무조건 null 아님!" 이라고 TypeScript에게 알려줌
      ...entry,
      // ...prev!, ...entry 는 전개 연산자임 객체를 합치는 문법 

      /*
      const prev = {
        title: "기존 제목",
        locationSummary: "서울",
      };

      const entry = {
        title: "새 제목",
      };

      const newData = {
        ...prev,
        ...entry,
      };

      // 결과는?

      {
        title: "새 제목",
        locationSummary: "서울"
      }

     */ 
     // 즉 entry 가 기존 값을 덮어씀

    }));
  };

  // 한 줄의 handleChange 함수로 여러 input을 한 번에 처리할 수 있는 방법
  const handleChange = ( 
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
    // e: 이벤트 객체 (input, textarea 등에 타이핑하거나 수정될 때 발생)
    // HTMLInputElement | HTMLTextAreaElement: input이나 textarea가 변경될 때마다 상태를 바꿈
  ) => {
    const { name, value } = e.target; // 구조 분해 할당

    /*
    예를 들어, <input name="title" value="오사카 여행" />이라면,

    e.target.name: "title"

    e.target.value: "오사카 여행"

    즉, name="title" 이라는 속성을 HTML에 걸어두면
    JavaScript에서는 그걸 키로 사용해서 상태를 업데이트
    */
    // 계산된 프로퍼티 이름 (computed property name)
    setTravelMainEntry({ [name]: value }); // 결과: { title: "오사카 여행" }
  };

  useEffect(() => { // 특정 게시글 불러오기
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/journals/public/${id}`);
        const data = await res.json(); // 응답 데이터 JSON으로 파싱

        const enhancedItinerary = data.itinerary.map((entry: any) => ({ // data.itinerary.map(...) 파싱된 데이터의 일일 일정 배열들을 순회 하며 새배열 생성
          // (entry: any) => ({ ... }) 각 요소를 새 객체로 변환 
          // 결론 :  data.itinerary 배열의 각 요소(entry)를 변형해서 새로운 enhancedItinerary 배열을 만든다
          ...entry, // 기존 속성 복사
          date: entry.date || '', // 만약 entry.date가 falsy 값이면 '' (빈 문자열)로 대체
          imageUrls: entry.images ?? [], // 만약 entry.images가 null 또는 undefined일 경우에만 [] (빈 배열)로 대체
          newImages: [],
          deletedImages: [],
          // enhancedItinerary는 수정 기능용으로 필요한 필드(newImages, deletedImages 등)를 추가한 버전
        }));
        console.log("data.itinerary:", JSON.stringify(data.itinerary, null, 2));

        setJournalData({ 
          ...data, // data 복사
          itinerary: enhancedItinerary // data 에서 itinerary는 우리가 전처리한 enhancedItinerary를 사용한다.
        });

        setRange([
          {
            startDate: parseLocalDate(data.dateRange.startDate), // parseLocalDate : 문자열로 제공되는 날짜를 LocalDate 객체로 변환
            endDate: parseLocalDate(data.dateRange.endDate),
            key: 'selection',
          },
        ]);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };

    fetchData(); // 자바스크립트의 비동기 함수 실행을 위한 패턴
                 // useEffect() 안에서는 async 함수를 직접 사용할 수없어 이와 같은 형태로 작성하여 
                 // 비동기 함수를 정의한 다음 즉시 실행하는 일반적인 패턴

  }, [id]); // [id] 는 의존성 배열, 의미 : 이 useEffect()는 오직 id 값이 처음 생기거나 변경될 때만 실행
            // id 값이 변할 때마다 useEffect가 재실행되는 구조를 만들기 위해 (처음 컴포넌트가 마운트될 때 id = 16 → fetchData() 실행, 사용자가 다른 글을 수정하러 가서 id = 17 → fetchData() 다시 실행)

  // 수정된 게시글 저장
  const handleSave = async () => {
    if (!journalData) return;

    try {
      // 1) 일정(itinerary) 처리
      const updatedItinerary = await Promise.all(
        journalData.itinerary.map(async (entry) => {
          const uploadedUrls: string[] = [];

          // 새 이미지 업로드
          if (entry.newImages && entry.newImages.length > 0) {
            const formData = new FormData();
            entry.newImages.forEach((file) => formData.append('files', file));

            const res = await fetch('http://localhost:8080/api/images/edit/upload', {
              method: 'POST',
              body: formData,
              // credentials: 'include', // 인증 필요 시 주석 해제
            });
            if (!res.ok) throw new Error('일정 이미지 업로드 실패');

            const data = await res.json();
            const urls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
            uploadedUrls.push(...urls);
          }

          // 삭제 이미지 처리
          if (entry.deletedImages && entry.deletedImages.length > 0) {
            const delRes = await fetch('http://localhost:8080/api/images/edit/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrls: entry.deletedImages }),
              // credentials: 'include', // 인증 필요 시 주석 해제
            });
            if (!delRes.ok) throw new Error('일정 이미지 삭제 실패');
          }

          // 최종 이미지 조합 (기존 + 새로 업로드)
          const finalImages = [...(entry.imageUrls || []), ...uploadedUrls];

          return {
            title: entry.title,       // ← 오타 수정
            content: entry.content,
            images: finalImages,
            date: entry.date || null,
          };
        })
      );

      // 2) 핀(pins) 처리
      const processedPins = await Promise.all(
        (journalData.pins ?? []).map(async (pin) => {
          const uploadedImages: string[] = [];
          const newImages = pin.images?.filter((img) => img instanceof File) as File[] | undefined;

          if (newImages && newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach((file) => formData.append('files', file));

            const res = await fetch('http://localhost:8080/api/images/edit/upload', {
              method: 'POST',
              body: formData,
              // credentials: 'include', // 인증 필요 시 주석 해제
            });
            if (!res.ok) throw new Error('핀 이미지 업로드 실패');

            const data = await res.json();
            const urls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
            uploadedImages.push(...urls);
          }

          const existingUrls = (pin.images || []).filter((img) => typeof img === 'string') as string[];
          return { ...pin, images: [...existingUrls, ...uploadedImages] };
        })
      );

      // 3) 전체 수정 저장
      const res = await fetch(`http://localhost:8080/api/journals/public/edit/${journalData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...journalData,
          itinerary: updatedItinerary,
          pins: processedPins,
        }),
      });

      if (!res.ok) throw new Error('수정 실패');
      alert('수정이 완료되었습니다!');
    } catch (err) {
      console.error('저장 중 오류 발생:', err);
      alert('저장에 실패했습니다.');
    }
  }; // end handleSave


  // 삭제 함수
  const handleDelete = async () => {
    const confirm = window.confirm('정말 이 게시글을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8080/api/journals/public/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('삭제가 완료되었습니다.');
        router.push('/posts'); // 삭제 후 이동할 페이지 경로
      } else {
        throw new Error('삭제 실패');
      }
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  if (!journalData) return <div>불러오는 중...</div>;



return (
  <div className="flex h-screen w-screen bg-gray-100">
    {/* 좌측 아이콘 사이드바 */}
    <div className="flex h-full w-16 flex-col justify-between border-e border-gray-100 bg-white">
      <div className="px-2 py-4 space-y-4">
        {/* 여행 일정 버튼 */}
        <button
          onClick={() => toggleTab('여행 일정')}
          className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
            activeTab === '여행 일정'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
               className="size-5 opacity-75"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth="2"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
           <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
            여행 일정
          </span>
        </button>

        {/* 방문지 버튼 */}
        <button
          onClick={() => toggleTab('방문지')}
          className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
            activeTab === '방문지'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
            <svg
              className="size-6 sm:size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              방문지
            </span>
        </button>

        {/* 상세 일정 버튼 */}
        <button
          onClick={() => toggleTab('상세 일정')}
          className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
            activeTab === '상세 일정'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
              <svg
              className="size-6 sm:size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              상세 일정
            </span>
        </button>
      </div>
    </div>

    {/* 우측 탭 콘텐츠 */}
    {activeTab && (
      <div className="w-100 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 capitalize text-blue-600">{activeTab}</h2>
        <div className="space-y-4 text-sm text-gray-600">
          {activeTab === '여행 일정' && (
            <TravelInfoEdit
              travelMainEntry={journalData} // props.travelMainEntry로 사용할 수 있게됨
              setTravelMainEntry={setTravelMainEntry}
              handleDataChange={handleChange} // 이건 TravelInfoEdit으로 넘긴 handleChange임 const handleDateChange와 다름
            />
          )}


          {activeTab === '방문지' && (
            <PinListPanelEdit
              travelPinEntry={journalData.pins ?? []} // ← 이게 핵심!
              onTravelPinEntryChange={(updatedPins) =>
                setJournalData({ ...journalData, pins: updatedPins })
              }
            />

          )}

          {activeTab === '상세 일정' && (
            <>
              <ItineraryEditor
                itinerary={journalData.itinerary}
                onItineraryChange={(updatedItinerary) =>
                  setJournalData({ ...journalData, itinerary: updatedItinerary })
                }
                availableDates={availableDates}
              />
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  수정 완료
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* 지도 본체 */}
    <div className="flex-1">
    <MyMapEdit
      pins={journalData.pins}
      onUpdatePin={(updatedPins) => {
        setJournalData({
          ...journalData,
          pins: updatedPins,
        });
      }}
    />
    </div>
  </div>
);


}