"use client"

import { useEffect, useState } from "react"
import Link from "next/link";

type ChatRoom = {
  roomId: string | number;
  title: string;
  sender: string;
  content: string;
  message: string;
  createdAt: string; // or number/Date

  // 아래는 구현 예정
  profileUrl: string; // 프로필 url
  lastMessageAt: string; // ISO string
  lastMessage: string; // 마지막 메시지
  memberCount: number; // 대화 수


};


export default function ChatListSidebar () {

    const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);

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
        <ul className="divide-y divide-gray-200">
        {chatRoom.map((room) => (
            <li key={room.roomId}>
            <Link
                href={`/chatroom/${room.roomId}`}
                className="flex items-center px-4 py-7 hover:bg-gray-100"
            >
                {/* 프로필 이미지 */}
                <img
                src={room.profileUrl || "/images/avatar-default.png"}
                alt="프로필"
                className="w-12 h-12 rounded-full object-cover mr-3"
                />

                {/* 가운데 (제목 + 마지막 메시지) */}
                <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900 truncate">
                    {room.title}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(room.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                    {room.lastMessage || "메시지가 없습니다"}
                </p>
                </div>

                {/* 인원수 (그룹일 때만 표시) */}
                {room.memberCount > 2 && (
                <span className="ml-3 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {room.memberCount}명
                </span>
                )}
            </Link>
            </li>
        ))}
        </ul>
    </div>
    );

}