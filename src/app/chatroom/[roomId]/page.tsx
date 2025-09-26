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

interface chatRoomProps {
  params: { roomId: string };
}

type Message = {
  id: string;
  roomId: string | number;
  title: string;
  writerId: string | number;
  sender: string;
  content: string;
  message: string;
  createdDate: string; // or number/Date
};

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

        // publish DTO (백엔드 규약에 맞게 수정 필요!)
        publish("/pub/message", {
        roomId,
        content: input,
        });

        setInput("");
    };

/*
    useEffect(() => {
        connect(); // 1. 웹 소켓 연결
        fetchMessages(); // 2. 메시지 로드

        if(me?.nickname) {
            setNickname(me.nickname);
            setEmail(me.email);
            setAvatarUrl(me.avatarUrl);
            
        }

        //컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => disconnect();
    }, [roomId, me])

    // 웹소켓 연결
    const connect = () => {
        // 웹소켓 연결
        const socket = new WebSocket("ws://localhost:8080/ws-stomp");
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect(
            {}, // 헤더를 비워둬도 쿠키 자동전송
            () => { // 수신 콜백
                
            // 메시지 수신
            stompClient.current?.subscribe(`/sub/chatroom/` + roomId, (message) => {
                // 누군가 발송했던 메시지를 리스트에 추가
                const newMessage = JSON.parse(message.body) as Message;
                console.log("웹소켓 연결 newMessage를 확인합니다.", newMessage);
                 console.log('pretty:\n', JSON.stringify(newMessage, null, 2));
                setMessages((prev) => [...prev, newMessage]);
            });
        
        });
    };

    // 이전에 작성된 메시지 불러오기
    const fetchMessages  = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/find/chat/list/` + roomId, {
                method: "GET",
                credentials: "include", 
                headers: { "Accept": "application/json" }, // GET에는 Content-Type 불필요
            });

            if(!res){
                throw new Error("네트워크 응답 실패(fetchMessages fail)");
            }

            const data = await res.json(); // JSON 변환
            setMessages(data);
        } catch (error) {
            console.error("채팅방 리스트 불러오기 실패", error);
        }
    }

    //웹소켓 연결 해제
    const disconnect = () => {
        if(stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    // 메시지 전송
    const sendMessage = () => {
        if(stompClient.current && inputValue) {
            //selectdNumber는 userId로 선택된 값
            if (stompClient.current && inputValue) {
                const body = {
                roomId : roomId,
                content : inputValue,
                // writerId : selectedNumber
            };
            stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
            setInputValue('');
            }
        }
    }
        
    */

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="text-sm text-gray-600">{m.writerId}</span>
            <span>{m.content}</span>
            <span className="text-xs text-gray-400">
              {new Date(m.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex border-t p-2 bg-gray-50">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          전송
        </button>
      </div>
    </div>
  );
}
