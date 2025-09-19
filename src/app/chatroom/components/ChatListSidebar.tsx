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

    const [chatRoom, setChatRoom] = useState<Messages[]>([]);

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

    return (
        <div>
            <ul>
                        {/* 채팅방 리스트 출력 */}
                        {chatRoom.map((room, index) => (
                        <Link 
                            key={room.roomId} 
                            href={`/chatroom/${room.roomId}`}
                            className="block px-4 py-3 hover:bg-gray-100 border-b"
                        >
                            {room.title}
                        </Link>
                        ))}
            </ul>
        </div>
    );
}