"use client";

import { useMe } from "@/app/hooks/useMe";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { useRoomChannel } from "@/app/hooks/useRoomChannel";
import { useMessageStore } from "../stores/messageStore";
import { publish } from "@/app/lib/stomp";

// 컴포넌트 바깥에 ‘고정’ 빈 배열을 한 번만 만들기
const EMPTY_MESSAGES: any[] = [];


export default function ChatRoom() {

    // 웹소켓 연결 객체
    const stompClient = useRef<CompatClient | null>(null);
    // 채팅방 아이디
    // const { roomId } = useParams() as { roomId: string }; // [roomId] 폴더 그리고, 이게 주소창보면 숫자써있는데, 이걸 넥스트 js가 자동 매칭 시켜줌 
    // const { roomId } = params;
    // 채팅 내용들을 저장할 변수
    // const [messages, setMessages] = useState<Message[]>([]);
    // 사용자 입력을 저장할 변수 
    const [inputValue, setInputValue] = useState('');
    // 본인 정보 가져오기
    const { me, isLoading, error } = useMe();
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] =useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const router = useRouter()

    const params = useParams(); // { roomId: '...' }
    const roomId = String(params?.roomId ?? "");
    const messages = useMessageStore((s) => s.messages[roomId] ?? EMPTY_MESSAGES);
    const markRead = useChatStore((s) => s.markRead);

    const [input, setInput] = useState("");

    // 방 연결 + 메시지 관리
    useRoomChannel(roomId);

    // 입장 시 읽음 처리
    useEffect(() => {
        if (roomId) markRead(roomId);
    }, [roomId, markRead]);

    const handleSend = () => {
        if (!input.trim()) return;

        // publish DTO (백엔드 규약에 맞게 수정)
        publish("/pub/message", {
        roomId,
        content: input,
        nickname: me?.nickname,
        avatarUrl: me?.avatarUrl,

        });

        setInput("");
    };

return (
  <div className="flex flex-col h-full w-230">
  {/* 메시지 목록 (그리드 → 단일 컬럼) */}
  <div className="flex-1 overflow-y-auto p-4 bg-white">
    <div className="flex flex-col gap-3">
      {messages.map((m) => {
        const isMe = m.writerId === me?.id;
        const ts = new Date(m.createdDate);

        if (!isMe) {
          // 상대방: 왼쪽 정렬, 아바타 + 말풍선
          return (
            <div
              key={m.id}
              className="self-start flex items-start gap-3 max-w-[calc(50%-0.5rem)]"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE}${m.avatarUrl}`}
                alt={`${m.nickname} 프로필`}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 mb-1">{m.nickname}</div>
                <div
                  className="inline-block w-full rounded-2xl rounded-tl-md bg-gray-100 px-3 py-2
                            text-[15px] leading-6 text-gray-900 shadow break-words whitespace-pre-wrap"
                >
                  {m.content}
                </div>
                <div className="mt-1 text-[10px] text-gray-400">
                  {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        }

        // 나: 오른쪽 정렬, 말풍선만
        return (
          <div
            key={m.id}
            className="self-end flex items-end gap-2 max-w-[calc(50%-0.5rem)]"
          >
            <div className="min-w-0 text-right">
              <div
                className="inline-block w-full rounded-2xl rounded-tr-md px-3 py-2
                          text-[15px] leading-6 text-white shadow
                          bg-gradient-to-br from-pink-500 to-orange-400
                          break-words whitespace-pre-wrap"
              >
                {m.content}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">
                {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>



  {/* 입력창 */}
  <div className="flex items-center gap-2 p-3 bg-gray-50">
    <input
      className="flex-1 rounded-full border border-gray-300 px-4 py-2 
                text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 
                shadow-sm placeholder-gray-400"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="메시지를 입력하세요..."
    />

    <button
      onClick={handleSend}
      className="flex items-center justify-center rounded-full
                bg-gradient-to-br from-pink-500 to-orange-400 
                text-white w-10 h-10 shadow hover:opacity-90
                focus:ring-2 focus:ring-pink-300"
      aria-label="전송"
    >
      {/* paper-plane SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    </button>
  </div>

  </div>
);


}
