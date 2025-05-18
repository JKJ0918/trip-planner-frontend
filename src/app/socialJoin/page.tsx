// socialJoin.tsx 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const socialJoin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  // 추가 정보 입력 필요시 username 참고


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 백엔드에 전송
    await fetch("http://localhost:8080/api/user/additional-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include", // 쿠키 로그인이라면 필요
      },
      body: JSON.stringify({ username }),
    });

    // 추가정보 입력 완료 후 메인으로 이동
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold">추가 정보 입력</h1>
        <h2>이제 사용하실 아이디를 작성하시고. 여행계획을 만드실 수 있습니다.</h2>

        <div>
          <label className="block mb-1 font-medium">아이디</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          제출하기
        </button>
      </form>
    </div>
  );
};

export default socialJoin;
