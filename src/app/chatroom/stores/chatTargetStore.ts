// stores/chatTargetStore.ts
import { create } from "zustand";
 
type TargetUser = {
    id: number;
    nickname: string;
    avatarUrl?: string;
};

type ChatTargetState = {
    targetUser: TargetUser | null;
    setTargetUser: (user: TargetUser) => void;
    clearTargetUser: () => void;
};

export const useChatTargetStore = create<ChatTargetState>((set) => ({
    targetUser: null, // 초기에는 선택된 상대 없음
    setTargetUser: (user) => set({ targetUser: user }),
    clearTargetUser: () => set({ targetUser: null }),

}));
