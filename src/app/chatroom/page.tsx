'use client';

import { useCallback, useEffect, useState } from "react";
import { useChatTargetStore } from "./stores/chatTargetStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChatRoomIndex() {
  
  const router = useRouter(); 
  const targetUser = useChatTargetStore((s) => s.targetUser);
  const clearTargetUser = useChatTargetStore((s) => s.clearTargetUser);
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [message, setMessage] = useState(""); // 첫 메시지
  const [isSending, setIsSending] = useState(false); // 전송버튼 상태관리(첫 메시지)

  // 전송 버튼 클릭 -> 방 생성 + 첫 메시지 전송
  const handleSendClick = useCallback(async () => {
    // 기본 검증 : 대상자/ 메시지 없으면 막기
    if (!targetUser) {
        return;
    }
    console.log("targetUserId 확인 : ", targetUser.id, targetUser.nickname, targetUser.avatarUrl);
    const trimmed = message.trim();
    if (!trimmed) {
        return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/create`,{
          method: "POST",
          headers: {"Content-Type" : "application/json" },
          credentials: "include",
          body: JSON.stringify({
              targetUserId: targetUser.id,
              firstMessage: trimmed, // 첫 메시지 함께 전송 
          }),
      });

      // 200/201/409 모두 roomId만 있으면 성공 처리
      if(!res.ok && res.status !== 409) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `요청 실패: ${res.status}`);  
      }
      const data = await res.json().catch(() => ({}));
      const roomId = data?.roomId;
      if(!roomId) {
          throw new Error("응답에 roomId가 없습니다.");
      }

      clearTargetUser(); // 채팅 대상 초기화
      router.push(`/chatroom/${roomId}`); // 생성/재사용된 방으로 이동
    } catch (e: any) {
          setError(e.message ?? "알 수 없는 오류가 발생했습니다.");
          setIsSending(false);
    }

  }, [clearTargetUser, message, router, targetUser]);


  useEffect(() => {
    // 여긴 일단 빈칸. 다음 단계에서 필요 시 추가
  }, []);

  if(!targetUser) {
    return (
      <div className="max-w-lg mx-auto py-10">
        <h1 className="text-xl font-semibold mb-4">새 1:1 채팅</h1>
        <p className="text-gray-600">
          대상을 먼저 선택해 주세요. 댓글 작성자의 이름을 클릭해 &rarr; <b>1:1 채팅</b>을 누르면 이 화면으로 이동합니다.
        </p>
        <Link href="/posts" className="text-blue-600 hover:underline mt-4 inline-block">
          목록으로 돌아가기 (구현 예정)
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">새 1:1 채팅</h1>

      {/* 대상자 카드 */}
      <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        {/* 아바타 */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {targetUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={targetUser.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-gray-500">No Img</span>
          )}
        </div>
        {/* 텍스트 */}
        <div>
          <div className="font-semibold">{targetUser.nickname}</div>
        </div>
      </div>

      {/* 첫 메시지 입력 */}
      <label className="block text-sm font-medium text-gray-700 mb-2">첫 메시지</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="안녕하세요! 메시지를 입력하세요."
        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* 전송/에러 UI */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-red-600 h-5">{error ?? ""}</div>
        <button
          type="button"
          onClick={handleSendClick}
          disabled={!message.trim() || !targetUser || isSending}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          aria-label="첫 메시지 전송"
        >
          {isSending ? "전송 중..." : "전송"}
        </button>
      </div>
    </div>
  );
}
