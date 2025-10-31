
// login/utils/login.ts
export const Login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ← 추후 쿠키 받으려면 필요
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      console.error("로그인 실패");
      return false;
    }

    const data = await response.json();
    // document.cookie = `Authorization=${data.accessToken}; path=/; max-age=604800;`;
    // document.cookie = `refresh=${data.refresh}; path=/; max-age=604800;`;

    return true;
  } catch (error) {
    console.error("에러 발생:", error);
    return false;
  }
};
