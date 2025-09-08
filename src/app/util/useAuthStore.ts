import { create } from 'zustand';

type SocialType = 'naver' | 'kakao' | 'google' | 'local';

type AuthState = {
  socialType: SocialType | null;
  setSocialType: (type: SocialType | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  socialType: null,
  setSocialType: (type) => set({ socialType: type }),
  clear: () => set({ socialType: null }),
}));
