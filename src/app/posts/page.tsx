// 게시물 리스트 나열 페이지
'use client';

import { useEffect, useState } from 'react';
import { TravelPostSummary } from '../maps/utils/tripstore';
import PostCard from '../posts/components/PostCard';


export default function PostListPage() {
  const [posts, setPosts] = useState<TravelPostSummary[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  

  // 게시글 불러오기
  const fetchPosts = async () => {
    const res = await fetch(
      `http://localhost:8080/api/journals/public?page=${page}&size=3&keyword=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();
    setPosts(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleSearch = () => {
    setPage(0); // 검색 시 1페이지로 초기화
    fetchPosts();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">여행 게시판</h1>

      {/* 검색 입력창 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목 또는 도시명으로 검색"
          className="w-full border rounded px-3 py-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded"
        >
          검색
        </button>
      </div>

      {/* 게시물 목록 */}
      {posts.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
        
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            className={`px-3 py-1 rounded ${
              page === idx ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
