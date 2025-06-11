'use client';

import { useEffect, useState } from 'react';

type Comment = {
  id: number;
  content: string;
  writerName: string;
  createdAt: string;
  parentId?: number;
  edited: boolean;
  likeCount: number;
  likedByMe: boolean;
  author: boolean; // 백엔드의 isAuthor 이지만, 기본적으로 Jackson은 isAuthor를 → "author"라는 키로 변환.
};

export default function CommentSection({ journalId }: { journalId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyMap, setReplyMap] = useState<{ [key: number]: string }>({});
  const [editMap, setEditMap] = useState<{ [key: number]: boolean }>({});
  const [editContentMap, setEditContentMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [journalId]);

  const fetchComments = async () => { // 댓글 불러오는 메소드
    try {
      const res = await fetch(`http://localhost:8080/api/comments/${journalId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data); // 👈 여기를 확인
      setComments(data);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  const handleAddComment = async (parentId: number | null = null) => {
    const content = parentId === null ? newComment : replyMap[parentId] || '';
    if (!content.trim()) return;

    try {
      setLoading(true);
      await fetch(`http://localhost:8080/api/comments/${journalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
        credentials: 'include',
      });

      if (parentId === null) setNewComment('');
      else {
        setReplyMap((prev) => ({ ...prev, [parentId]: '' }));
        setReplyTo(null);
      }

      fetchComments();
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setLoading(false);
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
      fetchComments();
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
      fetchComments();
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
      fetchComments();
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const renderComments = (parentId: number | null = null) => {
    const list = comments.filter((c) => (c.parentId ?? null) === parentId);

    return list.map((comment) => (
      <div key={comment.id} className={`border p-3 mb-2 rounded ${parentId ? 'ml-6 bg-gray-50' : ''}`}>
        {/* 수정 모드 */}
        {editMap[comment.id] ? (
          <>
            <textarea
              className="w-full border rounded p-2 text-sm"
              value={editContentMap[comment.id]}
              onChange={(e) =>
                setEditContentMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
              }
            />
            <div className="flex gap-2 mt-1 text-sm">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditComment(comment.id)}
              >
                저장
              </button>
              <button
                className="text-gray-500 hover:underline"
                onClick={() => setEditMap((prev) => ({ ...prev, [comment.id]: false }))}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
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
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </>
              )}
              <button onClick={() => handleToggleLike(comment.id)}>
                {comment.likedByMe ? '❤️' : '🤍'} {comment.likeCount}
              </button>
            </div>

            {/* 대댓글 입력창 */}
            {replyTo === comment.id && (
              <div className="mt-2">
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
                  className="mt-1 bg-blue-500 text-white text-sm px-3 py-1 rounded"
                  onClick={() => handleAddComment(comment.id)}
                  disabled={loading}
                >
                  등록
                </button>
              </div>
            )}
          </>
        )}

        {/* 자식 댓글 재귀 */}
        {renderComments(comment.id)}
      </div>
    ));
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">댓글</h3>
      {renderComments()}

      {/* 최상위 댓글 입력 */}
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
