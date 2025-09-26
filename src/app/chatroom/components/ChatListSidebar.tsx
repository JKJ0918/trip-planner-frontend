"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link";
import { useMe } from "@/app/hooks/useMe";
import { useChatStore } from "../stores/chatStore";


type ChatRoom = {
  roomId: string | number;
  title: string;
  sender: string;
  content: string;
  message: string;
  createdAt: string; // or number/Date

  lastMessage: string; // 마지막 메시지
  lastMessageAt: string; // ISO string

    // 아래는 구현 예정
  memberCount: number; // 대화 수
  
  members: Array<Member>;

};

type Member = {
    nickname: string;
    avatarUrl: string;
    userId: number;
}


export default function ChatListSidebar () {
    

    // 본인 정보 가져오기
    const { me, isLoading, error } = useMe();
    const [meId, setMeId] = useState<number>();
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] =useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);

    //
    const summaries = useChatStore((s) => s.summaries);


    useEffect(() => {
        fetchRooms();
        if(me?.nickname) {
            setMeId(me.id);
            setNickname(me.nickname);
            setEmail(me.email);
            setAvatarUrl(me.avatarUrl);
            
        }

    }, [me])


    // 채팅 리스트 반환
    const fetchRooms = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chatList2`, {
                method: "GET",
                credentials: "include", 
                headers: { "Accept": "application/json" }, // GET에는 Content-Type 불필요
            });

            if(!res){
                throw new Error("네트워크 응답 실패(fetchRooms fail)");
            }

            const data = await res.json(); // JSON 변환
            Array.isArray(data) ? console.table(data) : console.log('data', data);
            setChatRoom(data);
        } catch (error) {
            console.error("채팅방 리스트 불러오기 실패", error);
        }
    }

    
return (
    <div>
            <aside className="w-64 bg-white border-r p-4">
      <h2 className="font-bold mb-3">채팅 목록</h2>
      <ul>
        {Object.values(summaries).map((room) => (
          <li key={room.roomId} className="mb-2">
            <Link href={`/chatroom/${room.roomId}`}>
              <div className="flex flex-col">
                <span className="font-semibold">{room.title}</span>
                <span className="text-sm text-gray-500">
                  {room.lastMessage} ({new Date(room.lastMessageAt).toLocaleTimeString()})
                </span>
              </div>
            </Link>
            
{room.unreadCount && room.unreadCount > 0 && (
  <span className="ml-2 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
    {room.unreadCount}
  </span>
)}

          </li>
        ))}
      </ul>
    </aside>
    
    </div>
    );



}
