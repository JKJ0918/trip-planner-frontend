export const logout = async () => {
  try {
    const response = await fetch("http://localhost:8080/logout", {
      method: "POST", // 백엔드 설정에 맞게
      credentials: "include", // 쿠키 포함
    });

    if (response.ok) {
      return true;
    } else {
      console.error("로그아웃 실패");
      return false;
    }
  } catch (error) {
    console.error("네트워크 에러:", error);
    return false;
  }
};