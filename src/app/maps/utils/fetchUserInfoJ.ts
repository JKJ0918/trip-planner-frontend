// utils/fetchUserInfoJ.ts
export async function fetchUserInfoJ() {
  try {
    const res = await fetch("http://localhost:8080/api/journals/auth/me", {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!res.ok) {
      throw new Error("유저 정보를 가져오지 못했습니다.");
    }

    return await res.json(); // 예: { userId = "2" } 숫자이지만 문자로 받아옴.
  } catch (err) {
    console.error("fetchUserInfo 실패:", err);
    return null;
  }
}
