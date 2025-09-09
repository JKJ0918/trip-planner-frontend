// src / app / join / components / Modal.tsx
'use client'

import { useEffect, useRef } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children}: ModalProps) {
    
    const panelRef = useRef<HTMLDivElement>(null);

    // ESC 닫기 + 스크롤 잠금
    useEffect (() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.key === 'Escape') {
                onClose();
            };
        };

        if (open) {
            document.addEventListener('keydown', onKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';  
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
        aria-hidden={!open}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        >
        {/* backdrop */}
        <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden
        />
        {/* panel */}
        <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-[101] w-[min(92vw,800px)] max-h-[85vh] overflow-auto rounded-2xl bg-white p-6 shadow-xl"
        >
            <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
            >
                ✕
            </button>
            </div>
            <div className="prose max-w-none prose-sm sm:prose-base">
            {children}
            </div>
        </div>
        </div>
    );
    }