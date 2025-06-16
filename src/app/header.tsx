// app/components/Header.tsx
import Link from "next/link";
import DropdownMenu from "./main/components/DropdownMenu";

export default function header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <Link href={"/"}>
          <img
            src="/images/logo.png"
            alt="Travel Planner Logo"
            className="h-8"
          />
          </Link>
        </div>

        <ul className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          <li>
            <a href="http://localhost:3000/posts" className="hover:text-indigo-600 transition">여행 일정</a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-600 transition">맛집&명소 등록</a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-600 transition">메뉴3</a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-600 transition">메뉴4</a>
          </li>
        </ul>

        <div className="hidden md:block">
          <DropdownMenu />
        </div>
      </nav>
    </header>
  );
}
