"use client";

import Link from "next/link";
import { useMyJournals } from "@/app/hooks/useMyJournals"; // 경로 맞게 조정

export default function MyJourney() {
  // 필요 시 페이지/사이즈 조정 가능
  const { journals, isLoading, error, refresh } = useMyJournals(1, 12);

  if (isLoading) {
    return (
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-xl border bg-white p-4">
            <div className="h-5 w-2/3 bg-gray-100 animate-pulse rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return <div className="text-red-600">목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!journals || journals.length === 0) {
    return <div className="text-gray-500">아직 작성한 여행일지가 없습니다.</div>;
  }

  const fmt = (s: string) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(s));

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {journals.map((p) => (
        <li
          key={p.id}
          className="rounded-2xl border bg-white hover:shadow-md transition p-4 flex flex-col gap-2"
        >
          {/* 제목 */}
          <Link href={`/posts/${p.id}`} className="group">
            <h4 className="font-semibold group-hover:underline line-clamp-2 break-words">
              {p.title}
            </h4>
          </Link>

          {/* 날짜 */}
          <div className="text-sm text-gray-500">
            작성: {fmt(p.createdAt)}
          </div>

          {/* 액션 */}
          <div className="mt-2 flex gap-2">
            <Link
              href={`/posts/edit/${p.id}`}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              수정/삭제
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
