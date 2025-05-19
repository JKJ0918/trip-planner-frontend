// socialJoin.tsx 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const socialJoin = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  // 추가 정보 입력 필요시 username 참고


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8080/api/user/additional-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ 헤더 밖으로 이동
      body: JSON.stringify({ nickname }),
    });

    if (res.status === 409) {
      const message = await res.text(); // 백엔드에서 보낸 에러 메시지
      alert("이미 사용 중인 아이디입니다."); // 사용자에게 알림
      return;
    }

    if (res.ok) {
      router.push("/main"); // 성공 시 메인 페이지로 이동
    } else {
      const message = await res.text();
      alert("에러 발생: " + message);
    }
  } catch (error) {
    console.error("요청 실패:", error);
    alert("서버와 연결할 수 없습니다.");
  }
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
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
