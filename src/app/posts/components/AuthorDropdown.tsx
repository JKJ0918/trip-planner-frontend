'use client';

import { useEffect, useRef, useState } from "react";

// props 보낼 예정 틀만 구현중
type Props = {
    writerName: string;
}

export default function AuthorDropdown( {writerName}:Props) {
    const[open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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
                    <a
                        href={'/'}
                        role="menuitem"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        1:1 채팅(구현중)
                    </a>
                </div>
            )}

        </span>
    )

}