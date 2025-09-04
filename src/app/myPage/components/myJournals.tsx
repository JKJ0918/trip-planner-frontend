"use client";

import Link from "next/link";
import { useMyJournals } from "@/app/hooks/useMyJournals";

export default function MyJourney() {
  const { journals, isLoading, error } = useMyJournals(1, 12);

  const fmt = (s: string) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(s));

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

        {/* Empty state */}
        {!error && !isLoading && (!journals || journals.length === 0) && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            아직 작성한 여행일지가 없습니다.
            <div className="mt-3">
              <Link
                href="/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
              >
                새 여행일지 작성
              </Link>
            </div>
          </div>
        )}

        {/* Table wrapper for horizontal scroll */}
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

                    {/* 작성일 date */}
                    <td className="px-4 py-3 text-gray-600 align-middle">{fmt(p.createdAt)}</td>
                    {/* 좋아요 date */}
                    <td className="px-4 py-3 text-right">{p.likeCount}</td>
                    {/* 조회수 date */}
                    <td className="px-4 py-3 text-right">{p.views}</td>

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
      </section>
    </div>
  );
}
