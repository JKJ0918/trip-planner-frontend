'use client';

import { useChatTargetStore } from "@/app/chatroom/stores/chatTargetStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Props from CommentSection.tsx(부모)
type Props = {
    writerId: number; // 상대 유저 Id
    writerName: string; // 상대 유저(작성자) nickname
    writerAvatarUrl?: string; // 프로필 이미지
}

export default function AuthorDropdown({
    writerId,
    writerName,
    writerAvatarUrl,
}: Props) {
    const[open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    // zustand
    const setTargetUser = useChatTargetStore((s) => s.setTargetUser);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.key === 'Escape') setOpen(false);
        };

        const onClickOutside = (e: MouseEvent) => {
            const t = e.target as Node;
            if (
                open &&
                menuRef.current &&
                !menuRef.current.contains(t) &&
                btnRef.current &&
                !btnRef.current.contains(t)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onClickOutside);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClickOutside);
        };
    }, [open])

    // 1:1 채팅 클릭 -> targetUser 저장
    const handleStartDmClick = () => {
        setTargetUser({
            id: writerId,
            nickname: writerName,
            avatarUrl: writerAvatarUrl,
        });
        setOpen(false);
        router.push("/chatroom"); //DM 작성 페이지로 이동
    }

    return (
        <span className="relative inline-block">
            <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="font-semibold text-gray-900 hover:underline focus:outline-none cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                {writerName}
            </button>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    tabIndex={-1}
                    className="absolute right z-50 mt-2 w-40 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleStartDmClick}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        1:1 채팅(구현중)
                    </button>
                </div>
            )}

        </span>
    )

}