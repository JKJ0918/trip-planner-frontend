// 벨(알람 아이콘) 컴포넌트

"use client"

import { useCallback, useEffect, useState } from "react";
import { NotificationDTO } from "../types/Notification";
import { useNotificationStream } from "@/app/hooks/useNotificationStream";

export default function NotificationBell() {

    const [unread, setUnread] = useState(0);
    const [open, setOpen] = useState(false);
    const [items, setItems] =useState<NotificationDTO[]>([]);

    // 1) 초기 미확인 수 & 첫 페이지 목록
    useEffect(() => {
        (async () => {
            const c = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/unread-count`, { credentials: "include" })
                .then(r => r.json());
            setUnread(c.count ?? 0);

            const page = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications?size=10`, { credentials: "include" })
                .then(r => r.json());
            // page.content 형태라고 가정
            setItems(page.content ?? []);
            console.log("댓글목록 확인"+items);
        })();
    }, []);

    // 2) 실시간 수신
    const onMessage = useCallback((n: NotificationDTO) => {
        setUnread(v => v + 1);
        setItems(prev => [n, ...prev]);
        // 토스트필요시 작성
    }, []);
    useNotificationStream(onMessage);

    // 3) 개별 읽음 처리
    const markRead = (async (id: number) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/${id}/read`, {
            method: "POST",
            credentials: "include",
        });
        setItems(prev => prev.map(x => x.id === id ? { ...x, isRead: true } : x));
        setUnread(v => Math.max(0, v - 1))
    })

    // 4) 모두 읽음
    const markAllRead = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/read-all`, {
            method: "POST",
            credentials: "include",
        });
        setItems(prev => prev.map(x => ({ ...x, isRead: true })));
        setUnread(0);
    };

    return (
    <div className="relative">
        <button className="relative" onClick={() => setOpen(o => !o)} aria-label="notifications">
        🔔
        {unread > 0 && (
            <span className="absolute -top-1 -right-2 rounded-full bg-red-500 text-white text-xs px-1">
            {unread}
            </span>
        )}
        </button>

        {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-lg border bg-white shadow">
            <div className="flex items-center justify-between px-3 py-2 border-b">
            <strong>알림</strong>
            <button onClick={markAllRead} className="text-sm text-blue-600">모두 읽음</button>
            </div>
            <ul className="divide-y">
            {items.map(it => (
                <li key={it.id}>
                <button
                    className={`w-full text-left px-3 py-2 ${it.isRead ? "bg-white" : "bg-blue-50"}`}
                    onClick={() => {
                    markRead(it.id);
                    // 라우팅 처리: it.link로 이동
                    window.location.href = it.link;
                    }}
                >
                    <div className="text-sm">{it.message}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(it.createdAt).toLocaleString()}
                    </div>
                </button>
                </li>
            ))}
            </ul>
            {items.length === 0 && <div className="p-4 text-sm text-gray-500">알림이 없습니다.</div>}
        </div>
        )}
    </div>
    );
}