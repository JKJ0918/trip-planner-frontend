// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { logout } from "../utils/logout";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      // 로그아웃 성공 시 메인페이지로 이동
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
