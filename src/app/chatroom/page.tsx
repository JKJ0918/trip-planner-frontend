'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useChatTargetStore } from "./stores/chatTargetStore";
import { useRouter } from "next/navigation";
import { ensureConnected, getStompClient, publish, subscribe } from "../lib/stomp";

export default function ChatRoomIndex() {
  
  const router = useRouter(); 
  const targetUser = useChatTargetStore((s) => s.targetUser);
  const clearTargetUser = useChatTargetStore((s) => s.clearTargetUser);
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [message, setMessage] = useState(""); // 첫 메시지
  const [isSending, setIsSending] = useState(false); // 전송버튼 상태관리(첫 메시지)


 // stomp 전역 관리
  const [connected, setConnected] = useState(false); // STOMP 연결
  const [roomId, setRoomId] =useState<string>('1'); // 테스트용 기본값
  const [msg, setMsg] = useState<string>('');
  const unsubRef = useRef<() => void>(() => {});

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
    let mounted = true;

    (async () => {
      try {
        console.log('[WS] connecting...');
        await ensureConnected();
        const c = getStompClient();
        console.log('[WS] connected?', !!c?.connected, c); // 콘솔에서 상태 확인
        if (mounted) setConnected(!!c?.connected);
      } catch (e) {
        console.error('[WS] connect failed', e);
        if (mounted) setConnected(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);


  if(!targetUser) {
  return (
      <div className="mx-auto flex w-full max-w-4xl items-center justify-center gap-10 px-6 py-90">
        {/* Left image */}
        <div className="w-40 shrink-0">
          <img
          src="/images/chatIcon.png"
          alt="채팅 아이콘"
          className="w-full h-auto object-cover"
          loading="lazy"
          />
          </div>

          {/* Right text */}
          <div>
          <h1 className="text-4xl font-bold text-gray-500 dark:text-white mb-3">
          다른 이용자와 대화를 진행해 보세요!
          </h1>
          <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
          대화 시작을 위해 채팅방이나 대상을 먼저 선택해 주세요.
          <br />
          이용자의 프로필을 선택하여 대화하기 버튼으로 대화를 시작할 수 있습니다.
          </p>


      <h1 className="text-xl font-bold">Chatroom (publish 테스트)</h1>
      <p>WebSocket: {connected ? '✅ Connected' : '⏳ Connecting...'}</p>

      <div className="flex items-center gap-2">
        <input
          className="border px-2 py-1 rounded"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="roomId"
        />
        <button
          className="rounded border px-3 py-1"
          onClick={() => {
            try { unsubRef.current(); } catch {}
            const dest = `/sub/chatroom/${roomId}`;
            console.log('[TEST] subscribing to', dest);
            unsubRef.current = subscribe(dest, (payload) => {
              console.log('[TEST] message on', dest, payload);
            });
          }}
        >
          방 채널 구독
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="border px-2 py-1 rounded flex-1"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="보낼 메시지"
        />
        <button
          className="rounded border px-3 py-1"
          onClick={() => {
            const dest = `/pub/message`; // 서버 설정에 맞게 조정
            publish(dest, {
              roomId,
              content: msg,
              writerId: 123, // 지금은 테스트용 (실제는 JWT/세션으로)
              createdDate: new Date(),
            });
            setMsg('');
          }}
        >
          전송
        </button>
      </div>

      <p className="text-sm text-gray-500">
        * 방 채널을 구독한 상태에서 "전송"을 누르면 콘솔에 곧바로 수신 로그가 찍혀야 합니다.
      </p>

        </div>
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
