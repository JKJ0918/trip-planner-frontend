// 알림 (댓글, 좋아요)
// SSE HOOK 

"use client";

import { useEffect } from "react";
import { NotificationDTO } from "../myPage/types/Notification";

export function useNotificationStream(onMessage: (n: NotificationDTO) => void ){

    useEffect (() => {
        // 백엔드가 같은 도메인/프록시면 이 경로로 가능
        const es = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/stream`, { withCredentials: true });

        const handle = (ev: MessageEvent) => {
            try {
                const data = JSON.parse(ev.data) as NotificationDTO;
            } catch {
                //
            }
        };

        es.addEventListener("notification", handle as EventListener);
        // "hello" 는 연결확인용이라 무시 가능
        
        es.onerror = () => {
        // 브라우저가 자동 재연결 시도함. 여기서는 표시만.
        // console.warn("SSE error — reconnecting…");
        };

        return () => {
            es.removeEventListener("notification", handle as EventListener);
            es.close();
        };

    }, [onMessage]);

}