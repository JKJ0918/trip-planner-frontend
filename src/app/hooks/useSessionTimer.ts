// hooks/useSessionTimer.ts
"use client";

import { tr } from "date-fns/locale";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, toJsonSafe } from "../lib/api";

type SessionInfo = {
  nowEpoch: number;         // 서버현재(초)
  expEpoch: number;         // 만료시각(초)
  remainingSeconds: number; // 남은초
};

export default function useSessionTimer() {
    const [remaining, setRemaining] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const timerRef = useRef<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await apiGet("/api/auth/session");
        if (!res.ok) {
            // 401 등: 로그인 필요/만료
            setRemaining(null);
            if (res.status === 401) {
            const json = await toJsonSafe<{ message?: string }>(res);
            setError(json?.message ?? "세션이 필요합니다.");
            } else {
            setError(`세션 조회 실패 (${res.status})`);
            }
            return;
        }
        const data = (await res.json()) as SessionInfo;
        const start = Math.max(0, Math.floor(data.remainingSeconds));
        setRemaining(start);
        } catch (e) {
        setError("네트워크 오류");
        setRemaining(null);
        } finally {
        setLoading(false);
        }
    }, []);

    // 세션 연장 구현 예정


    // 최초 로드
    useEffect(() => {
        load();
    }, [load]);

    // 카운트 다운 (토큰 유효시간 감소 1초마다)
    useEffect(() => {
        if(remaining === null) {
            return;
        }
        if(timerRef.current) {
            window.clearInterval(timerRef.current);
        }
        timerRef.current = window.setInterval(() => {
            setRemaining(prev => (prev === null ? prev : Math.max(0, prev-1 )));
        }, 1000);
        return () => {
            if(timerRef.current) window.clearInterval(timerRef.current);
        };

    },[remaining]);


    // 만료 처리 
    useEffect(() => {
        if(remaining === 0) {
            // 예: 전역 상태 리셋, 라우팅 등..
            // router.push("login?expired=1");
        }
    }, [remaining]);
        

    return {
        loading,
        error,
        remaining,                        // 남은 초 (null 이면 비로그인/오류)
        isExpiringSoon: (remaining ?? Infinity) <= 60,
        reload: load,
        // refresh,                          // 수동 연장 (POST /refresh) (구현 예정)

    };
}