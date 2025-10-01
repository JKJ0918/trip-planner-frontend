// store/chatStore.ts
import { create } from "zustand";

// 채팅방 요약 타입
export type RoomSummary = {
  roomId: string | number;
  title: string;
  lastMessage: string;
  lastMessageAt: string; // ISO string
  memberCount: number;
  unreadCount?: number;  

  members: Array<Member>;

};

export type Member = {
    nickname: string;
    avatarUrl: string;
    userId: number;
}

type ChatStore = {
  summaries: Record<string | number, RoomSummary>;
  setSummaries: (list: RoomSummary[]) => void;
  applySummary: (dto: RoomSummary) => void;
  markRead: (roomId: string | number) => void; // 추가
};

export const useChatStore = create<ChatStore>((set, get) => ({
  summaries: {},

  setSummaries: (list) => {
    const map: Record<string | number, RoomSummary> = {};
    list.forEach((r) => { map[r.roomId] = r; });
    set({ summaries: map });
  },

  applySummary: (dto) => {
    const curr = get().summaries;
    const prev = curr[dto.roomId] || {};
    set({
      summaries: {
        ...curr,
        [dto.roomId]: { ...prev, ...dto }, 
      },
    });
  },

  markRead: (roomId) => {
    const curr = get().summaries;
    const prev = curr[roomId];
    if (!prev) return;
    set({
      summaries: {
        ...curr,
        [roomId]: { ...prev, unreadCount: 0 }, // 읽음 처리
      },
    });
  },

}));