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
    const numbers = [1, 2, 3, 4, 5]; // 회원 번호를 위한 숫자 배열

    const handleNumberClick = (number: any) => {
        setSelectedNumber(number);
    };

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
        stompClient.current.connect({}, () => {
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
            if (stompClient.current && inputValue && selectedNumber) {
                const body = {
                roomId : roomId,
                content : inputValue,
                writerId : selectedNumber
            };
            stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
            setInputValue('');
            }
        }
    }

    return (
        <div>
            <ul>
                {/* userId 선택 칸 */}
                <div style={{ display: 'flex' }}>
                    {numbers.map((number, index) => (
                        <div 
                        key={index} 
                        className={`num-${number}`}
                        onClick={() => handleNumberClick(number)} 
                        style={{ 
                            marginRight: '5px',
                            padding: '5px',
                            width: '40px',
                            height: '25px',
                            border: '1px solid black',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                        >
                        {number}
                        </div>
                    ))}
                    <p style={{ marginTop: '7px'}}>회원 번호: {selectedNumber}</p>
                </div>
                {/* 입력 필드 */}        
                <div>
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
                    <div key={index} className={`list-items num-${item.writerId}`}>{item.content}</div>
                ))}
            </ul>

        </div>
    );
}