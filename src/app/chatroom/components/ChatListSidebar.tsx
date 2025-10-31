"use client"

import { useEffect, useState } from "react"
import Link from "next/link";
import { useMe } from "@/app/hooks/useMe";
import { useChatStore } from "../stores/chatStore";


export default function ChatListSidebar () {
    

    // 본인 정보 가져오기
    const { me, isLoading, error } = useMe();
    const [meId, setMeId] = useState<number>();
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] =useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    // const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);

    //
    const summaries = useChatStore((s) => s.summaries);


    useEffect(() => {
        //fetchRooms();
        if(me?.nickname) {
            setMeId(me.id);
            setNickname(me.nickname);
            setEmail(me.email);
            setAvatarUrl(me.avatarUrl);
            
        }

    }, [me])

    
return (
    <div>
 {/* 채팅 목록 사이드바 */}
        <div className="w-80 min-w-full bg-white flex flex-col">
          {/* 상단 헤더 */}
          <div className="p-4 bg-white sticky top-0 z-10">
            <h2 className="font-bold text-lg">채팅 목록</h2>
          </div>

          {/* 리스트 */}
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {Object.values(summaries).map((room: any) => {
              const unread = room.unreadCount && room.unreadCount > 0;
              const myId = me?.id;
              const otherMembers = room.members.filter((m: any) => m.userId !== myId);
              return (
                <li key={room.roomId}>
                  <Link href={`/chatroom/${room.roomId}`} className="block">
                    <div
                      className={[
                        "group flex items-start gap-3 rounded-xl p-3 border border-transparent",
                        "hover:bg-gray-50 active:bg-gray-100",
                        "data-[active=true]:border-blue-500 data-[active=true]:bg-blue-50",
                      ].join(" ")}
                    >
                      {/* 프로필 사진 */}
                      <div className="flex -space-x-2">
                        {otherMembers.slice(0, 2).map((m: any) =>(
                          <img
                            key={m.userId}
                            src={`${m.avatarUrl}`}
                            alt={`${room.writerName} 프로필`} // 이미지 미로드 대체 텍스트 
                            className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                        {otherMembers.length > 2 && (
                          <span className="w-8 h-8 rounded-full bg-gray-200 text-xs flex items-center justify-center">
                            +{otherMembers.length - 2}
                          </span>
                        )}

                      </div>
                      
                      {/* 본문 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {/* 나 자신 제외한 멤버 닉네임 표시 */}
                          <span>
                          {room.members
                              .filter((m: any) => m.userId !== myId) // 내 아이디 제외
                              .map((m: any) => m.nickname)
                              .join(", ")}
                          </span>
                            
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-sm text-gray-500 truncate">
                            {room.lastMessage || "메시지가 없습니다."}
                          </p>
                          <span className="ml-auto shrink-0 text-xs text-gray-400">
                            {new Date(room.lastMessageAt).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

    </div>
    );
}
