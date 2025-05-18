"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          당신의 여행을 계획하세요
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          항공권부터 숙소, 맛집까지. 완벽한 여행 일정을 지금 만들어보세요.
        </p>
        <Link href="/login">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition cursor-pointer"  >
            여행 계획 시작하기
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 py-16">
        {[
          {
            title: "일정 자동 생성",
            desc: "AI 기반으로 여행 기간과 장소에 맞는 일정을 추천받으세요.",
          },
          {
            title: "맛집 & 명소 등록",
            desc: "직접 원하는 장소를 추가하고 지도로 확인하세요.",
          },
          {
            title: "여행 공유하기",
            desc: "나만의 여행 계획을 친구나 커뮤니티와 공유할 수 있어요.",
          },
        ].map(({ title, desc }, i) => (
          <div key={i} className="border rounded-xl p-6 hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100 rounded-xl px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">실제 사용자 후기</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {[
            {
              name: "지민 (서울)",
              quote:
                "이 앱 덕분에 처음으로 혼자 여행을 완벽하게 준비할 수 있었어요!",
            },
            {
              name: "Alex (LA)",
              quote:
                "Everything was organized! This app is a life-saver for solo travelers.",
            },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-md shadow">
              <p className="text-gray-800 italic mb-2">“{t.quote}”</p>
              <p className="text-sm text-gray-500">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
