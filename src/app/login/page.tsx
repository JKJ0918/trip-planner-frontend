"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "./utils/login";
import SocialLoginButton from "./components/SocialLoginButton";


export default function LoginPage() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await Login(username, password);
    if (success) {
      router.push("/main");
    }
  };


  return (
    <div className="min-h-screen flex fle-col items-center justify-center">
        <div className="py-6 px-4">
            <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                    <form className="space-y-6">
                    <div className="mb-12">
                        <h3 className="text-slate-900 text-3xl font-semibold">당신만의 여행 계획하세요</h3>
                        <p className="text-slate-500 text-sm mt-6 leading-relaxed">빠르고 간편한 비교를 통해 여행을 손쉽게 계획하세요</p>
                    </div>

                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">아이디</label>
                        <div className="relative flex items-center">
                        <input 
                            name="username"
                            type="text" 
                            required 
                            className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                        </svg>
                        </div>
                    </div>
                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">비밀번호</label>
                        <div className="relative flex items-center">
                        <input 
                            name="password"
                            type="password" 
                            required 
                            className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                        </svg>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="text-sm">
                        <a href="jajvascript:void(0);" className="text-blue-600 hover:underline font-medium">
                            비밀번호를 잊으셨나요?
                        </a>
                        </div>
                    </div>

                    <div className="!mt-12">
                        <button type="button" className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        onClick={handleLogin}>
                        로그인 하기
                        </button>
                        <p className="text-sm !mt-6 text-center text-slate-500">계정이 없으신가요? <a href="javascript:void(0);" className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap">회원가입</a></p>
                    </div>
                    </form>

                    <div className="my-4 flex items-center gap-4">
                    <hr className="w-full border-slate-300" />
                    <p className="text-sm text-slate-800 text-center">or</p>
                    <hr className="w-full border-slate-300" />
                    </div>

                    <div className="flex flex-col space-y-3">
                    <SocialLoginButton /> {/*소셜 로그인 버튼*/}
                    </div>
                    
                </div>

                <div className="max-md:mt-8">
                    <img src="/images/plannerlogin.png" className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover" alt="login img" />
                </div>


            </div>
        </div>
    </div>
  );
}

