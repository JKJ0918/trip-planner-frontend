'use client';

import { useEffect, useState } from 'react';
import { TravelPostSummary } from '../maps/utils/tripstore';
import PostCard from '../posts/components/PostCard';



export default function PostListPage() {

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<TravelPostSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/journals/public?page=${page}&size=6&keyword=${keyword}`
        );
        const data = await res.json();
          setPosts(data.content);
          setTotalPages(data.totalPages);
      } catch (err) {
        console.error('게시물 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📚 여행 게시판</h1>

      {loading && <p>로딩 중...</p>}

      {posts.length === 0 && !loading && <p>게시물이 없습니다.</p>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}


      <input
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="제목 또는 도시명으로 검색"
      />
      <button onClick={() => setPage(0)}>🔍 검색</button>

      <div className="mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-2 py-1 ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}