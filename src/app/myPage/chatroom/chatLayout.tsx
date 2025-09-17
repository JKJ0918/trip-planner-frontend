'use client';
// app/myPage/layout.tsx
import { ReactNode } from 'react';
import ChatList from '../components/ChatListSidebar';


interface ChatLayoutProps {
  children: ReactNode;
}

export default function chatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-800 text-white">
        <ChatList />
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}