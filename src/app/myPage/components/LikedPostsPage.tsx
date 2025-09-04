'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type MeLikePostDTO = {
  id: number;
  title: string;
  nickname: string; // DTO 필드명 주의!
  createdAt: string;      // ISO 문자열
};

const fmt = (iso?: string) =>
  iso ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(iso)) : '';

export default function LikedPostsPage() {
  const BASE_URL = 'http://localhost:8080';
  const [items, setItems] = useState<MeLikePostDTO[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // 테이블이므로 10개 기본
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afterTravel, setAfterTravel] = useState<boolean | null>(null); // null=전체

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), size: String(size) });
    if (afterTravel !== null) p.set('afterTravel', String(afterTravel));
    return p.toString();
  }, [page, size, afterTravel]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/me/likeJournals?${query}`, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 401) throw new Error('로그인이 필요합니다.');
          throw new Error(`오류: ${res.status}`);
        }
        const data = await res.json();
        setItems(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (e: any) {
        setError(e?.message ?? '네트워크 오류');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [query]);

  const btn = (active: boolean) =>
    `px-3 h-9 rounded-md border text-sm transition
     ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: section description */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">Liked Posts</h2>
        <p className="mt-1 text-sm text-gray-500">
          내가 좋아요한 게시물 목록입니다. 제목을 클릭하면 상세 페이지로 이동합니다.
        </p>

        {/* 필터 요약/빠른 전환 (선택) */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="font-medium">필터</div>
          <div className="flex gap-2">
            <button className={btn(afterTravel === null)} onClick={() => { setAfterTravel(null); setPage(0); }}>
              전체
            </button>
            <button className={btn(afterTravel === true)} onClick={() => { setAfterTravel(true); setPage(0); }}>
              여행 다녀온 후
            </button>
            <button className={btn(afterTravel === false)} onClick={() => { setAfterTravel(false); setPage(0); }}>
              여행 다녀오기 전
            </button>
          </div>

          {/* 페이지당 개수 (선택) */}
          <div className="flex items-center gap-2">
            <span>페이지당</span>
            <select
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
              className="h-9 rounded-md border border-gray-300 text-sm px-2 bg-white"
            >
              {[10, 15, 20].map(n => <option key={n} value={n}>{n}개</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Right: table content */}
      <section className="lg:col-span-2">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && !isLoading && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            조건에 해당하는 게시물이 없습니다.
          </div>
        )}

        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="sticky left-0 bg-gray-50 text-left px-4 py-3 font-medium">제목</th>
                <th className="text-left px-4 py-3 font-medium">작성자</th>
                <th className="text-left px-4 py-3 font-medium">작성일</th>
                <th className="px-4 py-3 text-right font-medium">보기</th>
              </tr>
            </thead>

            {/* Loading skeleton */}
            {isLoading && (
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-block h-8 w-16 bg-gray-100 animate-pulse rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}

            {/* Data rows */}
            {!isLoading && items.length > 0 && (
              <tbody className="divide-y divide-gray-100">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {/* Title */}
                    <td className="px-4 py-3 align-middle">
                      <Link href={`/posts/${p.id}`} className="group inline-block max-w-[38rem]">
                        <span className="font-medium text-gray-900 group-hover:text-indigo-600 group-hover:underline line-clamp-1 break-words">
                          {p.title}
                        </span>
                      </Link>
                    </td>

                    {/* 작성자 */}
                    <td className="px-4 py-3 text-gray-700 align-middle">
                      {p.nickname}
                    </td>

                    {/* 작성일 */}
                    <td className="px-4 py-3 text-gray-600 align-middle">
                      {fmt(p.createdAt)}
                    </td>

                    {/* 보기 */}
                    <td className="px-4 py-3 text-right align-middle">
                      <Link
                        href={`/posts/${p.id}`}
                        className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        보기
                      </Link>
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
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            이전
          </button>
          <span className="px-2 py-1 text-sm text-gray-600">
            {totalPages === 0 ? '1 / 1' : `${page + 1} / ${totalPages}`}
          </span>
          <button
            className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage(p => Math.min(Math.max(totalPages - 1, 0), p + 1))}
            disabled={totalPages === 0 || page + 1 >= totalPages}
          >
            다음
          </button>
        </div>
      </section>
    </div>
  );
}
