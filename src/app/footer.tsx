import { Link } from "lucide-react";

// app/Footer.tsx
export default function footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* 소개 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">TRIPPLANNER</h4>
          <p className="mb-2">당신의 여행을 쉽고 즐겁게 만들어주는 플랫폼.</p>
          <p className="text-gray-500">© 2025 Travel Planner. All rights reserved.</p>
        </div>

        {/* 링크 */}
        <div>
          <h4 className="text-white font-semibold mb-3">바로가기</h4>
          <ul className="space-y-2">
            <li><Link href="#">이용약관</Link></li>
            <li><Link href="#">개인정보처리방침</Link></li>
            <li><Link href="#">자주 묻는 질문</Link></li>
            <li><Link href="#">서비스 소개</Link></li>
          </ul>
        </div>

        {/* 연락처 */}
        <div>
          <h4 className="text-white font-semibold mb-3">문의</h4>
          <p>이메일: whrjswo123@naver.com</p>
          <p>전화: 010-1234-5678</p>
          <p>GitHub: <a href="https://github.com/JKJ0918/trip-planner-frontend" className="underline">https://github.com/JKJ0918/trip-planner-frontend</a></p>
        </div>

      </div>
    </footer>
  );
}
