"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "./utils/login";
import SocialLoginButton from "./components/SocialLoginButton";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await Login(username, password);
    if (success) {
      window.location.replace("/main"); // 로그인 성공시 새로고침 기능
      // router.push("/main");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full p-8 bg-white rounded-3xl shadow-2xl">
        {/* 로그인 영역 */}
        <div className="p-8">
          <h3 className="text-3xl font-bold text-slate-800 mb-2">
            당신만의 여행을 계획하세요
          </h3>
          <p className="text-slate-500 mb-10 text-sm">
            빠르고 간편한 비교를 통해 여행을 손쉽게 계획하세요.
          </p>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                아이디
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-sm text-blue-600 hover:underline">
              <a href="#">비밀번호를 잊으셨나요?</a>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition"
              onClick={handleLogin}
            >
              로그인 하기
            </button>

            <p className="text-center text-sm text-slate-500">
              계정이 없으신가요?{' '}
              <Link href="/join">
                <span className="text-blue-600 hover:underline font-medium">
                  회원가입
                </span>
              </Link>
            </p>
          </form>

          <div className="flex items-center my-6 gap-4">
            <hr className="w-full border-slate-300" />
            <span className="text-sm text-slate-400">또는</span>
            <hr className="w-full border-slate-300" />
          </div>

          <SocialLoginButton />

          <p className="text-xs text-center mt-6 text-slate-400">
            계속 진행하시면 TripPlanner의 서비스 약관 및 개인정보처리방침에 동의하시는 것으로 간주됩니다.
          </p>
        </div>

        {/* 이미지 영역 */}
        <div className="hidden md:block">
          <img
            src="/images/plannerlogin.jpg"
            alt="login visual"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
