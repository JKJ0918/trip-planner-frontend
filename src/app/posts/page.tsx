'use client';

import { useEffect, useState } from 'react';
import { TravelPostSummary } from '../maps/utils/tripstore';
import PostCard from './components/PostCard';


export default function PostListPage() {
  const [posts, setPosts] = useState<TravelPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/journals/public');
        const data = await res.json();
        setPosts(data);
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
    </div>
  );
}
