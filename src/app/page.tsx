"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 아이콘
import { useRef } from "react";

const testimonials = [
  {
    name: "지민 (서울)",
    quote: "이 앱 덕분에 처음으로 혼자 여행을 완벽하게 준비할 수 있었어요!",
  },
  {
    name: "Alex (LA)",
    quote: "Everything was organized! This app is a life-saver for solo travelers.",
  },
  {
    name: "유리 (부산)",
    quote: "지도에 핀을 찍는 방식이 직관적이고 간편했어요.",
  },
  {
    name: "Daniel (NY)",
    quote: "사진을 기록과 함께 남길 수 있어 정말 유용했어요.",
  },
];


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      {/* Hero */}
      <section
        className="text-center py-32 bg-cover bg-center bg-no-repeat text-white rounded-xl"
        style={{ backgroundImage: "url('/images/hero.jpg')" }} // 배경 이미지
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          당신의 여행을 계획하세요
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          항공권부터 숙소, 맛집까지. 완벽한 여행 일정을 지금 만들어보세요.<br/><br/><br/><br/><br/>
        </p>
        <Link href="/login">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition cursor-pointer">
            여행 계획 시작하기
          </button>
        </Link>
      </section>
      <div className="text-center my-20">
        <span className="text-4xl md:text-4xl font-bold">간편하고 편리하게</span>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          휴가의 설렘을 앞당겨 줄 기능을 만나보세요.
        </p>
      </div>

{/* 이모지 칩 행 */}
<ul className="mt-6 flex flex-wrap justify-center gap-2">
  {[
    { e: "", t: "인스타 스팟" },
    { e: "", t: "현지 맛집" },
    { e: "", t: "노을 명소" },
    { e: "", t: "도보 코스" },
    { e: "", t: "가성비 숙소" },
    { e: "", t: "맞춤 동선" },
  ].map((b, i) => (
    <li
      key={i}
      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm
                 shadow-sm hover:shadow transition will-change-transform"
      title={b.t}
    >
      <span className="mr-1">{b.e}</span>
      {b.t}
    </li>
  ))}
</ul>



      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6 py-15">
        
        {[
          {
            title: "한 번에 핀 찍기",
            description: "지도에서 클릭 한 번으로 맛집과 명소를 바로 저장하세요.",
            image: "/images/bryan-trogdon-MWXKz_o1Ls0-unsplash.jpg",
            textColor: "black",
            bgColor: "bg-white-100",
          },
          {
            title: "맛집 & 명소 등록",
            description: "지도에 핀을 찍어 나만의 여행 장소를 저장하세요.",
            image: "/images/feature-map.jpg",
            textColor: "black",
            bgColor: "bg-white-100",
          },
          {
            title: "여행 공유하기",
            description: "친구와 일정을 공유하고 피드백도 받아보세요.",
            image: "/images/feature-share.jpg",
            textColor: "black",
            bgColor: "bg-white-100",
          },
          {
            title: "여행일지 작성",
            description: "감정을 기록하고 추억을 사진과 함께 남기세요.",
            image: "/images/feature-journal.jpg",
            textColor: "black",
            bgColor: "bg-white-100",
          },
        ].map(({ title, description, image, textColor, bgColor }, i) => (
          <div
            key={i}
            className={`rounded-3xl overflow-hidden shadow-lg ${bgColor} text-${textColor}
                        transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <img src={image} alt={title} className="w-full h-80 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-md">{description}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="text-center my-20">
        <span className="text-4xl md:text-4xl font-bold">실제 사용자들의 후기</span>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          지금바로 시작해 보세요.
        </p>
      </div>

{/* Testimonials (심플 스타일) */}
<section className="relative overflow-hidden rounded-3xl">
  {/* 배경: 가벼운 그라디언트 */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-indigo-100" />
  {/* 내용 래퍼 */}
  <div className="relative py-16 px-6 md:px-10 text-black">
    <div className="max-w-6xl mx-auto">

      {/* 슬라이더 */}
      <div
        ref={scrollRef}
        className="mt-10 flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="min-w-[280px] md:min-w-[360px] bg-white/95 text-gray-900
                       p-6 rounded-xl shadow-sm border border-white/20"
          >
            {/* 좌측 포인트 라인 + 내용 */}
            <div className="border-l-2 border-emerald-500 pl-4">
              <p className="text-gray-800 italic leading-relaxed mb-4">“{t.quote}”</p>
              <p className="text-sm text-gray-500 font-medium">- {t.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 좌우 버튼 (기존 위치/동작 유지, 색만 살짝) */}
      <div className="absolute right-6 bottom-6 flex gap-2">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-white/90 text-teal-900 shadow hover:bg-white"
          aria-label="이전"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-white/90 text-teal-900 shadow hover:bg-white"
          aria-label="다음"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}
