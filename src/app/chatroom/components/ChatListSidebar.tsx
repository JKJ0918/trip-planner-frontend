"use client"

import { useEffect, useState } from "react"
import Link from "next/link";

type Messages = {
  id: string;
  roomId: string | number;
  title: string;
  sender: string;
  content: string;
  message: string;
  createdAt: string; // or number/Date
};


export default function ChatListSidebar () {

    // 사용자 입력을 저장할 변수
    const [inputValue, setInputValue] = useState('');

    const [chatRoom, setChatRoom] = useState<Messages[]>([]);
    // const [rooms, setRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        fetchRooms(); // 채팅방 로드
    }, [])

    // 채팅 리스트 반환
    const fetchRooms = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chatList`, {
                method: "GET",
                credentials: "include", 
                headers: { "Accept": "application/json" }, // GET에는 Content-Type 불필요
            });

            if(!res){
                throw new Error("네트워크 응답 실패(fetchRooms fail)");
            }

            const data = await res.json(); // JSON 변환
            setChatRoom(data);
        } catch (error) {
            console.error("채팅방 리스트 불러오기 실패", error);
        }
    }

    const createRoom = async () => {
        if(inputValue) {
            const body = {
                title : inputValue
            };
            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/create`, {
                    method: "POST",
                    credentials: "include", 
                    headers: {"Content-Type" : "application/json"},
                    body: body ? JSON.stringify(body) : undefined,
                });

                if(res.status === 201){
                    const data = await res.json();
                    setInputValue('');
                    setChatRoom((prev) => [...prev, data])
                }

            } catch (error) {
                console.error("채팅방 생성 실패(const createRoom)", error);
            }

        }
    }


    return (
        <div>
            <ul>
                <div>
                    { /* 입력 필드 */ }
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    />
                    {/* 채팅방 추가 */}
                    <button onClick={createRoom}>입력</button>
                        </div>
                        {/* 채팅방 리스트 출력 */}
                        {chatRoom.map((room, index) => (
                        <Link 
                            key={room.id} 
                            href={`/chatroom/${room.id}`}
                            className="block px-4 py-3 hover:bg-gray-100 border-b"
                        >
                            {room.title}
                        </Link>
                        ))}
            </ul>
        </div>
    );
}