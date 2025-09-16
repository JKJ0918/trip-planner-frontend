'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from './components/LocationSearch';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  image: string;
  headline: string;     // 1줄짜리 큰 제목(흰색)
  subheadline?: string; // 강조 서브타이틀(노랑)
  hashtags?: string[];  // 왼쪽 패널의 해시태그들
  bgPosition?: string;  // 배경 정렬(옵션) 예: 'center', 'center right'
};

const slides: Slide[] = [
  {
    image: '/images/slide1.jpg',
    headline: '가을여행 초특가!',
    subheadline: '골든 세일 페스타',
    hashtags: ['추석연휴특가','사전예약할인','모두시그니처','시즌한정여행지','지역별베스트','이달의추천','라이브M','M타임딜'],
    bgPosition: 'center right',
  },
  {
    image: '/images/slide2.jpg',
    headline: '여행 준비는 이제 간편하게',
    subheadline: 'TripPlanner와 함께라면 누구나 쉽게!',
    hashtags: ['맞춤플랜','일정공유','지도북마크'],
  },
  {
    image: '/images/slide3.jpg',
    headline: '지도에 나만의 장소를 저장하세요',
    subheadline: '맛집 · 명소 · 숙소 한눈에',
    hashtags: ['핀관리','이미지업로드','메모'],
  },
  {
    image: '/images/slide4.jpg',
    headline: '언제 어디서나 쉽게 이용하세요',
    subheadline: '친구와 함께 계획하고 떠나기',
    hashtags: ['공유기능','모바일최적화'],
  },
];

export default function MainPage() {
  const [location, setLocation] = useState('');
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const router = useRouter();

  const goPrev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const goNext = () => setCurrent((p) => (p + 1) % slides.length);

  // 자동 재생 (호버 시 일시정지)
  useEffect(() => {
    if (hover) return;
    const id = setInterval(goNext, 8000);
    return () => clearInterval(id);
  }, [hover]);

  const handleStart = () => {
    if (location) router.push(`/planner?location=${encodeURIComponent(location)}`);
  };

  // 접근성용 라벨
  const label = useMemo(() => `${current + 1} / ${slides.length}`, [current]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      {/* ====== HERO SLIDES ====== */}
      <div
        className="relative w-full h-[560px] lg:h-[640px] overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* 각 슬라이드 레이어 */}
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-out will-change-transform ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `url(${s.image})`,
              backgroundSize: 'cover',
              backgroundPosition: s.bgPosition ?? 'center',
            }}
          >
            {/* 오른쪽 전체 이미지를 깔고, 왼쪽에 컬러 패널을 덮는 구조 */}
            {/* 왼쪽 컬러 패널 */}
            <div className="absolute inset-y-0 left-0 w-[42%] min-w-[320px] bg-[#ff6666]/95">
              <div className="absolute inset-0 bg-black/0" />
              <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 lg:px-16 gap-6">
                <div className="space-y-2">
                  <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                    {s.headline}
                  </h2>
                  {s.subheadline && (
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400">
                      {s.subheadline}
                    </div>
                  )}
                </div>

                {(s.hashtags?.length ?? 0) > 0 && (
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    {s.hashtags!.map((t) => `#${t}`).join('  ')}
                  </p>
                )}
              </div>
            </div>

            {/* 좌우 그라데이션(이미지 가독성 보조, 선택) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/10" />
          </div>
        ))}

        {/* 하단 좌측: 이전/다음 + 카운터 */}
        <div className="absolute left-6 sm:left-10 bottom-6 flex items-center gap-3 z-20">
          <button
            aria-label="이전 슬라이드"
            onClick={goPrev}
            className="grid place-items-center w-10 h-10 rounded-full shadow-lg bg-white/90 hover:bg-white transition"
            title="이전"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            aria-label="다음 슬라이드"
            onClick={goNext}
            className="grid place-items-center w-10 h-10 rounded-full shadow-lg bg-white/90 hover:bg-white transition"
            title="다음"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          <span className="ml-2 select-none text-sm font-medium tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {label}
          </span>
        </div>
      </div>

      {/* ====== 검색 영역 ====== */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">여행지를 먼저 선택해보세요</h1>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <LocationSearch />
        </div>
      </div>
    </div>
  );
}
