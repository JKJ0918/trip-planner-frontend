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
  createdAt: string;
  likeCount?: number;
  views?: number;
};

/**
 * 지원하는 응답 케이스
 * A) Spring Page: { content, totalPages, totalElements, number(0-based), size }
 * B) 커스텀:      { items, total(=총 아이템 수 or 총 페이지 수), page(1-based or 0-based), size }
 * C) 배열만:      JournalSummary[]
 */
type SpringPage<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // 0-based
  size: number;
};

type CustomPage<T> = {
  items: T[];
  total?: number; // 총 아이템 수(주로) 또는 총 페이지 수(드묾)
  page?: number;  // 0-based 또는 1-based
  size?: number;
};

export function useMyJournals(page = 0, size = 12) {
  // 백엔드가 Spring Pageable을 쓰는 경우 대부분 0-based 이므로 0-based로 통일
  const key = `${process.env.NEXT_PUBLIC_API_BASE}/me/journals?page=${page}&size=${size}`;

  const { data, error, isLoading, mutate } = useSWR<
    SpringPage<JournalSummary> | CustomPage<JournalSummary> | JournalSummary[]
  >(key, fetcher);

  // 표준화: items, page(0-based), size, totalItems, totalPages
  let items: JournalSummary[] = [];
  let normPage = page;      // 0-based
  let normSize = size;
  let totalItems = 0;
  let totalPages = 1;

  if (Array.isArray(data)) {
    // C) 배열만: 페이징 없음(1페이지 취급)
    items = data;
    totalItems = data.length;
    totalPages = 1;
  } else if (data && "content" in data) {
    // A) Spring Page
    const d = data as SpringPage<JournalSummary>;
    items = d.content ?? [];
    normPage = d.number ?? page;         // 이미 0-based
    normSize = d.size ?? size;
    totalItems = d.totalElements ?? items.length;
    totalPages = Math.max(1, d.totalPages ?? 1);
  } else if (data && "items" in data) {
    // B) 커스텀
    const d = data as CustomPage<JournalSummary>;
    items = d.items ?? [];

    // page: 0-based/1-based 모호 → size/total 이용해 totalPages 계산
    // 페이지 표기는 UI에서 1-based로 보여주니, 내부는 0-based로 사용
    normSize = d.size ?? size;

    // total이 "총 아이템 수"라고 가정(보편적)
    // 만약 백엔드가 total을 "총 페이지 수"로 준다면, 아래 주석처럼 바꿔주세요.
    const assumedTotalItems = d.total ?? items.length;
    totalItems = assumedTotalItems;
    totalPages = Math.max(1, Math.ceil(assumedTotalItems / normSize));

    // page가 1-based로 올 수도 있어서 보정
    if (typeof d.page === "number") {
      // d.page가 1 이상이고  totalPages보다 작거나 같다면 1-based일 가능성 높음
      // 안전하게: d.page > 0 && d.page <= totalPages 이면 1-based로 간주
      const maybeOneBased = d.page > 0 && d.page <= totalPages;
      normPage = maybeOneBased ? d.page - 1 : d.page;
    }
  }

  return {
    journals: items,
    meta: {
      page: normPage,        // 0-based
      size: normSize,
      totalPages,
      totalItems,
    },
    error,
    isLoading,
    refresh: mutate,
    key,
  };
}
