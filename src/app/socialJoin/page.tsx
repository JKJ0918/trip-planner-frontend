'use client'
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import { nicknameCheck } from "../join/utils/nicknameCheck";

export default function SocialJoin() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  const [nStatus, setNStatus] = useState<"idle"|"checking"|"ok"|"taken"|"error">("idle");
  const [nMsg, setNMsg] = useState<string>("");

  // 닉네임 중복검사 함수
  async function handleCheckNickname() {
    if (!nickname) {
      return;
    }
    setNStatus("checking");
    setNMsg("");

    try {
      const { available, message } = await nicknameCheck(nickname.trim());
      if (available) {
        setNStatus("ok");
        setNMsg(message ?? "사용 가능한 닉네임입니다.");
      } else {
        setNStatus("taken");
        setNMsg(message ?? "이미 사용 중인 닉네임입니다.");
      }
    } catch (e) {
      setNStatus("error");
      setNMsg("확인 중 오류가 발생했습니다.");
    }
  }

  // 제출 버튼 활성화 조건
  const canSubmit = nStatus === "ok" && nickname.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return; // 안전망

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/additional-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nickname }),
      });

      if (res.status === 409) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }

      if (res.ok) {
        router.push("/main");
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
        {/* 닉네임 입력 */}
        <div className="flex flex-col">
          <label className="text-sm-bold font-medium text-slate-800 mb-1.5">닉네임</label>
          <p className="text-sm font-medium text-slate-400">사용하실 닉네임을 입력하시고, 홈페이지를 이용하세요.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter nickname"
              className={`h-11 flex-1 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2
                ${nStatus === "ok" ? "focus:ring-green-500" :
                  nStatus === "taken" || nStatus === "error" ? "focus:ring-red-500" :
                  "focus:ring-blue-500"}`}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNStatus("idle");
                setNMsg("");
              }}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={!nickname || nStatus === "checking"}
              className={`h-10 shrink-0 rounded-lg border px-3 text-sm font-medium
                ${nStatus === "checking" ? "bg-gray-100 text-gray-500 cursor-wait" : "hover:bg-gray-50"}`}
            >
              {nStatus === "checking" ? "확인중..." : "중복검사"}
            </button>
          </div>
          {nMsg && (
            <p className={`mt-1 text-xs ${
              nStatus === "ok" ? "text-green-600" :
              nStatus === "taken" || nStatus === "error" ? "text-red-600" : "text-gray-500"
            }`}>
              {nMsg}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 rounded text-white text-sm font-medium
            ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
        >
          생성하기
        </button>
      </form>
    </div>
  );
}
