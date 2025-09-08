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

    // iframe 호출(팝업/리다이렉트 없이)
    const fireInHiddenIframe = (url: string) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        // 3초 뒤 정리
        setTimeout(() => iframe.remove(), 3000);
    };


    // 로그아웃(로그아웃 클릭 시)
    const socialLogoutPopup = (socialType: SocialType) => {
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

    // 로그아웃(자동 만료용 *팝업 없이)
    // kakao : 공식 redirect 지원 -> 현재 탭 리타이렉트 사용
    // Naver/Google : redirect 파라미터 X, hidden iframe로 로그아웃 후 메인 페이지 이동
    const socialLogoutAuto = (social: SocialType, redirectTo: string) => {
        switch(social) {
            case 'kakao': {
                const url =
                `https://kauth.kakao.com/oauth/logout?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}` +
                `&logout_redirect_uri=${encodeURIComponent(redirectTo)}`;
                // 현재 탭에서 소셜 로그아웃 → 카카오가 redirectTo로 되돌려줌
            window.location.assign(url);
            return; // 이후 코드는 실행되지 않음
        }
            case 'naver':
                fireInHiddenIframe('https://nid.naver.com/nidlogin.logout');
                break;
            case 'google':
                fireInHiddenIframe('https://accounts.google.com/Logout');
                break;
            case 'local':
                break;
        }
        // 네이버/구글은 iframe로 시도 후 우리 페이지로 이동
        window.location.replace(redirectTo);

    };

    
    // 버튼 클릭 로그아웃 (호출)
    const handleLogout = async (redirectTo: string = '/') => {
        // 중복 호출 방지 
        if(inFlight.current) { 
            return;
        }
        inFlight.current = true;

        try {
            const me = await fetchUserInfo();
            const socialType: SocialType = (me?.socialType as SocialType) ?? 'local';

            // 1) 서버 세션/ 쿠기 무효화
            await clearServerSession();

            // 2) 로그아웃
            socialLogoutPopup(socialType);

            // 3) 리다이렉트
            window.location.replace(redirectTo);
        } catch (e) {
            console.error('로그아웃 중 에러', e);
        } finally {
            inFlight.current = false;
        }
    };

    // 자동 만료 로그아웃 (팝업 없이 동작)
    const handleAutoLogout = async (redirectTo: string = '/login?reason=expired') => {
        if(inFlight.current){
            return;
        }
        inFlight.current = true;

        try {
            // 1) 서버 세션/ 쿠키 무효화
            await clearServerSession();
            // 2) 로그아웃
            socialLogoutAuto(socialType, redirectTo);
            // 주의: kakao의 window.location.assign 호출 시, 여기 이후 코드는 실행되지 않음
        } catch (e) {
            console.error('자동 로그아웃 중 에러', e);
        } finally {
            inFlight.current = false;
        }
    };
    

    return {handleLogout, handleAutoLogout};
}