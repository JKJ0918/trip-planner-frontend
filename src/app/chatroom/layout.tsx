"use client";

import { ReactNode } from "react";
import ChatListSidebar from "./components/ChatListSidebar";

export default function ChatRoomLayout({ children }: { children: ReactNode }) {

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex h-[85vh] max-w-[70%] min-h-[560px] rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        {/* 좌측: 채팅방 목록 */}
        <aside className="w-110 shadow bg-gray-50">
            <ChatListSidebar />
        </aside>

        {/* 우측: 대화창 */}
        <main className="flex-1">{children}</main>
        </div>
    </div>
);


}