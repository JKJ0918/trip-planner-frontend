"use client"

import { useEffect, useRef, useState } from "react"
import { CompatClient, Stomp } from "@stomp/stompjs";

type Message = {
  id: string;
  roomId: string | number;
  sender: string;
  content: string;
  message: string;
  createdAt: string; // or number/Date
};


export default function ChattingPage () {

    // 웹소켓 연결 객체
    const stompClient = useRef<CompatClient | null>(null);
    // 메시지 리스트
    const [messages, setMessages] = useState<Message[]>([]);
    // 사용자 입력을 저장할 변수
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        connect(); // 1. 웹 소켓 연결
        fetchMessages(); // 2. 채팅방 로드
       
        //컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => disconnect();
    }, [])

    // 웹소켓 연결
    const connect = () => {
        // 웹소켓 연결
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            // 메시지 수신 ( 1은 roomId를 임시로 표현)
            stompClient.current?.subscribe(`/sub/chatroom/1`, (message) => {
                // 누군가 발송했던 메시지를 리스트에 추가
                const newMessage = JSON.parse(message.body) as Message;
                setMessages((prev) => [...prev, newMessage]);
            });
        
        });
    };

    //웹소켓 연결 해제
    const disconnect = () => {
        if(stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    // 채팅 리스트 반환
    const fetchMessages = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chat/1`, {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type" : "application/json",
                },
            });

            if(!res){
                throw new Error("네트워크 응답 실패(fetchMessages fail)");
            }

            const data = await res.json(); // JSON 변환
            setMessages(data);
        } catch (error) {
            console.error("메시지 불러오기 실패", error);
        }
    }


    // 메시지 전송
    const sendMessage = () => {
        if(stompClient.current && inputValue) {
            // 현재로서는 임의의 테스트 값을 삽입
            const body = {
                id: 1,
                userId: 11,
                nickname: "testnick",
                message: inputValue
            };
            stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
            setInputValue('');
        }
    }

    return (
        <div>
            <ul>
                <div>
                    {/* 입력 필드 */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {/* 메시지 전송, 메시지 리스트에 추가 */}
                    <button onClick={sendMessage}>입력</button>
                </div>
                    {/* 메시지 리스트 출력 */}
                    {messages.map((item, index) => (
                    <div key={index} className="list-item">{item.message}</div>
                    ))}
            </ul>
        </div>
    );
}