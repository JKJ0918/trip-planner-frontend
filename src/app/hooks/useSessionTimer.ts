// hooks/useSessionTimer.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiPost, toJsonSafe } from "../lib/api";
import { useLogout } from "./useLogout";

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
    const {handleLogout} = useLogout();
    const fired = useRef(false);

    // 세션 시간 표현
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

    // 세션 연장 구현
    const refresh = useCallback(async () => {
        try {
            const res = await apiPost("/reissue");
            if(!res.ok) {
                // 연장 실패시
                const json = await toJsonSafe<{ message?: string }>(res);
                setError(json?.message ?? "세션 연장 실패");
                return;
            }
            // 성공 후 세 쿠키로 다시 세션 조회해서 remainingSeconds 재설정
            await load();
            setError(null);
        } catch {
                setError("세션 연장 실패");
        } 
    }, [load]);


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
        if(remaining === 0 && !fired.current) {
            fired.current = true;
            alert("로그인 유효 시간이 만료되었습니다. 다시 로그인해 주세요.");
            
            // 팝업 없이 자동 처리
            // 팝업 차단 문제로 만료에 의한 소셜로그아웃 까지는 안됨, 직접 로그아웃을 눌러야함
            //  iframe 우회도 해봤지만, iframe을 거절하는 곳도 있음

            handleLogout('/login?reason=expired');
            
        }
    }, [remaining]);
        

    return {
        loading,
        error,
        remaining,                        // 남은 초 (null 이면 비로그인/오류)
        isExpiringSoon: (remaining ?? Infinity) <= 1800,
        reload: load,
        refresh,                          // 수동 연장 (POST /refresh)

    };
}