"use client";

import { ReactNode } from "react";
import ChatListSidebar from "../components/ChatListSidebar";

export default function ChatRoomLayout({ children }: { children: ReactNode }) {

    return(
        <div className="flex h-[75vh] min-h-[560px] rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
            {/* 좌측: 채팅방 목록 */}
            <aside className="w-80 border-r bg-gray-50">
                <ChatListSidebar />
            </aside>

            {/* 우측: 대화창 */}
            <main className="flex-1">{children}</main>
        </div>
    );

}