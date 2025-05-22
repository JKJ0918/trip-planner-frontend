// app/components/Header.tsx
import Link from "next/link";
import DropdownMenu from "./main/components/DropdownMenu";

export default function header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://tailwindcss.com/_next/static/media/tailwindcss-logotype.5ca45d07.svg"
            alt="Travel Planner Logo"
            className="h-10"
          />
          <span className="text-xl font-bold text-indigo-600 select-none">
            Trip Planner
          </span>
        </div>

        <ul className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          <li>
            <a href="#" className="hover:text-indigo-600 transition">메뉴1</a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-600 transition">메뉴2</a>
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
