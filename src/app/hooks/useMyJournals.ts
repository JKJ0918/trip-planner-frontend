"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error("failed");
    return r.json();
  });

export type JournalSummary = {
  id: number;
  title: string;
  // city?: string;
  // coverImage?: string;
  createdAt: string;
  // updatedAt?: string;
  // likes?: number;
  // views?: number;
};

export type JournalListResponse = {
  items: JournalSummary[]; // 페이지네이션을 고려한다면 이런 형태 추천
  total?: number;
  page?: number;
  size?: number;
};

export function useMyJournals(page = 1, size = 12) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const key = `${base}/me/journals?page=${page}&size=${size}`;

  const { data, error, isLoading, mutate } = useSWR<JournalListResponse | JournalSummary[]>(
    key,
    fetcher
  );

  // 백엔드가 배열로만 주는 경우와 {items:[]}로 주는 경우 모두 지원
  const items = Array.isArray(data) ? data : data?.items ?? [];

  return {
    journals: items,
    meta: Array.isArray(data)
      ? { total: items.length, page, size }
      : { total: data?.total, page: data?.page ?? page, size: data?.size ?? size },
    error,
    isLoading,
    refresh: mutate,
    key, // 외부에서 mutate(key) 하고 싶을 때 쓸 수 있게 노출
  };
}
