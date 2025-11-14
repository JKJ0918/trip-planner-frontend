// app/contact/page.tsx
"use client";

import React from "react";

export default function ContactPage() {
  const adminEmail = "whrjswo123@naver.com";
  const mailtoLink = `mailto:${adminEmail}?subject=TripPlanner 문의드립니다&body=안녕하세요.%0D%0ATripPlanner 문의드립니다.%0D%0A%0D%0A- 이름:%0D%0A- 문의 유형:%0D%0A- 자세한 내용:%0D%0A`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center">
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* 흰색 카드 영역 */}
          <div className="bg-white rounded-3xl shadow-2xl px-6 py-10 md:px-10 md:py-12 flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            {/* 왼쪽 텍스트 영역 */}
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                CONTACT
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                TripPlanner 팀에게
                <br />
                문의해 주세요
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                서비스 이용 중 불편한 점, 버그 제보, 기능 제안 등 무엇이든
                편하게 보내 주세요.
                <br />
                아래 버튼을 누르면 사용 중인 메일 프로그램이 자동으로 열립니다.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={mailtoLink}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm md:text-base shadow-md transition"
                >
                  이메일로 문의하기
                </a>
                <p className="text-xs text-gray-400">
                  메일이 자동으로 열리지 않는 경우, 아래 주소를 복사해 직접
                  메일을 보내주세요.
                  <br />
                  <span className="font-mono text-[11px] bg-gray-100 px-2 py-1 rounded mt-1 inline-block text-gray-600">
                    {adminEmail}
                  </span>
                </p>
              </div>
            </div>

            {/* 오른쪽 "휴대폰 / 상담" 일러스트 느낌 영역 */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-xs">
                {/* 배경 장식 */}
                <div className="absolute -top-6 -left-4 w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-400/90 to-emerald-400/80 blur-sm opacity-70" />
                <div className="absolute -bottom-8 -right-10 w-28 h-28 rounded-full bg-gradient-to-tr from-pink-500/80 to-red-500/80 blur-sm opacity-70" />

                {/* 휴대폰 카드 */}
                <div className="relative rounded-[2rem] bg-slate-900 text-white shadow-2xl px-5 pt-6 pb-7 border border-slate-800">
                  {/* 상단 바 */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-slate-300">Support</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Now online</span>
                  </div>

                  {/* 상담원 아바타 */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 flex items-center justify-center shadow-lg mb-3">
                      <span className="text-3xl">🎧</span>
                    </div>
                    <p className="text-sm font-semibold">TripPlanner 상담봇</p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      최대한 빠르게 답변드릴게요!
                    </p>
                  </div>

                  {/* 채팅 말풍선 예시 */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2">
                        TripPlanner 사용 중 도움이
                        필요하신가요?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-red-500 px-3 py-2">
                        네, 문의 메일을 보내고 싶어요.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2">
                        상단의 <span className="font-semibold">문의하기 버튼</span>을
                        눌러 메일을 작성해 주세요. 😊
                      </div>
                    </div>
                  </div>

                  {/* 하단 아이콘 영역 */}
                  <div className="mt-5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Audio • Mute • Chat</span>
                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-[13px]">
                      ✉
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
