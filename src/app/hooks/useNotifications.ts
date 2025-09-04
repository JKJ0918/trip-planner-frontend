// app/hooks/useNotifications.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type MiniNotification = {
    id: number;
    message: string;
    link: string;
    createdAt: string;
    isRead?: boolean;
};

export type NotificationsController = {
    unread: number;
    items: MiniNotification[];
    refresh: () => Promise<void>;
    markRead: (id: number) => Promise<void>;
    markAllRead: () => Promise<void>;
}

export function useNotifications(base: string, opts?: { limit?: number }): NotificationsController {
    const limit = opts?.limit ?? 5;
    const [unread, setUnread] = useState(0);
    const [items, setItems] = useState<MiniNotification[]>([]);
    const creds: RequestInit = { credentials: "include" };

    const refresh = useCallback(async () => {
        const unreadJson = await fetch(`${base}/api/notifications/unread-count`, creds)
            .then(r => r.json())
            .catch(() => ({count: 0}));
        setUnread(unreadJson?.count ?? 0); // count null, undefine 처리

        const page = await fetch(`${base}/api/notifications?size=${limit}`, creds)
            .then(r => r.json())
            .catch(() => ({ content: []}));
        setItems(((page?.content ?? []) as MiniNotification[]).slice(0, limit));
    }, [base, limit]);

    useEffect(() => { refresh(); }, [refresh]);

    const markRead = async (id:number) => {
        await fetch(`${base}/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
        setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
        setUnread(v => Math.max(0, v - 1)); // 0 이하 방지
    }

    const markAllRead = async () => {
        await fetch(`${base}/api/notifications/read-all`, { method: "POST", credentials: "include" });
        setItems(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnread(0);
    };

    return { unread, items, refresh, markRead, markAllRead }; 

}