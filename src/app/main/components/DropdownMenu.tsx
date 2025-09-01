"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";

type User = {
  id?: number;
  name?: string;
  email?: string;
  socialType?: "naver" | "kakao" | "google" | "local";
} | null;

function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>(null); // 로그인 여부
  const [loading, setLoading] = useState(true); // 로딩 상태
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  

  // 1) 마운트 시 유저 정보 가져오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchUserInfo(); // 로그인 안되어 있으면 null/undefined 반환하도록 구현
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
  

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const user = await fetchUserInfo();
      const socialType = user?.socialType || "local";

      // 1. 서버 로그아웃 요청
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      // 2. 소셜 로그아웃
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
          // 추가 작업 없음
          break;
      }

      // 3. 홈으로 이동
      // router.push("/");
      window.location.replace("/"); // 새로고침
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  // 로그인 여부에 따라 분기 - 메뉴 아이템
  const menuItems = (() => {
    if (loading) return []; // 로딩 중엔 비워둠(열어도 아무것도 안 보이게)
    if (!user) {
      // 비로그인
      return [
        { label: "로그인", action: () => router.push("/login") },
        { label: "회원가입", action: () => router.push("/join") },
      ];
    }
    // 로그인
    return [
      { label: "마이페이지", action: () => router.push("/myPage") },
      { label: "로그아웃", action: handleLogout },
    ];
  })();
  const handleItemClick = async (action: () => void | Promise<void>) => {
    setOpen(false);
    await action();
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          padding: "0 6px",
        }}
      >
        &#8942;
      </button>

      {open && !loading && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            marginTop: "6px",
            minWidth: "180px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            {menuItems.map((item) => (
              <li
                key={item.label}
                onClick={() => handleItemClick(item.action)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleItemClick(item.action);
                }}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                }}
                tabIndex={0}
                role="menuitem"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;