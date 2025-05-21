// components/LogoutButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";

const LogoutButton: React.FC = () => {

  const router = useRouter();

  const handleLogout = async () => {

    try {
      const user = await fetchUserInfo();
      const socialType = user?.socialType || "local";

      // 1. 백엔드 로그아웃 요청
      await fetch("http://localhost:8080/logout",{
        method: "POST",
        credentials: "include", // 쿠키포함
      });

      // 2. 소셜 로그아웃 처리(각각)
      switch (socialType) {
        case "naver":
          // 네이버 로그아웃: 새 창 열고 쿠키 제거 유도
          window.open("https://nid.naver.com/nidlogin.logout", "_blank", "width=1,height=1");
          break;
        case "kakao":
          window.open("https://kauth.kakao.com/oauth/logout?client_id=d4763cac8fdb45bc680dcaf5597e0d61&logout_redirect_uri=http://localhost:8080/", "_blank", "width=500,height=600");
          break;
        case "google":
          window.open("https://accounts.google.com/Logout", "_blank", "width=500,height=600");
          break;
        case "local":
          // 아무 것도 안 해도 됨 (쿠키만 만료)
          break;
      }
      
      // 3. 로그아웃 후 페이지 이동
      router.push("/");
      
    } catch (error) {
      console.log("로그아웃 중 에러 발생", error);
    }

  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;