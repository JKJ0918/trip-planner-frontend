"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Camera, Share2 } from "lucide-react";

const testimonials = [
  { name: "지민 (서울)", quote: "이 앱 덕분에 처음으로 혼자 여행을 완벽하게 준비할 수 있었어요!" },
  { name: "Alex (LA)", quote: "Everything was organized! This app is a life-saver for solo travelers." },
  { name: "유리 (부산)", quote: "지도에 핀을 찍는 방식이 직관적이고 간편했어요." },
  { name: "Daniel (NY)", quote: "사진을 기록과 함께 남길 수 있어 정말 유용했어요." },
];

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-y-auto"> 
      {/* Section 1: Fullscreen HERO */}
      <section
        id="hero"
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
        aria-label="Hero"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-xl">
            당신의 여행을 계획하세요
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-white/90">
            항공권부터 숙소, 맛집까지. 완벽한 여행 일정을 지금 만들어보세요.
          </p>
          <Link href="/login">
            <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg cursor-pointer">
              여행 계획 시작하기
            </button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <a href="#features" className="absolute bottom-8 text-3xl animate-bounce" aria-label="다음 섹션으로 이동">
          ↓
        </a>
      </section>

      {/* Section 2: FEATURES (Left copy · Right image) */}
      <section id="features" className="py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <MapPin className="size-4" />
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                클릭 한 번으로
                <br className="hidden md:block" />
                여행 준비가 끝납니다
              </h2>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed">
                지도에 핀을 찍고, 맛집·명소를 저장하고, 일정표와 여행일지를 한곳에서 관리하세요.
                초보자도 금방 익숙해지는 심플한 흐름으로 여행의 설렘만 남겨드립니다.
              </p>

              {/* Bullets */}
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0" />
                  <div>
                    <p className="font-semibold">원클릭 핀 저장</p>
                    <p className="text-slate-600 text-sm">지도에서 클릭 한 번으로 장소 등록, 사진·메모까지 즉시 기록</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0" />
                  <div>
                    <p className="font-semibold">여행일정 & 일지</p>
                    <p className="text-slate-600 text-sm">날짜별 계획과 감정 기록을 함께 관리하고 추억으로 보관</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0" />
                  <div>
                    <p className="font-semibold">공유와 협업</p>
                    <p className="text-slate-600 text-sm">링크 한 번으로 친구와 일정 공유, 피드백까지 손쉽게</p>
                  </div>
                </li>
              </ul>

              {/* Tiny trust strip */}
              <div className="mt-6 flex items-center gap-6 text-slate-500">
                <span className="inline-flex items-center gap-2 text-sm">
                  <Camera className="size-4" /> 사진 기록
                </span>
                <span className="inline-flex items-center gap-2 text-sm">
                  <Share2 className="size-4" /> 일정 공유
                </span>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lg:col-span-7">
              <div className="relative">
                {/* big hero image */}
                <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(2,6,23,0.15)] border border-slate-200">
                  <img
                    src="/images/feature-map.jpg"
                    alt="지도에서 핀을 찍고 여행지를 관리하는 화면 예시"
                    className="w-full h-[440px] object-cover"
                    loading="lazy"
                  />
                </div>

                {/* floating card */}
                <div className="hidden md:block">
                  <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 p-4 shadow">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold">핀 저장 완료</p>
                        <p className="text-sm text-slate-600">‘도톤보리 라멘’이 일정에 추가되었습니다</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 rounded-2xl overflow-hidden border border-slate-200 shadow">
                    <img
                      src="/images/feature-journal.jpg"
                      alt="여행일지 예시"
                      className="w-44 h-28 object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section 3: TESTIMONIALS (Fullscreen stripe) */}
      <section id="testimonials" className="relative min-h-screen flex items-center py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl md:text-5xl font-bold">실제 사용자들의 후기</h2>
            <p className="text-lg md:text-xl text-white/80 mt-3">지금 바로 시작해 보세요.</p>
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              className="mt-6 flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-1"
              aria-label="후기 슬라이더"
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-[360px] bg-white/95 text-gray-900 p-6 rounded-xl shadow-sm border border-white/20"
                >
                  <div className="border-l-2 border-emerald-500 pl-4">
                    <p className="text-gray-800 italic leading-relaxed mb-4">“{t.quote}”</p>
                    <p className="text-sm text-gray-500 font-medium">- {t.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="absolute right-2 -bottom-14 md:right-6 md:-bottom-12 flex gap-2">
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

          {/* Back to top */}
          <div className="text-center mt-16">
            <a
              href="#hero"
              className="inline-block text-white/90 hover:text-white underline-offset-4 hover:underline"
            >
              맨 위로 돌아가기 ↑
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
