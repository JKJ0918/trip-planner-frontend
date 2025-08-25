"use client";

// 조회수 등록 Hook

import { useEffect, useRef } from "react";
import { apiPost } from "../lib/api";

export function useRegisterView(postId: number, enabled: boolean) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!enabled || sentRef.current || !postId) return;

    const send = () => {
      if (sentRef.current) return;
      sentRef.current = true;

      const ctrl = new AbortController();
      apiPost(`/api/journals/${postId}/view`, undefined, ctrl.signal)
        .catch(() => {
          // 조회수 실패는 사용자 UX에 영향 거의 없음. 조용히 무시.
        });

      // 언마운트 시 요청 취소(불필요 트래픽 방지)
      return () => ctrl.abort();
    };

    // 페이지가 실제로 보일 때만 전송(백그라운드 탭/프리렌더 방지)
    if (typeof document !== "undefined") {
      if (document.visibilityState === "visible") {
        return send();
      } else {
        const onVisible = () => {
          if (document.visibilityState === "visible") {
            const cleanup = send();
            document.removeEventListener("visibilitychange", onVisible);
            return cleanup;
          }
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
      }
    }
  }, [postId, enabled]);
}
