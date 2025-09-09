export type UsernameCheckResult = {
    available: boolean;
    message?: string;
};

export async function usernameCheck(username: string): Promise<UsernameCheckResult> {
    if(!username || username.trim().length < 3){
        return {available: false, message: "아이디는 3자 이상 입력하세요."};
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/username-available?username=${encodeURIComponent(username)}`, {
        method: "GET",
        credentials: "include", // 세션/쿠키 쓰지 않으면 제거 가능
        headers: { "Accept": "application/json" },
    });

    if(!res.ok){
        // 백엔드에서 400/500 등 반환 시
        return { available: false, message: `확인 실패 (${res.status})` };
    }
    
    const json = (await res.json()) as {available: boolean; message?: string};
    return {available: json.available, message: json.message};

}