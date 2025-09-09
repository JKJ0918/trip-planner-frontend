// 로그아웃 훅

import { useRef } from "react";
import { fetchUserInfo } from "../main/utils/fetchUserInfo";
import { useAuthStore } from "../util/useAuthStore";

type SocialType = 'naver' | 'kakao' | 'google' | 'local';

export function useLogout() {
    // zustand 유저 socialType 
    const socialType = useAuthStore((state) => state.socialType);

    // 개발 모드 StrictMode로 인한 이펙트 2회 호출 방지
    const inFlight = useRef(false);

    // 서버 세션/ 쿠기 무효화
    const clearServerSession = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/logout`, {method: 'POST', credentials: 'include'});
    }

    // 소셜 로그아웃
    const socialLogout = (socialType: SocialType) => {
    switch (socialType) {
      case 'naver':
            window.open('https://nid.naver.com/nidlogin.logout', '_blank', 'width=1,height=1');
            break;
        case 'kakao':
            window.open(
            `https://kauth.kakao.com/oauth/logout?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&logout_redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_LOGOUT_REDIRECT ?? `${process.env.NEXT_PUBLIC_API_BASE}/`)}`,
            '_blank',
            'width=500,height=600'
            );
            break;
        case 'google':
            window.open('https://accounts.google.com/Logout', '_blank', 'width=500,height=600');
            break;
        case 'local':
            break;
        }
    };


    // 
    const handleLogout = async (redirectTo: string = '/') => {
        // 중복 호출 방지 
        if(inFlight.current) { 
            return;
        }
        inFlight.current = true;

        try {
            // const me = await fetchUserInfo();
            // const socialType: SocialType = (me?.socialType as SocialType) ?? 'local';

            // 1) 서버 세션/ 쿠기 무효화
            await clearServerSession();

            // 2) 소셜 로그아웃
            if(socialType){
            socialLogout(socialType);
            }

            // 3) 리다이렉트
            window.location.replace(redirectTo);
        } catch (e) {
            console.error('로그아웃 중 에러', e);
        } finally {
            inFlight.current = false;
        }
    }

    return {handleLogout};
}