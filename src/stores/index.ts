export { useUserStore, useAuthStore, getZodiacSign, type UserProfile } from './userStore';

// App store for loading states etc
import { create } from 'zustand';

interface AppStore {
  isLoading: boolean;
  dailyInsight: any;
  setLoading: (loading: boolean) => void;
  setDailyInsight: (insight: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  dailyInsight: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setDailyInsight: (insight) => set({ dailyInsight: insight }),
}));
