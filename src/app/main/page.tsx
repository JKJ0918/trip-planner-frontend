// app/page.tsx
'use client';

import Link from 'next/link';

export default function MainPage() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-white flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 leading-tight">
          수백만 개의 여행정보를 간단하게 <br />
          당신만의 여정을 만들어보세요
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          당신의 여행 준비를 쉽고 빠르게, <br />
          체계적으로 도와드립니다.
        </p>
        <Link href="/maps">
          <button className="inline-block rounded-md bg-indigo-600 px-8 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 transition">
            지도
          </button>
        </Link>
      </div>
    </div>
  );
}
