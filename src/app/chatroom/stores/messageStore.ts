import { create } from "zustand";

export type ChatMessage = {
  id: string | number;
  roomId: string | number;
  writerId: number;
  content: string;
  createdAt: string;
};

type MessageStore = {
  messages: Record<string | number, ChatMessage[]>; // roomId별 배열
  setMessages: (roomId: string | number, list: ChatMessage[]) => void;
  appendMessage: (roomId: string | number, msg: ChatMessage) => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: {},

  setMessages: (roomId, list) => {
    set((state) => ({
      messages: { ...state.messages, [roomId]: list },
    }));
  },

  appendMessage: (roomId, msg) => {
    const curr = get().messages[roomId] || [];
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...curr, msg],
      },
    }));
  },
}));
