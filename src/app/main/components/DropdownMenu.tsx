"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";
import { useMe } from "@/app/hooks/useMe";

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

  // API BASE (말미 슬래시 제거)
  const baseRaw = process.env.NEXT_PUBLIC_API_BASE ?? "";
  const base = baseRaw.replace(/\/$/, "");

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

  const handleLogout = async () => {
    try {
      const me = await fetchUserInfo();
      const socialType = me?.socialType || "local";

      // 1) 서버 로그아웃
      await fetch(`${base}/logout`, { method: "POST", credentials: "include", });

      // 2) 소셜 로그아웃
      switch (socialType) {
        case "naver":
          window.open("https://nid.naver.com/nidlogin.logout", "_blank", "width=1,height=1");
          break;
        case "kakao":
          window.open(
            "https://kauth.kakao.com/oauth/logout?client_id=d4763cac8fdb45bc680dcaf5597e0d61&logout_redirect_uri=http://localhost:8080/",
            "_blank",
            "width=500,height=600"
          );
          break;
        case "google":
          window.open("https://accounts.google.com/Logout", "_blank", "width=500,height=600");
          break;
        case "local":
          break;
      }

      // 홈으로 이동(새로고침)
      window.location.replace("/");
    } catch (e) {
      console.error("로그아웃 중 에러:", e);
    }
  };

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
      <img
        src={avatar}
        alt="내 프로필"
        className="w-8 h-8 rounded-full object-cover cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg overflow-hidden">
          <div className="px-3 py-2 ">
            <div className="text-sm truncate">{me.nickname}님, 안녕하세요</div>
          </div>
          <nav className="py-1 text-sm">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
              onClick={() => router.push("/myPage")}
            >
              마이페이지
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"              onClick={handleLogout}
            >
              로그아웃
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}