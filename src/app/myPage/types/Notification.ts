// 타입 정의

// 댓글, 좋아요 알림: 타입
export type NotificationDTO = {
  id: number;
  type: 'COMMENT' | 'LIKE';
  message: string;
  link: string;
  isRead: boolean;
  postId: number;
  commentId: number | null;
  actorId: number;
  createdAt: string; // ISO 문자열로 올 확률 높음
}