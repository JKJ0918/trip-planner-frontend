'use client';

import { useEffect, useState } from 'react';
import ProfilePanel from './components/ProfilePanel';
import MyJourney from './components/myJournals';
import NotificationBell from './components/NotificationBell';
import { useMe } from '../hooks/useMe';
import LikedPostsPage from './components/LikedPostsPage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const sections = [
  '프로필',
  '내가 쓴 여행일지',
  '알림',
  '좋아요한 게시물',
  '채팅',
]; 

export default function MyPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const [activeSection, setActiveSection] = useState<string>('프로필');
  const { me, isLoading, error /*, refresh*/ } = useMe();
  const [nickname, setNickname] = useState<string>(""); // 전달 받은 Props
  const [email, setEmail] =useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const resolvedAvatar = avatarUrl
  ? avatarUrl.startsWith("http")
    ? avatarUrl                // 절대경로 그대로 사용
    : `${base}${avatarUrl}`    // 상대경로면 base 붙이기
  : `${base}/uploads/basic_profile.png`;
  
  const router = useRouter();

  //useMe(), me 로드
  useEffect(() => {
    if(me?.nickname) {
       setNickname(me.nickname);
       setEmail(me.email);
       setAvatarUrl(me.avatarUrl);
       
    }
  }, [me]);

  const renderSection = () => {
    switch (activeSection) {
      case '프로필':
        // ProfilePanel 닉네임 저장 성공시 상단에 반영
        return <ProfilePanel userNickname={(nick) => setNickname(nick)} />;
      case '내가 쓴 여행일지':
        return <MyJourney />;
      case '알림':
        return <NotificationBell />;
      case '좋아요한 게시물':
        return <LikedPostsPage />;
      case '채팅':
        router.push("/myPage/chatroom");
        return null;   // 우측에 아무것도 안 그림
      default:
        return <div>선택된 섹션이 없습니다.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <aside className="w-72 p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
            <img
              src={resolvedAvatar}
              alt="프로필 이미지"
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            {isLoading ? '불러오는 중…' : (nickname || '닉네임 없음')}
          </h2>
          <p className="text-sm text-gray-500">
            {isLoading ? '불러오는 중…' : (email || '이메일 없음')}
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) =>
            section === "채팅" ? (
              <Link
                key={section}
                href="/myPage/chatroom"
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                {section}
              </Link>
            ) : (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition ${
                  activeSection === section ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                {section}
              </button>
            )
          )}
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