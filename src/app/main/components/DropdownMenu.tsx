"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";
import { useMe } from "@/app/hooks/useMe";
import { NotificationPreviewPanel } from "@/app/myPage/components/NotificationPreview";
import { useNotifications } from "@/app/hooks/useNotifications";
import { useLogout } from "@/app/hooks/useLogout";
import { useAuthStore } from "@/app/util/useAuthStore";

type User = {
  id?: number;
  name?: string;
  email?: string;
  socialType?: "naver" | "kakao" | "google" | "local";
} | null;

export default function DropDownMenu() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { me, isLoading, error } = useMe(); // 로그인 사용자 정보 (nickname, email, avatarUrl 등)
  const [open, setOpen] = useState(false); // 드롭다운 메뉴
  const ref = useRef<HTMLDivElement | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const {handleLogout} = useLogout(); // 로그아웃

  // API BASE (말미 슬래시 제거)
  const baseRaw = process.env.NEXT_PUBLIC_API_BASE ?? "";
  const base = baseRaw.replace(/\/$/, "");

  // 알람 공유 훅
  const notif = useNotifications(base, {limit: 5});

  // 상대/절대 URL 해석
  const resolve = (p?: string | null) => 
    p ? (p.startsWith("http") ? p : `${base}${p}`) : undefined;

  const avatar = resolve(me?.avatarUrl) ?? `${base}/uploads/basic_profile.png`;

  // 바깥 클릭으로 드롭다운 닫기
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);


  // 로그인 상태 조회 (기존 로직 재사용)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchUserInfo();
        if (mounted) setUser(me ?? null);
        // 유저 socialType zustand에 저장
        if(me){
            useAuthStore.getState().setSocialType(me.socialType);
        }

      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 로딩 상태
  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }
  
  // 비로그인
  if (error || !me) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => router.push("/login")}
          className="px-3 h-9 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
        >
          로그인
        </button>
        <button
          onClick={() => router.push("/join")}
          className="px-3 h-9 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
        >
          회원가입
        </button>
      </div>
    );
  }

  // 로그인: 아바타 + 드롭다운
  return (
    <div className="relative" ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* 아바타 + 빨간 배지 */}
      <button
        className="relative"
        onClick={() => { setOpen(o => !o); if (open) setShowNotif(false); }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="내 프로필" className="w-8 h-8 rounded-full object-cover" />
        {notif.unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600
                       text-white text-[11px] leading-[18px] text-center"
            aria-label={`읽지 않은 알림 ${notif.unread}개`}
          >
            {notif.unread > 99 ? "99+" : notif.unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2">
            <div className="text-sm truncate">{me.nickname}님, 안녕하세요</div>
          </div>
          <nav className="py-1 text-sm">
            {/* 알림 항목 + 오른쪽 배지 */}
            <button
              className="w-full px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-between"
              onClick={() => setShowNotif(v => !v)}
            >
              <span>알림</span>
              {notif.unread > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 text-white text-xs px-1">
                  {notif.unread > 99 ? "99+" : notif.unread}
                </span>
              )}
            </button>
            {/* 채팅 탭 */}
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
                    onClick={() => router.push("/chatroom")}>
              채팅
            </button>
            {/* 마이페이지 탭 */}
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
                    onClick={() => router.push("/myPage")}>
              마이페이지
            </button>
            {/* 로그아웃 탭 */}
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
                    onClick={() => handleLogout('/')}>
              로그아웃
            </button>
          </nav>
        </div>
      )}

      {/* 미리보기 패널에 공유 상태 주입 */}
      {open && showNotif && (
        <NotificationPreviewPanel
          base={base}
          controller={notif}                         // ← 같은 상태 공유
          mypageHref="/myPage?tab=notifications"
          onClose={() => { setShowNotif(false); setOpen(false); }}
        />
      )}
    </div>
  );
}