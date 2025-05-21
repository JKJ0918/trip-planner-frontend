// pages/index.tsx

import React from "react";
import DropdownMenu from "./components/DropdownMenu"; // 개인메뉴 드롭다운
import LogoutButton from "./components/LogoutButton";

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* 로고 */}
          <div className="flex items-center space-x-4">
            <img
              src="https://tailwindcss.com/_next/static/media/tailwindcss-logotype.5ca45d07.svg"
              alt="Travel Planner Logo"
              className="h-10"
            />
            <span className="text-xl font-bold text-indigo-600 select-none">Trip Planner</span>
          </div>

          {/* 메뉴 */}
          <ul className="hidden md:flex space-x-8 text-gray-700 font-semibold">
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                메뉴1
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                메뉴2
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                메뉴3
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                메뉴4
              </a>
            </li>
          </ul>

          {/* 개인메뉴 (DropdownMenu 컴포넌트) */}
          <div className="hidden md:block">
            <DropdownMenu />
          </div>
        </nav>
      </header>

      {/* 중앙 메인 콘텐츠 */}
      <main className="flex-grow bg-gradient-to-r from-indigo-50 to-white flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 leading-tight">
            항공 숙소 식당 <br />
            당신만의 여정을 만들어보세요
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            당신의 여행 준비를 쉽고 빠르게, <br />
            체계적으로 도와드립니다.
          </p>
          <a
            href="#"
            className="inline-block rounded-md bg-indigo-600 px-8 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
          >
            항공권
          </a>
        </div>
      </main>
      <LogoutButton/>
      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm select-none">
          <p>Contact us: travelplanner@example.com | 전화: 010-1234-5678</p>
          <p className="mt-1">© 2025 Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
