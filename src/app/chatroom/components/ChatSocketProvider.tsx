"use client";

// 앱이 실행될 때 WebSocket 연결 & 구독을 세팅

import { ReactNode, useEffect } from "react";
import { RoomSummary, useChatStore } from "../stores/chatStore";
import { ensureConnected, subscribe } from "@/app/lib/stomp";


export default function ChatSocketProvider({ children }: { children: ReactNode }) {
  const setSummaries = useChatStore((s) => s.setSummaries);
  const applySummary = useChatStore((s) => s.applySummary);

    useEffect(() => {
    let unsub: () => void;

    (async () => {
      // 1) 초기 목록 불러오기
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chatList2`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("chatList2 fetch failed");
        const data: RoomSummary[] = await res.json();
        console.log("[INIT] chatList2", data);
        setSummaries(data);
      } catch (e) {
        console.error("[INIT] failed to load chatList2", e);
      }

      // 2) 웹소켓 연결 보장
      await ensureConnected();

      // 3) 실시간 요약 이벤트 구독
      unsub = subscribe("/user/queue/chatrooms/summary", (dto: any) => {
        try {
          const parsed = dto as RoomSummary;
          console.log("[Summary event]", parsed);
          applySummary(parsed);
        } catch (e) {
          console.warn("parse error", e, dto);
        }
      });
    })();

    return () => {
      try { unsub?.(); } catch {}
    };
  }, [applySummary, setSummaries]);

  return <>{children}</>;
  
}
