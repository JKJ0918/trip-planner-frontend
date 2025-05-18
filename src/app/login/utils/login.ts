
// login/utils/login.ts
export const Login = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8080/login", {
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
    console.log("jwt 로그인 데이터 백엔드에서 프론트로 전송 완료");

    const data = await response.json();
    localStorage.setItem("Authorization", data.accessToken);
    document.cookie = `refresh=${data.refresh}; path=/; max-age=604800;`;

    return true;
  } catch (error) {
    console.error("에러 발생:", error);
    return false;
  }
};
