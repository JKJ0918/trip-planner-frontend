// hooks/useRoomChannel.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../chatroom/stores/chatStore";
import { subscribe } from "../lib/stomp";
import { ChatMessage, useMessageStore } from "../chatroom/stores/messageStore";

type MessageDto = {
  id: string | number;
  roomId: string | number;
  writerId: number;
  content: string;
  createdAt: string;
};

export function useRoomChannel(roomId: string | number) {
  const applySummary = useChatStore((select) => select.applySummary);
  const setMessages = useMessageStore((select) => select.setMessages);
  const appendMessage = useMessageStore((select) => select.appendMessage);

  useEffect(() => {
    if (!roomId) return;

    
    // 1) 초기 메시지 불러오기
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/find/chat/list/` + roomId, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("fetch fail");
        const data: ChatMessage[] = await res.json();
        console.log("[ROOM] initial messages", data);

        const prev = useMessageStore.getState().messages[roomId] || [];
      if (prev.length === 0) {
        setMessages(roomId, data);
      }

        // setMessages(roomId, data);
      } catch (e) {
        console.error("[ROOM] load messages failed", e);
      }
    })();

    // 2) 실시간 구독
    const dest = `/sub/chatroom/${roomId}`;
    const unsub = subscribe(dest, (payload: any) => { // 자바스크립트에서는 안쓰는 함순는 생략이 가능함
      const msg = payload as ChatMessage;
      console.log("[ROOM] realtime msg:", msg);

      appendMessage(roomId, msg); // from messageStore.ts

      // 사이드바 요약 갱신  from chatStore.ts
      applySummary({
        roomId: msg.roomId,
        lastMessage: msg.content,
        lastMessageAt: msg.createdDate,
      } as any);
    });4

    return () => {
      try { unsub(); } catch {} // 구독해제 cleanup 함수
    };
  }, [roomId]);
}
