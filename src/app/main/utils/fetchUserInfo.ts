// utils/fetchUserInfo.ts
export async function fetchUserInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/me`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!res.ok) {
      throw new Error("유저 정보를 가져오지 못했습니다.");
    }

    return await res.json(); // 예: { username: "...", socialType: "google" }
  } catch (err) {
    console.error("fetchUserInfo 실패:", err);
    return null;
  }
}