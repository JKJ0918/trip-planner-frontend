"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";

function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  const handleItemClick = async (item: string) => {
    setOpen(false);
    if (item === "Sign out") {
      await handleLogout();
    } else {
      alert(`${item} clicked`);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
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

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            marginTop: "6px",
            minWidth: "150px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            {["Account settings", "Support", "License", "Sign out"].map((item) => (
              <li
                key={item}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleItemClick(item);
                }}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                }}
                tabIndex={0}
                role="menuitem"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
