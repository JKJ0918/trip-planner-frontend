'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProfilePanel from './components/ProfilePanel';

const sections = [
  '프로필',
  '내가 쓴 여행일지',
  '저장한 여행 플랜',
  '알림',
  '좋아요한 게시물',
  '설정',
];

export default function MyPage() {
  const [activeSection, setActiveSection] = useState<string>('프로필');

  const renderSection = () => {
    switch (activeSection) {
      case '프로필':
        return <ProfilePanel />;
      case '내가 쓴 여행일지':
        return <div>작성한 여행일지 목록</div>;
      case '저장한 여행 플랜':
        return <div>저장된 여행 플랜 리스트</div>;
      case '알림':
        return <div>알림 목록</div>;
      case '좋아요한 게시물':
        return <div>좋아요한 게시물 목록</div>;
      case '설정':
        return <div>비밀번호 변경 및 계정 설정</div>;
      default:
        return <div>선택된 섹션이 없습니다.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <aside className="w-72 p-6 bg-white border-r shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            <Image src="/profile.jpg" alt="프로필 이미지" width={96} height={96} className="w-full h-full object-cover" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">홍길동</h2>
          <p className="text-sm text-gray-500">여행을 사랑하는 개발자</p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition ${
                activeSection === section ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </aside>

      {/* 우측 콘텐츠 */}
      <main className="flex-1 p-8">
        <h3 className="text-2xl font-bold mb-4">{activeSection}</h3>
        <div>{renderSection()}</div>
      </main>
    </div>
  );
}