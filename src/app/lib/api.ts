"use client";

export async function apiGet(path: string, signal?: AbortSignal) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method: "GET",
    credentials: "include", // JWT 쿠키 포함
    signal,
  });
  return res; // 호출한 쪽에서 status 보고 처리
}

export async function apiPost(path: string, body?: unknown, signal?: AbortSignal) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!res.ok) {
    // 401이면 로그인 만료 등일 수 있으니, 여기서 굳이 throw 안 해도 됨(조회수는 부가 기능)
    // throw new Error(`POST ${path} failed: ${res.status}`);
    return res; // 실패해도 조용히 리턴
  }
  return res; 
}

// (옵션) JSON 파싱 헬퍼
export async function toJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}