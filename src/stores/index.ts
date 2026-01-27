import { create } from 'zustand';
import { supabase, getProfile } from '../lib/supabase';
import type { Profile, DailyInsight, ChatMessage } from '../types';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAuthenticated: false });
  },
  
  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const profile = await getProfile(user.id);
      set({ profile });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  },
  
  initialize: async () => {
    set({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const profile = await getProfile(user.id);
        set({ user, profile, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

// App State Store
interface AppState {
  // Daily insight
  dailyInsight: DailyInsight | null;
  setDailyInsight: (insight: DailyInsight | null) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  
  // Onboarding state (temporary)
  onboardingData: {
    intent: string | null;
    method: string | null;
    name: string | null;
    dob: string | null;
    birth_time: string | null;
    birth_place: string | null;
  };
  setOnboardingData: (data: Partial<AppState['onboardingData']>) => void;
  clearOnboardingData: () => void;
  
  // UI State
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  dailyInsight: null,
  setDailyInsight: (dailyInsight) => set({ dailyInsight }),
  
  chatMessages: [],
  addChatMessage: (message) => set({ chatMessages: [...get().chatMessages, message] }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  
  onboardingData: {
    intent: null,
    method: null,
    name: null,
    dob: null,
    birth_time: null,
    birth_place: null,
  },
  setOnboardingData: (data) => set({ 
    onboardingData: { ...get().onboardingData, ...data } 
  }),
  clearOnboardingData: () => set({
    onboardingData: {
      intent: null,
      method: null,
      name: null,
      dob: null,
      birth_time: null,
      birth_place: null,
    }
  }),
  
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
