// app/components/Header.tsx
"use client";

import Link from "next/link";
import DropdownMenu from "./main/components/DropdownMenu";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  // 특정 페이지 header 제외
  const pathname = usePathname();
  const hideHeaderPages = ['/maps'];
  if (hideHeaderPages.includes(pathname)) return null;


  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* 로고 */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Travel Planner Logo"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-gray-500 hidden sm:inline-block">
              {/* 로고 옆 문장 넣을 수 있는 곳 */}
            </span>
          </div>
        </Link>

        {/* 메뉴 */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium text-sm">
          <li>
            <Link href="/main" className="hover:text-indigo-600 transition">계획 하기</Link>
          </li>
          <li>
            <Link href="/posts" className="hover:text-indigo-600 transition">여행 일정</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-indigo-600 transition">맛집&명소 등록</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-indigo-600 transition">이용 가이드</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-indigo-600 transition">문의하기</Link>
          </li>
        </ul>

        {/* 프로필 드롭다운 */}
        <div className="hidden md:block">
          <DropdownMenu />
        </div>

        {/* 모바일 메뉴 아이콘 (향후 드로어 메뉴용) */}
        <div className="md:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </div>
      </nav>
    </header>
  );
}
