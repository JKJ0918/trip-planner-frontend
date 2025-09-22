"use client";

import { CompatClient, Stomp } from "@stomp/stompjs";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  createdAt: string; // or number/Date
};

export default function ChatRoom({ params }: chatRoomProps) {

    // 웹소켓 연결 객체
    const stompClient = useRef<CompatClient | null>(null);
    // 채팅방 아이디
    const { roomId } = useParams() as { roomId: string };
    // const { roomId } = params;
    // 채팅 내용들을 저장할 변수
    const [messages, setMessages] = useState<Message[]>([]);
    // 사용자 입력을 저장할 변수
    const [inputValue, setInputValue] = useState('');
    
    // 로그인이 없다는 가정하에 임시 방편들
    // 선택한 회원 번호
    const [selectedNumber, setSelectedNumber] = useState([]);

    //const handleNumberClick = (number: any) => {
    //    setSelectedNumber(number);
    //};

    useEffect(() => {
        connect(); // 1. 웹 소켓 연결
        fetchMessages(); // 2. 메시지 로드
        //컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => disconnect();
    }, [roomId])

    // 웹소켓 연결
    const connect = () => {
        // 웹소켓 연결
        const socket = new WebSocket("ws://localhost:8080/ws-stomp");
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect(
            {}, // 헤더를 비워둬도 쿠키 자동전송
            () => {
            // 메시지 수신 ( 1은 roomId를 임시로 표현)
            stompClient.current?.subscribe(`/sub/chatroom/` + roomId, (message) => {
                // 누군가 발송했던 메시지를 리스트에 추가
                const newMessage = JSON.parse(message.body) as Message;
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

    return (
        <div className="flex flex-col h-[80vh] w-200 bg-white">
            {/* 메시지 영역: 위에서 아래로, 스크롤 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5 bg-gray-50">
            {messages.map((item, index) => {
                {/* 여기 '1'은 임시임 나중에 받 */}
                const isMe = item.writerId === 1;
                return (
                <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl shadow
                        ${isMe
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md"
                        }`}
                    >
                    <p className="whitespace-pre-wrap break-words">{item.content}</p>
                    </div>
                </div>
                );
            })}
            </div>

            {/* 하단 입력창 고정 */}
            <div className=" p-3">
                <div className="flex gap-2">
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                    onClick={sendMessage}
                    className="rounded-xl bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
                    >
                    입력
                    </button>
                </div>
            </div>
        </div>
    );
}