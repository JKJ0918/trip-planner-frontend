"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationsController, useNotifications } from "@/app/hooks/useNotifications";

export type MiniNotification = {
  id: number;
  message: string;
  link: string;
  createdAt: string;
  isRead?: boolean;
};

type Props = {
  base: string;
  mypageHref?: string;         // default: "/myPage?tab=notifications"
  onClose?: () => void;
  limit?: number;              // default: 5
  controller?: NotificationsController;
};

export function NotificationPreviewPanel({
  base,
  mypageHref = "/myPage?tab=notifications",
  onClose,
  limit = 5,
  controller,
}: Props) {
  // ✅ 훅은 항상 호출
  const localState = useNotifications(base, { limit });
  // ✅ 외부 controller가 있으면 그걸 쓰고, 없으면 로컬 훅 결과 사용
  const { unread, items, markRead, markAllRead } = controller ?? localState;

  const router = useRouter();

  return (
    <div
      className="absolute right-full top-10 mr-37 w-80 max-h-96 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-50"
      role="dialog"
      aria-label="알림 미리보기"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <strong className="text-gray-900">알림</strong>
        <button onClick={markAllRead} className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer">
          모두 읽음
        </button>
      </div>

      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${it.isRead ? "bg-white" : "bg-blue-50"}`}
              onClick={async () => {
                await markRead(it.id);
                onClose?.();
                router.push(it.link);
              }}
            >
              <div className="text-sm text-gray-900 line-clamp-2">{it.message}</div>
              <div className="text-xs text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && <div className="p-4 text-sm text-gray-500">알림이 없습니다.</div>}

      <div className="sticky bottom-0 bg-white px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">미확인 {unread}개</span>
        <Link href={mypageHref} className="text-sm text-indigo-600 hover:text-indigo-500" onClick={onClose}>
          자세히
        </Link>
      </div>
    </div>
  );
}
