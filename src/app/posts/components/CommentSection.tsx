'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export type Comment = {
  id: number;              // 댓글 고유 ID
  content: string;         // 댓글 내용 (텍스트)
  writerName: string;      // 작성자 이름
  createdAt: string;       // 작성 시각 (ISO 문자열)
  parentId?: number;       // 부모 댓글 ID (대댓글일 경우에만 존재)
  edited: boolean;         // 수정 여부 (true면 "수정됨" 표시)
  likeCount: number;       // 좋아요 수
  likedByMe: boolean;      // 내가 좋아요 눌렀는지 여부
  author: boolean;         // 이 댓글 작성자가 현재 로그인한 나인지 여부
  replyCount: number;      // 이 댓글에 달린 답글(대댓글) 개수
};

type CommentPage = {
  content: Comment[];
  last: boolean;
};

export default function CommentSection({ journalId }: { journalId: number }) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyMap, setReplyMap] = useState<{ [key: number]: string }>({});
  const [editMap, setEditMap] = useState<{ [key: number]: boolean }>({});
  const [editContentMap, setEditContentMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);

  // 대댓글 관련 상태
  const [repliesMap, setRepliesMap] = useState<{ [parentId: number]: Comment[] }>({});
  const [repliesLoaded, setRepliesLoaded] = useState<{ [parentId: number]: boolean }>({});
  const [repliesVisibleMap, setRepliesVisibleMap] = useState<{ [parentId: number]: boolean }>({});

  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');

  // (옵션) 브라우저 스크롤 복원 비활성화 — 페이지 상단 점프 방지 보조책
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 목록 불러오기 (무한 스크롤)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<CommentPage>({
      queryKey: ['comments', journalId, sortOrder],
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        const res = await fetch(
          `http://localhost:8080/api/comments/${journalId}?page=${pageParam}&size=10&sort=${sortOrder}`,
          { credentials: 'include' }
        );
        return res.json();
      },
      getNextPageParam: (lastPage, allPages) => (lastPage.last ? undefined : allPages.length),
    });

  // 무한 스크롤 옵저버
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 대댓글 1회 로딩
  const fetchReplies = async (parentId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/comments/${parentId}/replies`, {
        credentials: 'include',
      });
      const list: Comment[] = await res.json();
      setRepliesMap((prev) => ({ ...prev, [parentId]: list }));
      setRepliesLoaded((prev) => ({ ...prev, [parentId]: true }));
    } catch (err) {
      console.error('대댓글 불러오기 실패:', err);
    }
  };

  // 답글 보기 / 숨기기
  const toggleReplies = async (parentId: number, replyCount: number) => {
    const isOpen = !!repliesVisibleMap[parentId];
    if (!isOpen && !repliesLoaded[parentId] && replyCount > 0) {
      await fetchReplies(parentId);
    }
    setRepliesVisibleMap((prev) => ({ ...prev, [parentId]: !isOpen }));
  };

  // CRUD
  const handleAddComment = async (parentId: number | null = null) => {
    const content = parentId === null ? newComment : replyMap[parentId] || '';
    if (!content.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/comments/${journalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
        credentials: 'include',
      });

      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 상위 댓글 추가 → 목록 리패치(간단한 버전)
      if (parentId === null) {
        setNewComment('');
        await refetch();
      } else {
        // 대댓글 추가 → 해당 부모만 새로 가져오기(부분 갱신)
        setReplyMap((prev) => ({ ...prev, [parentId]: '' }));
        setReplyTo(null);
        await fetchReplies(parentId);
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    const content = editContentMap[commentId];
    if (!content?.trim()) return;

    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      setEditMap((prev) => ({ ...prev, [commentId]: false }));
      await refetch();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await refetch();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handleToggleLike = async (commentId: number) => {
    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      await refetch();
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  // ====== 카드(상위 댓글 + 그 자식 대댓글만) ======
  const CommentCard = ({ comment }: { comment: Comment }) => {
    const openReply = replyTo === comment.id;
    const showReplies = !!repliesVisibleMap[comment.id];

    return (
      <div className="p-3 mb-2 rounded">
        {/* 본문 */}
        <p>{comment.content}</p>

        {/* 메타 */}
        <div className="text-sm text-gray-500">
          {comment.writerName} • {new Date(comment.createdAt).toLocaleString()}
          {comment.edited && <span className="ml-2 text-xs text-gray-400">(수정됨)</span>}
        </div>

        {/* 액션 */}
        <div className="flex gap-2 mt-2 text-sm">
          {/* 상위 댓글에서만 답글 버튼 노출 */}
          {!comment.parentId && (
            <button
              type="button"
              onClick={() => setReplyTo((cur) => (cur === comment.id ? null : comment.id))}
              className="text-blue-600 hover:underline"
            >
              답글 달기
            </button>
          )}

          {comment.author && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditMap((prev) => ({ ...prev, [comment.id]: true }));
                  setEditContentMap((prev) => ({ ...prev, [comment.id]: comment.content }));
                }}
                className="text-yellow-600 hover:underline"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleToggleLike(comment.id)}
            className="hover:underline"
            title="좋아요"
          >
            {comment.likedByMe ? '❤️' : '🤍'} {comment.likeCount}
          </button>
        </div>

        {/* 편집 모드 */}
        {editMap[comment.id] && (
          <div className="mt-2">
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={3}
              value={editContentMap[comment.id]}
              onChange={(e) =>
                setEditContentMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
              }
            />
            <div className="flex gap-2 mt-1 text-sm">
              <button
                type="button"
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditComment(comment.id)}
              >
                저장
              </button>
              <button
                type="button"
                className="text-gray-500 hover:underline"
                onClick={() => setEditMap((prev) => ({ ...prev, [comment.id]: false }))}
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 답글 입력: 언마운트 대신 hidden 으로 토글 */}
        <div className={openReply ? 'mt-2' : 'mt-2 hidden'}>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            placeholder="답글을 입력하세요..."
            value={replyMap[comment.id] || ''}
            onChange={(e) =>
              setReplyMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
            }
          />
          <button
            type="button"
            className="mt-1 bg-blue-500 text-white text-sm px-3 py-1 rounded"
            onClick={() => handleAddComment(comment.id)}
            disabled={loading}
          >
            등록
          </button>
        </div>

        {/* 답글 토글 */}
        {comment.replyCount > 0 && !comment.parentId && (
          <button
            type="button"
            className="text-blue-500 text-sm hover:underline mt-1"
            onClick={() => toggleReplies(comment.id, comment.replyCount)}
          >
            {showReplies ? '답글 숨기기' : `답글 보기 ${comment.replyCount}개`}
          </button>
        )}

        {/* 대댓글 목록: 상위 댓글 카드 안에서만 렌더 */}
        <div className={showReplies ? 'mt-1' : 'mt-1 hidden'}>
          {(repliesMap[comment.id] ?? []).map((reply) => (
            <div key={reply.id} className="ml-6 mt-2 p-2 rounded text-sm bg-gray-50">
              {/* 대댓글 내용/액션 */}
              {editMap[reply.id] ? (
                <>
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    value={editContentMap[reply.id]}
                    onChange={(e) =>
                      setEditContentMap((prev) => ({ ...prev, [reply.id]: e.target.value }))
                    }
                  />
                  <div className="flex gap-2 mt-1 text-sm">
                    <button
                      type="button"
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditComment(reply.id)}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 hover:underline"
                      onClick={() => setEditMap((prev) => ({ ...prev, [reply.id]: false }))}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{reply.content}</p>
                  <div className="text-xs text-gray-500">
                    {reply.writerName} • {new Date(reply.createdAt).toLocaleString()}
                    {reply.edited && <span className="ml-2 text-xs text-gray-400">(수정됨)</span>}
                  </div>
                  {reply.author && (
                    <div className="flex gap-2 mt-1 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMap((prev) => ({ ...prev, [reply.id]: true }));
                          setEditContentMap((prev) => ({ ...prev, [reply.id]: reply.content }));
                        }}
                        className="text-yellow-600 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(reply.id)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===== 렌더: 최상위 댓글만 map, 대댓글은 각 카드 내부에서만 =====
  return (
    <div className="mt-8">
      {/* 최신순/인기순 */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">댓글</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'recent' | 'popular')}
          className="border rounded p-1 text-sm"
        >
          <option value="recent">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {/* 댓글 목록: 최상위만 */}
      {data?.pages
        .flatMap((p) => p.content)
        .filter((c) => (c.parentId ?? null) === null)
        .map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}

      {/* 무한 스크롤 센티넬 */}
      <div ref={observerRef} className="h-6" />
      {isFetchingNextPage && <p>불러오는 중...</p>}

      {/* 새 댓글 입력 */}
      <div className="mt-6">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="button"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleAddComment(null)}
          disabled={loading}
        >
          {loading ? '작성 중...' : '댓글 작성'}
        </button>
      </div>
    </div>
  );
}
