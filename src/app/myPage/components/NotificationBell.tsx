"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * NotificationsTable — Left description / Right table
 * - Matches the My Journals table styling (light theme + indigo accent)
 * - Error banner, skeleton, empty state
 * - Actions: 보기(링크 이동), 읽음 처리, 모두 읽음
 * - Simple pagination (Prev/Next)
 */

type NotificationItem = {
  id: number;
  message: string;
  link?: string;
  createdAt: string; // ISO
  isRead?: boolean;
};

type PageResp<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-based)
  size: number;
};

export default function NotificationsTable() {
  const router = useRouter();
  const [page, setPage] = useState(0); // 0-based
  const [size] = useState(12);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const creds: RequestInit = { credentials: "include" };

  const fmt = (s: string) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(s));

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications?page=${page}&size=${size}`, creds);
      if (!res.ok) throw new Error("알림을 불러오지 못했습니다.");
      const json: PageResp<NotificationItem> = await res.json();
      setItems(json.content ?? []);
      setTotalPages(json.totalPages ?? 0);
    } catch (e: any) {
      setError(e?.message ?? "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const markRead = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllRead = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/read-all`, { method: "POST", credentials: "include" });
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const disablePrev = page <= 0;
  const disableNext = page >= Math.max(0, totalPages - 1);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: section description */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        <p className="mt-1 text-sm text-gray-500">
          최근 알림을 시간순으로 확인합니다. 항목을 클릭하면 관련 페이지로 이동합니다.
        </p>
      </section>

      {/* Right: table content */}
      <section className="lg:col-span-2">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700">{error}</div>
        )}

        {/* Empty state */}
        {!error && !loading && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            아직 알림이 없습니다.
          </div>
        )}

        {/* Header actions */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-500">총 페이지: {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              모두 읽음
            </button>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="sticky left-0 bg-gray-50 text-left px-4 py-3 font-medium">내용</th>
                <th className="text-left px-4 py-3 font-medium">발생일</th>
                <th className="text-center px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium">액션</th>
              </tr>
            </thead>

            {/* Loading skeleton */}
            {loading && (
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-block h-8 w-24 bg-gray-100 animate-pulse rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}

            {/* Data rows */}
            {!loading && items.length > 0 && (
              <tbody className="divide-y divide-gray-100">
                {items.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    {/* Message */}
                    <td className="px-4 py-3 align-middle">
                      {n.link ? (
                        <Link href={n.link} className="group inline-block max-w-[38rem]">
                          <span className={`font-medium text-gray-900 group-hover:text-indigo-600 group-hover:underline line-clamp-2 break-words ${n.isRead ? "font-normal text-gray-800" : ""}`}>
                            {n.message}
                          </span>
                        </Link>
                      ) : (
                        <span className={`font-medium text-gray-900 line-clamp-2 break-words ${n.isRead ? "font-normal text-gray-800" : ""}`}>
                          {n.message}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-600 align-middle">{fmt(n.createdAt)}</td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center align-middle">
                      {n.isRead ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">확인</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">미확인</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right align-middle">
                      <div className="inline-flex gap-2">
                        {n.link && (
                          <Link
                            href={n.link}
                            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          >
                            보기
                          </Link>
                        )}
                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                          >
                            읽음
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            disabled={disablePrev}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-2 py-1 text-sm text-gray-600">
            {totalPages === 0 ? '1 / 1' : `${page + 1} / ${totalPages}`}
          </span>
          <button
            disabled={disableNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </section>
    </div>
  );
}
