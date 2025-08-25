export async function apiPost(path: string, body?: unknown, signal?: AbortSignal) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // JWT 쿠키 포함
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
