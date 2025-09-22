"use client";

import { useRef, useState } from "react";
import { CheckCircle, MapPin, Camera, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [loading, setLoading] = useState(false); // 다중 클릭 방지
  const router = useRouter();

  // 로그인 감지
  const handleStart = async () => {

    if(loading){
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {credentials:"include"});

      if(response.ok){
        // 로그인 O 유저
        router.push("/main"); // 메인 페이지 이동
      } else if(response.status === 401) {
        // 로그인 X 유저
        // const next = encodeURIComponent("/login");
        router.push("/login");

      } else {
        // 기타 에러
        alert("잠시 후 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error(e);
      alert("네트워크 오류가 발생 하였습니다._랜딩 페이지");
    } finally {
      setLoading(false);
    }

  };

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

          <button
            onClick={handleStart}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "시작합니다." : "여행계획 시작하기"}
          </button>
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
                    src="/images/landing2.jpg"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section 3: STORIES (Image Left · Copy Right) */}
      <section id="stories" className="py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-20">

          {/* Section 4 header (center) */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            추천 여행지
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            이번 달 인기 여행지
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            사진과 이야기로 미리 떠나보기 — TripPlanner가 엄선한 베스트 셀렉션입니다.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>


          {[
            {
              badge: "터키-튀르키예",
              title: "카파도키아",
              desc:
                "카파도키아는 튀르키예 중앙아나톨리아에 위치한 지역으로, 화산 활동으로 생성된 기괴한 암석과 동굴, 그리고 수많은 석굴 사원으로 유명하며, 초기 기독교인들이 박해를 피해 만든 지하 도시와 초기 기독교 학습의 중심지로도 알려져 있습니다. 특히 '요정의 굴뚝'이라 불리는 독특한 지형과 열기구 투어가 유명하여 국제적인 관광지로, 도시 전체가 유네스코 문화유산으로 지정될 만큼 아름다운 자연과 역사를 지닌 곳입니다. ",
              author: { name: "TripPlanner.com", role: "액티비티" },
              image: "/images/landing1.jpg",
            },
            {
              badge: "태국-방콕",
              title: "왓 아룬 사원",
              desc:
                "태국은 동남아시아에 위치한 왕국으로, 수도는 방콕이고 불교 문화가 강하며, 타이족이 주를 이룹니다. 맛과 향이 조화로운 독특한 태국 음식을 맛볼 수 있으며, 아름다운 해변과 사원 등 다양한 볼거리를 갖추고 있습니다. 외세의 지배를 받은 적이 없는 입헌군주제 국가이며, 머리를 만지거나 발로 물건을 가리키는 등의 행동은 무례하게 여겨지므로 주의해야 합니다.",
              author: { name: "TripPlanner.com", role: "크루즈" },
              image: "/images/landing3.jpg",
            },
          ].map((item, i) => (
            <article
              key={i}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left: Image */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-[0_12px_40px_rgba(2,6,23,0.10)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[360px] md:h-[420px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right: Copy */}
              <div className="lg:col-span-7">
                <p className="text-sm font-semibold text-slate-500">{item.badge}</p>
                <h3 className="mt-2 text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Author / Meta */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center font-semibold">
                    {item.author.name.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{item.author.name}</p>
                    <p className="text-slate-500">{item.author.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 4: Powered by */}
      <section className="py-16 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto px-6">
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-10">
            Powered by
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center opacity-80">
            <img src="/images/logos/nextjs.svg" alt="Next.js" className="h-10" />
            <img src="/images/logos/springboot.svg" alt="Spring Boot" className="h-10" />
            <img src="/images/logos/tailwindcss.svg" alt="Tailwind CSS" className="h-10" />
            <img src="/images/logos/typescript.svg" alt="TypeScript" className="h-10" />
            <img src="/images/logos/googlemaps.svg" alt="Google Maps API" className="h-10" />
          </div>
        </div>
      </section>


    </main>
  );
}
