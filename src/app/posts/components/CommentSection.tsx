'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export type Comment = {
  id: number;
  content: string;
  writerName: string;
  avatarUrl: string;
  createdAt: string;
  parentId?: number | null;
  edited: boolean;
  likeCount: number;
  likedByMe: boolean;
  author: boolean;
  replyCount: number;
};

type CommentPage = { content: Comment[]; last: boolean };
type ReplyPage = {
  content: Comment[]; last: boolean; number: number; size: number; totalPages: number; totalElements: number;
};

const REPLIES_PAGE_SIZE = 3;

/** 안전 JSON 파서: 204/빈바디/비JSON 대응 */
async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** 최상단 댓글 입력창 (리렌더 최소화) */
const CommentInput = memo(function CommentInput({
  value, loading, onChange, onSubmit,
}: {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mb-6 flex gap-3 items-start">
      <div className="flex-1">
        <textarea
          className="w-full border rounded-xl p-3 text-sm"
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-2">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </div>
    </div>
  );
});

/** 단일 댓글 카드 (메모이즈) */
const CommentCard = memo(function CommentCard({
  comment,
  depth = 0,
  openReply,
  replyValue,
  onChangeReply,
  onSubmitReply,
  onToggleLike,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  isEditing,
  editValue,
  onChangeEditValue,
  showReplies,
  onToggleReplies,
  replies,
  hasMoreReplies,
  loadingMore,
  onShowMoreReplies,
  onToggleReplyInput,
}: {
  comment: Comment;
  depth?: number;

  // reply
  openReply: boolean;
  replyValue: string;
  onChangeReply: (id: number, v: string) => void;
  onSubmitReply: (parentId: number) => void;

  // actions
  onToggleLike: (id: number) => void;
  onStartEdit: (id: number, content: string) => void;
  onSaveEdit: (id: number, content: string) => void;
  onCancelEdit: (id: number) => void;
  onDelete: (id: number) => void;

  // edit state
  isEditing: boolean;
  editValue: string;
  onChangeEditValue: (id: number, v: string) => void;

  // replies
  showReplies: boolean;
  onToggleReplies: (id: number, replyCount: number) => void;
  replies: Comment[];
  hasMoreReplies: boolean;
  loadingMore: boolean;
  onShowMoreReplies: (id: number) => void;

  // 입력창 전용 토글
  onToggleReplyInput: (id: number) => void;
}) {
  const isReply = depth > 0;

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10' : ''} mb-4`}>
      <div className="flex-1 min-w-0">
        {/* 헤더 */}
        <div className={`flex gap-3 ${isReply ? 'ml-10' : ''} mb-4`}>
          {/* 아바타 */}
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE}${comment.avatarUrl}`}
            alt={`${comment.writerName} 프로필`}
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
            loading="lazy"
            decoding="async"
          />

          {/* 본문: 오른쪽 컬럼 */}
          <div className="flex-1 min-w-0">
            {/* 헤더(이름 · 시간 · 수정됨) */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-900">{comment.writerName}</span>
              <span>·</span>
              <time>{new Date(comment.createdAt).toLocaleString()}</time>
              {comment.edited && <span className="ml-1 text-gray-400">(수정됨)</span>}
            </div>
          </div>
        </div>

        {/* 본문/수정 */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="w-full border rounded-xl p-2 text-sm"
              rows={3}
              value={editValue}
              onChange={(e) => onChangeEditValue(comment.id, e.target.value)}
            />
            <div className="mt-2 flex items-center gap-2 text-xs">
              <button
                type="button"
                className="px-3 py-1 rounded-lg bg-green-500 text-white"
                onClick={() => onSaveEdit(comment.id, editValue)}
              >
                저장
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => onCancelEdit(comment.id)}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded-2xl bg-gray-50 px-3 py-2 text-sm whitespace-pre-line">
            {comment.content}
          </div>
        )}

        {/* 액션 */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
          <button
            type="button"
            onClick={() => onToggleLike(comment.id)}
            className="hover:text-red-500 transition-colors"
            aria-label="좋아요"
            title="좋아요"
          >
            {comment.likedByMe ? '❤️' : '🤍'} {comment.likeCount}
          </button>

          {depth === 0 && (
            <button
              type="button"
              onClick={() => onToggleReplyInput(comment.id)}  // 입력창만 토글
              className="hover:underline text-blue-600"
            >
              {openReply ? '답글 닫기' : '답글 달기'}
            </button>
          )}

          {comment.author && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => onStartEdit(comment.id, comment.content)}
                className="hover:underline text-yellow-600"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="hover:underline text-red-500"
              >
                삭제
              </button>
            </>
          )}
        </div>

        {/* 답글 입력: keep mounted + hidden 토글 */}
        <div className={openReply ? 'mt-2 ml-10' : 'mt-2 ml-10 hidden'}>
          <textarea
            className="w-full border rounded-xl p-2 text-sm"
            rows={2}
            placeholder="답글을 입력하세요..."
            value={replyValue}
            onChange={(e) => onChangeReply(comment.id, e.target.value)}
          />
          <div className="mt-2">
            <button
              type="button"
              className="bg-blue-500 text-white text-xs px-3 py-1 rounded"
              onClick={() => onSubmitReply(comment.id)}
            >
              등록
            </button>
          </div>
        </div>

        {/* 대댓글 토글(상위에서만) */}
        {comment.replyCount > 0 && depth === 0 && (
          <button
            type="button"
            className="text-blue-500 text-xs hover:underline mt-2"
            onClick={() => onToggleReplies(comment.id, comment.replyCount)} // 목록 토글 & 필요 시 로드
          >
            {showReplies ? '답글 숨기기' : `답글 보기 ${comment.replyCount}개`}
          </button>
        )}

        {/* 대댓글 목록 + 더보기 (상위에서만) */}
        {showReplies && depth === 0 && (
          <>
            {replies.map((r) => (
              <CommentCard
                key={`r-${r.id}`}  // replies prefix
                comment={r}
                depth={1}
                openReply={false}
                replyValue={''}
                onChangeReply={() => {}}
                onSubmitReply={() => {}}
                onToggleLike={() => {}}
                onStartEdit={() => {}}
                onSaveEdit={() => {}}
                onCancelEdit={() => {}}
                onDelete={() => {}}
                isEditing={false}
                editValue={''}
                onChangeEditValue={() => {}}
                showReplies={false}
                onToggleReplies={() => {}}
                replies={[]}
                hasMoreReplies={false}
                loadingMore={false}
                onShowMoreReplies={() => {}}
                onToggleReplyInput={() => {}}
              />
            ))}

            {hasMoreReplies && (
              <button
                type="button"
                className="text-blue-500 text-xs hover:underline ml-10"
                onClick={() => onShowMoreReplies(comment.id)}
                disabled={loadingMore}
              >
                {loadingMore ? '불러오는 중...' : '답글 더보기'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

/** 목록 + 무한 스크롤 + 로컬 상태/로직 */
function CommentList({ journalId }: { journalId: number }) {
  const queryClient = useQueryClient();

  // 로컬 상태
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [editMap, setEditMap] = useState<Record<number, boolean>>({});
  const [editContentMap, setEditContentMap] = useState<Record<number, string>>({});
  const [repliesMap, setRepliesMap] = useState<Record<number, Comment[]>>({});
  const [repliesLoaded, setRepliesLoaded] = useState<Record<number, boolean>>({});
  const [repliesVisibleMap, setRepliesVisibleMap] = useState<Record<number, boolean>>({});
  const [repliesPageMap, setRepliesPageMap] = useState<Record<number, number>>({});
  const [repliesHasNextMap, setRepliesHasNextMap] = useState<Record<number, boolean>>({});
  const [repliesLoadingMap, setRepliesLoadingMap] = useState<Record<number, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');

  // 메인 댓글 (무한 스크롤)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<CommentPage>({
    queryKey: ['comments', journalId, sortOrder],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${journalId}?page=${pageParam}&size=10&sort=${sortOrder}`,
        { credentials: 'include' }
      );
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.last ? undefined : allPages.length),
    staleTime: 60_000,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // 옵저버
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 1 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 유틸: id 기준 중복제거
  const uniqById = (arr: Comment[]) => Array.from(new Map(arr.map(x => [x.id, x])).values());

  // 대댓글 페이지 로드
  const fetchRepliesPage = useCallback(async (parentId: number, page: number) => {
    const url =
      `${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${parentId}/replies` +
      `?page=${page}&size=${REPLIES_PAGE_SIZE}&sort=createdAt,asc`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('대댓글 로딩 실패');
    const pageData: ReplyPage = await res.json();

    setRepliesMap((prev) => {
      const existing = prev[parentId] ?? [];
      // page=0 은 교체, 그 외에는 이어붙인 뒤 중복 제거
      const merged = page === 0 ? pageData.content : [...existing, ...pageData.content];
      return {
        ...prev,
        [parentId]: uniqById(merged),
      };
    });

    setRepliesPageMap((prev) => ({ ...prev, [parentId]: pageData.number }));
    setRepliesHasNextMap((prev) => ({ ...prev, [parentId]: !pageData.last }));
    setRepliesLoaded((prev) => ({ ...prev, [parentId]: true }));
  }, []);

  // 대댓글 보기/숨기기 (목록 토글 & 필요 시 로드)
  const toggleReplies = useCallback(async (parentId: number, replyCount: number) => {
    const isOpen = !!repliesVisibleMap[parentId];
    if (!isOpen && !repliesLoaded[parentId] && replyCount > 0) {
      try {
        setRepliesLoadingMap((p) => ({ ...p, [parentId]: true }));
        await fetchRepliesPage(parentId, 0);
      } finally {
        setRepliesLoadingMap((p) => ({ ...p, [parentId]: false }));
      }
    }
    setRepliesVisibleMap((prev) => ({ ...prev, [parentId]: !isOpen }));
    setReplyTo((cur) => (cur === parentId ? null : cur)); // 답글창 유지
  }, [fetchRepliesPage, repliesLoaded, repliesVisibleMap]);

  const showMoreReplies = useCallback(async (parentId: number) => {
    const nextPage = (repliesPageMap[parentId] ?? 0) + 1;
    if (repliesHasNextMap[parentId] === false) return;
    try {
      setRepliesLoadingMap((p) => ({ ...p, [parentId]: true }));
      await fetchRepliesPage(parentId, nextPage);
    } finally {
      setRepliesLoadingMap((p) => ({ ...p, [parentId]: false }));
    }
  }, [fetchRepliesPage, repliesHasNextMap, repliesPageMap]);

  // ----- optimistic updates (좋아요/수정/삭제/답글등록) -----
  const queryKey = ['comments', journalId, sortOrder] as const;

  const patchCommentLocal = useCallback((id: number, patch: Partial<Comment>) => {
    // 메인 페이지들
    queryClient.setQueryData<{ pages: CommentPage[]; pageParams: any[] }>(
      queryKey,
      (old) => {
        if (!old) return old as any;
        const pages = old.pages.map((pg) => ({
          ...pg,
          content: pg.content.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
        return { ...old, pages };
      }
    );
    // repliesMap도 반영
    setRepliesMap((prev) => {
      const next = { ...prev };
      for (const pid of Object.keys(next)) {
        const parentId = Number(pid);
        next[parentId] = next[parentId]?.map((c) => (c.id === id ? { ...c, ...patch } : c)) ?? [];
      }
      return next;
    });
  }, [queryClient, queryKey]);

  const removeCommentLocal = useCallback((id: number) => {
    // 메인
    queryClient.setQueryData<{ pages: CommentPage[]; pageParams: any[] }>(
      queryKey,
      (old) => {
        if (!old) return old as any;
        const pages = old.pages.map((pg) => ({
          ...pg,
          content: pg.content.filter((c) => c.id !== id),
        }));
        return { ...old, pages };
      }
    );
    // replies
    setRepliesMap((prev) => {
      const next = { ...prev };
      for (const pid of Object.keys(next)) {
        const parentId = Number(pid);
        next[parentId] = next[parentId]?.filter((c) => c.id !== id) ?? [];
      }
      return next;
    });
  }, [queryClient, queryKey]);

  const addReplyLocal = useCallback((parentId: number, reply: Comment) => {
    setRepliesMap((prev) => ({
      ...prev,
      [parentId]: [reply, ...(prev[parentId] ?? [])],
    }));
  }, []);

  // actions
  const onToggleLike = useCallback(async (id: number) => {
    // 낙관적 토글
    let snapshot: { likedByMe: boolean; likeCount: number } | null = null;
    // 현재 값 추출
    const findCurrent = (): Comment | undefined => {
      const pages = queryClient.getQueryData<{ pages: CommentPage[]; pageParams: any[] }>(queryKey)?.pages ?? [];
      for (const p of pages) {
        const f = p.content.find((c) => c.id === id);
        if (f) return f;
      }
      for (const k of Object.keys(repliesMap)) {
        const f = repliesMap[Number(k)]?.find((c) => c.id === id);
        if (f) return f;
      }
      return undefined;
    };
    const cur = findCurrent();
    if (cur) {
      snapshot = { likedByMe: cur.likedByMe, likeCount: cur.likeCount };
      patchCommentLocal(id, {
        likedByMe: !cur.likedByMe,
        likeCount: cur.likedByMe ? Math.max(0, cur.likeCount - 1) : cur.likeCount + 1,
      });
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // 실패 롤백
      if (snapshot) patchCommentLocal(id, snapshot);
    }
  }, [queryClient, queryKey, repliesMap, patchCommentLocal]);

  const onStartEdit = useCallback((id: number, content: string) => {
    setEditMap((p) => ({ ...p, [id]: true }));
    setEditContentMap((p) => ({ ...p, [id]: content }));
  }, []);

  const onSaveEdit = useCallback(async (id: number, content: string) => {
    if (!content.trim()) return;
    const prev = editContentMap[id];
    patchCommentLocal(id, { content, edited: true });
    setEditMap((p) => ({ ...p, [id]: false }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      // 롤백
      patchCommentLocal(id, { content: prev, edited: true });
      setEditMap((p) => ({ ...p, [id]: true }));
    }
  }, [editContentMap, patchCommentLocal]);

  const onCancelEdit = useCallback((id: number) => {
    setEditMap((p) => ({ ...p, [id]: false }));
  }, []);

  const onDelete = useCallback(async (id: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    removeCommentLocal(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      // 실패 시 전체 무효화(간단 복구)
      queryClient.invalidateQueries({ queryKey: ['comments', journalId] });
    }
  }, [journalId, removeCommentLocal, queryClient]);

  // 입력창 전용 토글
  const onToggleReplyInput = useCallback((id: number) => {
    setReplyTo((cur) => (cur === id ? null : id));
  }, []);

  const onSubmitReply = useCallback(async (parentId: number) => {
    const content = replyMap[parentId]?.trim();
    if (!content) return;

    const optimistic: Comment = {
      id: Number(`9${Date.now()}`),
      content,
      writerName: 'Me',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      parentId,
      edited: false,
      likeCount: 0,
      likedByMe: false,
      author: true,
      replyCount: 0,
    };

    addReplyLocal(parentId, optimistic);
    setReplyMap((p) => ({ ...p, [parentId]: '' }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${journalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const saved = await safeJson<Comment>(res);

      if (saved) {
        // 낙관적 항목을 실제 데이터로 교체
        setRepliesMap((prev) => {
          const arr = prev[parentId] ?? [];
          const idx = arr.findIndex((c) => c.id === optimistic.id);
          if (idx >= 0) {
            const next = [...arr];
            next[idx] = saved;
            return { ...prev, [parentId]: next };
          }
          return { ...prev, [parentId]: [saved, ...arr] };
        });
      } else {
        // 응답 바디가 없으면 1페이지 재동기화
        await fetchRepliesPage(parentId, 0);
      }
    } catch {
      // 실패 시 낙관적 항목 제거
      setRepliesMap((prev) => {
        const arr = prev[parentId] ?? [];
        return { ...prev, [parentId]: arr.filter((c) => c.id !== optimistic.id) };
      });
      alert('답글 작성 실패');
    }
  }, [journalId, replyMap, addReplyLocal, fetchRepliesPage]);

  // 파생 데이터: 최상위 댓글 + id 기반 중복 제거
  const topLevelComments = useMemo(() => {
    const flat = (data?.pages ?? [])
      .flatMap((p) => p.content)
      .filter((c) => (c.parentId ?? null) === null);

    const map = new Map<number, Comment>();
    for (const c of flat) map.set(c.id, c);
    return Array.from(map.values());
  }, [data]);

  return (
    <>
      {/* 헤더: 정렬 */}
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

      {/* (최상위) 댓글 목록 */}
      {topLevelComments.map((c) => (
        <CommentCard
          key={`c-${c.id}`}  // tops prefix
          comment={c}
          depth={0}
          // reply UI
          openReply={replyTo === c.id}
          replyValue={replyMap[c.id] ?? ''}
          onChangeReply={(id, v) => setReplyMap((p) => ({ ...p, [id]: v }))}
          onSubmitReply={onSubmitReply}
          // actions
          onToggleLike={onToggleLike}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
          isEditing={!!editMap[c.id]}
          editValue={editContentMap[c.id] ?? ''}
          onChangeEditValue={(id, v) => setEditContentMap((p) => ({ ...p, [id]: v }))}
          // replies
          showReplies={!!repliesVisibleMap[c.id]}
          onToggleReplies={toggleReplies}              // 목록 토글/로드 담당
          onToggleReplyInput={onToggleReplyInput}      // 입력창만 토글
          replies={repliesMap[c.id] ?? []}
          hasMoreReplies={!!repliesHasNextMap[c.id]}
          loadingMore={!!repliesLoadingMap[c.id]}
          onShowMoreReplies={showMoreReplies}
        />
      ))}

      <div ref={observerRef} className="h-6" />
      {/* 필요 시 스피너 등 추가 */}
    </>
  );
}

/** 최상위 섹션: 입력창 + 목록 분리 */
export default function CommentSection({ journalId }: { journalId: number }) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const sortOrder: 'recent' | 'popular' = 'recent'; // 입력 영역에서는 사용 X

  const handleAddTopComment = useCallback(async () => {
    const content = newComment.trim();
    if (!content) return;
    setLoading(true);

    // 낙관적 추가
    const optimistic: Comment = {
      id: Number(`8${Date.now()}`),
      content,
      writerName: 'Me',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      parentId: null,
      edited: false,
      likeCount: 0,
      likedByMe: false,
      author: true,
      replyCount: 0,
    };

    queryClient.setQueryData<{ pages: CommentPage[]; pageParams: any[] }>(
      ['comments', journalId, sortOrder],
      (old) => {
        if (!old) return old as any;
        const pages = [...old.pages];
        if (pages.length > 0) {
          pages[0] = { ...pages[0], content: [optimistic, ...pages[0].content] };
        }
        return { ...old, pages };
      }
    );
    setNewComment('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/comments/${journalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId: null }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const saved = await safeJson<Comment>(res);

      if (saved) {
        // 낙관 항목 교체
        queryClient.setQueryData<{ pages: CommentPage[]; pageParams: any[] }>(
          ['comments', journalId, sortOrder],
          (old) => {
            if (!old) return old as any;
            const pages = [...old.pages];
            if (pages.length > 0) {
              const idx = pages[0].content.findIndex((c) => c.id === optimistic.id);
              if (idx >= 0) {
                const arr = [...pages[0].content];
                arr[idx] = saved;
                pages[0] = { ...pages[0], content: arr };
              }
            }
            return { ...old, pages };
          }
        );
      } else {
        // 바디가 없으면 목록 재검증
        queryClient.invalidateQueries({ queryKey: ['comments', journalId] });
      }
    } catch {
      // 실패 시 낙관 제거
      queryClient.setQueryData<{ pages: CommentPage[]; pageParams: any[] }>(
        ['comments', journalId, sortOrder],
        (old) => {
          if (!old) return old as any;
          const pages = [...old.pages];
          if (pages.length > 0) {
            pages[0] = {
              ...pages[0],
              content: pages[0].content.filter((c) => !String(c.id).startsWith('8')),
            };
          }
          return { ...old, pages };
        }
      );
      alert('댓글 작성 실패');
    } finally {
      setLoading(false);
    }
  }, [journalId, newComment, queryClient]);

  return (
    <div className="mt-8">
      <CommentInput
        value={newComment}
        loading={loading}
        onChange={setNewComment}
        onSubmit={handleAddTopComment}
      />
      <CommentList journalId={journalId} />
    </div>
  );
}
