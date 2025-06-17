'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from './components/LocationSearch';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/slide1.jpg',
    headline: '여행 준비는 이제 간편하게',
    subtext: 'TripPlanner와 함께라면 누구나 쉽게!',
  },
  {
    image: '/images/slide2.jpg',
    headline: '지도에 나만의 장소를 저장하세요',
    subtext: '맛집, 명소, 숙소까지 한눈에 관리',
  },
  {
    image: '/images/slide3.jpg',
    headline: '여행 일정을 친구와 공유해보세요',
    subtext: '같이 계획하고 같이 떠나는 즐거움',
  },
  {
    image: '/images/slide4.jpg',
    headline: '언제 어디서나 쉽게 이용하세요',
    subtext: '당신과 함께할 여행을 기다리고 있습니다',
  },
];

export default function MainPage() {
  const [location, setLocation] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleStart = () => {
    if (location) {
      router.push(`/planner?location=${encodeURIComponent(location)}`);
    }
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* 슬라이드 이미지 */}
      <div className="w-full h-[600px] relative overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center flex-col text-white px-6 text-center ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="bg-black/50 p-4 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.headline}</h2>
              <p className="text-sm md:text-base">{slide.subtext}</p>
            </div>
          </div>
        ))}

        {/* 좌우 버튼 - 항상 보이게 */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-20"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-20"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* 도트 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === currentSlide ? 'bg-indigo-600' : 'bg-gray-300'}`}
            ></span>
          ))}
        </div>
      </div>

      {/* 텍스트 및 검색 */}
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold mb-6">여행지를 먼저 선택해보세요</h1>
        <LocationSearch />
      </div>
    </div>
  );
}
