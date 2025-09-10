'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TravelPostSummary } from '../maps/utils/tripstore';
import PostCard from '../posts/components/PostCard';

type ViewMode = 'grid' | 'list';
type SortKey = 'latest' | 'popular' | 'views' | 'comments';

export default function PostListPage() {
  const [posts, setPosts] = useState<TravelPostSummary[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [sort, setSort] = useState<SortKey>('latest');
  const [view, setView] = useState<ViewMode>('grid');

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // 서버에서 게시글 불러오기
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/journals/public?page=${page}&size=${size}&keyword=${encodeURIComponent(
          keyword
        )}&sort=${sort}`, // 백엔드에서 sort 파라미터를 읽도록 구현해두면 바로 동작
        { credentials: 'include' }
      );
      const data = await res.json();
      setPosts(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements); // Spring Page 기본 필드(있으면 표시됨)
    } finally {
      setLoading(false);
    }
  };

  // 페이지/사이즈/정렬이 바뀌면 재조회
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sort]);

  // 검색 버튼 or Enter
  const handleSearch = () => {
    setPage(0);
    fetchPosts();
  };

  // 보기 레이아웃 클래스
  const gridClass = useMemo(() => {
    if (view === 'list') return 'grid grid-cols-1 gap-4';
    // grid 모드: 1→2→3열
    return 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6';
  }, [view]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">여행 게시판</h1>

      {/* === 상단 툴바 === */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 좌측: 검색 */}
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="제목 또는 도시명으로 검색"
            className="w-full sm:w-96 rounded-md border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
          >
            검색
          </button>
        </div>

        {/* 우측: 총건수 / 정렬 / 보기전환 / 글쓰기 */}
        <div className="flex items-center gap-2">
          {typeof totalElements === 'number' && (
            <span className="hidden sm:inline text-sm text-gray-500">
              총 {totalElements.toLocaleString()}건
            </span>
          )}

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setPage(0);
            }}
            className="rounded-md border px-3 py-2 text-sm"
            aria-label="정렬"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순(좋아요)</option>
            <option value="views">조회순</option>
            <option value="comments">댓글순</option>
          </select>

          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="rounded-md border px-3 py-2 text-sm"
            aria-label="페이지당 개수"
          >
            <option value={3}>3개</option>
            <option value={6}>6개</option>
            <option value={12}>12개</option>
          </select>

        </div>
      </div>

      {/* === 컨텐츠 === */}
      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(size, 9) }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <div className={gridClass}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 pt-4">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            className={`px-3 py-1 rounded-md ${
              page === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
