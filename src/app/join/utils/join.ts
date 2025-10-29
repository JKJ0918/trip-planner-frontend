//join.utils/join.ts
export const Join = async (username: string, password: string,
     nickname: string, name: string, email: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ← 추후 쿠키 받으려면 필요
      body: JSON.stringify({ username, password, nickname, name, email }),
    });

    if (!response.ok) {
      console.error("회원가입 실패");
      return false;
    }

    return true;
  } catch (error) {
    console.error("에러 발생:", error);
    return false;
  }
};