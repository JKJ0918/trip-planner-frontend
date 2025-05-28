// store/locationStore.ts
import { create } from 'zustand';

interface LocationState {
  lat: number;
  lng: number;
  setLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: 37.5665, // 기본값: 서울
  lng: 126.9780,
  setLocation: (lat, lng) => set({ lat, lng }),
}));
