"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { useMyJournals } from "@/app/hooks/useMyJournals";

export default function MyJourney() {
  // 0-based 페이지 상태
  const [page, setPage] = useState(0);
  const size = 12;

  const { journals, meta, isLoading, error } = useMyJournals(page, size);

  const fmt = useCallback(
    (s: string) =>
      new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(s)),
    []
  );

  const canPrev = page > 0;
  const canNext = (meta?.totalPages ?? 1) > 0 && page + 1 < (meta?.totalPages ?? 1);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: section description */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">My Journals</h2>
        <p className="mt-1 text-sm text-gray-500">
          내가 작성한 여행일지 목록입니다. 제목을 클릭하면 상세 페이지로 이동합니다.
        </p>
      </section>

      {/* Right: table content */}
      <section className="lg:col-span-2">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700">
            목록을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
        <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">총 페이지: {meta.totalPages}</div>
        </div>
        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="sticky left-0 bg-gray-50 text-left px-4 py-3 font-medium">제목</th>
                <th className="text-left px-4 py-3 font-medium">작성일</th>
                <th className="text-right px-4 py-3 font-medium">좋아요</th>
                <th className="text-right px-4 py-3 font-medium">조회수</th>
                <th className="px-4 py-3 text-right font-medium">수정/삭제</th>
              </tr>
            </thead>

            {/* Loading skeleton */}
            {isLoading && (
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-block h-8 w-20 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-block h-8 w-20 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-block h-8 w-24 bg-gray-100 animate-pulse rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}

            {/* Data rows */}
            {!isLoading && journals && journals.length > 0 && (
              <tbody className="divide-y divide-gray-100">
                {journals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {/* Title */}
                    <td className="px-4 py-3 align-middle">
                      <Link href={`/posts/${p.id}`} className="group inline-block max-w-[38rem]">
                        <span className="font-medium text-gray-900 group-hover:text-indigo-600 group-hover:underline line-clamp-1 break-words">
                          {p.title}
                        </span>
                      </Link>
                    </td>

                    {/* 작성일 */}
                    <td className="px-4 py-3 text-gray-600 align-middle">{fmt(p.createdAt)}</td>

                    {/* 좋아요 */}
                    <td className="px-4 py-3 text-right">{p.likeCount ?? 0}</td>

                    {/* 조회수 */}
                    <td className="px-4 py-3 text-right">{p.views ?? 0}</td>

                    {/* 수정/삭제 */}
                    <td className="px-4 py-3 text-right align-middle">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/posts/${p.id}`}
                          className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        >
                          보기
                        </Link>
                        <Link
                          href={`/posts/edit/${p.id}`}
                          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          수정/삭제
                        </Link>
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
            className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
          >
            이전
          </button>

          <span className="px-2 py-1 text-sm text-gray-600">
            {(meta?.totalPages ?? 1) === 0 ? "1 / 1" : `${page + 1} / ${meta?.totalPages ?? 1}`}
          </span>

          <button
            className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => (canNext ? p + 1 : p))}
            disabled={!canNext}
          >
            다음
          </button>
        </div>
      </section>
    </div>
  );
}
