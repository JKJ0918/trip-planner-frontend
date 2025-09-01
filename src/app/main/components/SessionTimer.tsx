// main/components/SessionTimer.tsx
"use client";

import useSessionTimer from "@/app/hooks/useSessionTimer";

function fmt(sec: number | null) {
    if(sec === null) {
        return "--:--"
    }
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SessionTimer() {
    const { loading, error, remaining, isExpiringSoon, reload } = useSessionTimer(); // refresh(구현 예정)

    if(loading){
        return <span className="text-gray-500">check Session...</span>
    }
    
    /*
    if(error) {
        return (
            <button
                onClick={reload}
                className="px-3 py-1 rounded-full border text-red-600 bg-red-50 border-red-200"
                title={error}
            >
                세션 오류 (다시시도)
            </button>
        );
    }
    */

    if(remaining  === null) {
        return <span className="text-gray-500">로그인 해주세요.</span>;
    }

    return(
        <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border
            ${isExpiringSoon ? "bg-yellow-50 border-yellow-300 text-yellow-800" : "bg-gray-50 border-gray-200 text-gray-800"}`}
            title={isExpiringSoon ? "세션 만료 임박" : "세션 정상"}
        >
            <span className="font-mono">{fmt(remaining)}</span>

        </div>
    );
}