'use client';

import { useRef, useEffect, useState } from 'react';
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

  const [repliesMap, setRepliesMap] = useState<{ [parentId: number]: Comment[] }>({});
  const [repliesLoaded, setRepliesLoaded] = useState<{ [parentId: number]: boolean }>({});
  const [repliesVisibleMap, setRepliesVisibleMap] = useState<{ [parentId: number]: boolean }>({});
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');

  // 목록 불러오기
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, } = useInfiniteQuery<CommentPage>({
    queryKey: ['comments', journalId, sortOrder], // 어떤 종류의 데이터인지, 어떤 게시글의 댓글인지, 정렬 방식 캐시키(라벨로씀)
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => { // queryKey에 해당하는 데이터를 가져오는 방법
      const res = await fetch(
        `http://localhost:8080/api/comments/${journalId}?page=${pageParam}&size=10&sort=${sortOrder}`,
        { credentials: 'include' }
      );
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => { // queryFn 의 pageParam을 갱신시켜줌
      return lastPage.last ? undefined : allPages.length;
    },
  });

  // 무한 스크롤
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { // IntersectionObserver는 콜백 함수를 실행할 때, 관찰 중인 요소들의 상태를 배열(entries) 형태로 전달
      // new IntersectionObserver(callback, options) 형태로 만듬, 첫번째가 callback이니, entries는 콜백 함수
      // entries 안에 "지금 감시하고 있는 요소의 교차 상태"들이 들어 있음. → 보통 한 개만 감시하니까 entries[0]을 씀.
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) { // 바닥 감시용 div가 화면에 보일 때 && 다음 페이지가 존재할 떄 && 지금 불러오는 중이 아닐 때
            fetchNextPage(); // 알아서 React Query 내부 로직으로 들어가, getNextPageParam으로 다음 페이지 번호를 계산하고, queryFn을 다시 실행해서 서버에서 데이터를 불러옴.
          }
        },
      { threshold: 1 } // div 가 얼만큼 보여야 하는지 결정 , div 가 100% 화면 안에 들어와야 entries[0].isIntersecting = true
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage]); // 의존성 배열, 이 값들이 변하면 이펙트를 다시 세팅

  const fetchReplies = async (parentId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/comments/${parentId}/replies`, {
        credentials: 'include',
      });
      const data: Comment[] = await res.json();
      setRepliesMap((prev) => ({ ...prev, [parentId]: data }));
      setRepliesLoaded((prev) => ({ ...prev, [parentId]: true }));
    } catch (err) {
      console.error('대댓글 불러오기 실패:', err);
    }
  };

  const toggleReplies = async (parentId: number, replyCount: number) => {
    const isOpen = repliesVisibleMap[parentId];
    if (!isOpen && !repliesLoaded[parentId] && replyCount > 0) {
      await fetchReplies(parentId);
    }
    setRepliesVisibleMap((prev) => ({ ...prev, [parentId]: !isOpen }));
  };

  const handleAddComment = async (parentId: number | null = null) => {
    const content = parentId === null ? newComment : replyMap[parentId] || '';
    if (!content.trim()) return;

    try {
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

      refetch();
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  const handleEditComment = async (commentId: number) => {
    const content = editContentMap[commentId];
    if (!content.trim()) return;

    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      setEditMap((prev) => ({ ...prev, [commentId]: false }));
      refetch();
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
      refetch();
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
      refetch();
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  {/*댓글 가져오기 */}
  const renderComments = (comments: Comment[], parentId: number | null = null) => {
    const list = comments.filter((c) => (c.parentId ?? null) === parentId); // ?? : 병합 연산자, A가 null 또는 undefine이면, null을 반환

    return list.map((comment) => (
      <div key={comment.id} className={`p-3 mb-2 rounded ${parentId ? 'ml-6 bg-gray-50' : ''}`}>
        <p>{comment.content}</p>
        <div className="text-sm text-gray-500">
          {comment.writerName} • {new Date(comment.createdAt).toLocaleString()}
          {comment.edited && <span className="ml-2 text-xs text-gray-400">(수정됨)</span>}
        </div>
        <div className="flex gap-2 mt-2 text-sm">
          {!parentId && (
            <button onClick={() => setReplyTo(comment.id)} className="text-blue-600 hover:underline">
              답글 달기
            </button>
          )}
          {comment.author && (
            <>
              <button
                onClick={() => {
                  setEditMap((prev) => ({ ...prev, [comment.id]: true }));
                  setEditContentMap((prev) => ({ ...prev, [comment.id]: comment.content }));
                }}
                className="text-yellow-600 hover:underline"
              >
                수정
              </button>
              <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:underline">
                삭제
              </button>
            </>
          )}
          <button onClick={() => handleToggleLike(comment.id)}>
            {comment.likedByMe ? '❤️' : '🤍'} {comment.likeCount}
          </button>
        </div>

        {replyTo === comment.id && (
          <div className="mt-2">
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={2}
              placeholder="답글을 입력하세요..."
              value={replyMap[comment.id] || ''}
              onChange={(e) => setReplyMap((prev) => ({ ...prev, [comment.id]: e.target.value }))}
            />
            <button
              className="mt-1 bg-blue-500 text-white text-sm px-3 py-1 rounded"
              onClick={() => handleAddComment(comment.id)}
              disabled={loading}
            >
              등록
            </button>
          </div>
        )}

        {comment.replyCount > 0 && (
          <button
            className="text-blue-500 text-sm hover:underline mt-1"
            onClick={() => toggleReplies(comment.id, comment.replyCount)}
          >
            {repliesVisibleMap[comment.id] ? '답글 숨기기' : `답글 보기 ${comment.replyCount}개`}
          </button>
        )}

        {repliesVisibleMap[comment.id] &&
          repliesMap[comment.id]?.map((reply) => (
            <div key={reply.id} className="ml-6 mt-2 p-2 rounded text-sm">
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
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditComment(reply.id)}
                    >
                      저장
                    </button>
                    <button
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
                        onClick={() => {
                          setEditMap((prev) => ({ ...prev, [reply.id]: true }));
                          setEditContentMap((prev) => ({ ...prev, [reply.id]: reply.content }));
                        }}
                        className="text-yellow-600 hover:underline"
                      >
                        수정
                      </button>
                      <button onClick={() => handleDeleteComment(reply.id)} className="text-red-500 hover:underline">
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

        {renderComments(comments, comment.id)}
      </div>
    ));
  };

  return (
    <div className="mt-8">
      {/*최신순/인기순 버튼*/}
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

      {/*댓글 입력 란 */}
      {data?.pages.map((page) => renderComments(page.content))}
      <div ref={observerRef} className="h-6" />
      {isFetchingNextPage && <p>불러오는 중...</p>}

      <div className="mt-6">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
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
