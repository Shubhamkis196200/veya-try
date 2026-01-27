import { create } from 'zustand';
import { supabase, auth, db } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// Profile type
interface Profile {
  id: string;
  email?: string;
  name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  birth_location?: string;  // Alias for birth_place
  dob?: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  zodiac_sign?: string;
  element?: string;
  ruling_planet?: string;
  personality_summary?: string;
  intent?: string;
  fortune_method?: string;
  notifications_enabled?: boolean;
  premium?: boolean;
}

// Auth Store
interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  setProfile: (profile: Profile | null) => void;
  setOnboarded: (value: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isOnboarded: false,

  initialize: async () => {
    try {
      const session = await auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await db.profiles.get(session.user.id);
        
        set({
          user: session.user,
          session,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth changes
      auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await db.profiles.get(session.user.id);
          set({
            user: session.user,
            session,
            profile,
            isAuthenticated: true,
          });
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error('Auth init error:', error);
      set({ isLoading: false });
    }
  },

  signUp: async (email, password) => {
    const { data, error } = await auth.signUp(email, password);
    if (!error && data?.user) {
      set({ user: data.user, session: data.session, isAuthenticated: true });
    }
    return { error };
  },

  signIn: async (email, password) => {
    const { data, error } = await auth.signIn(email, password);
    if (!error && data?.user) {
      const { data: profile } = await db.profiles.get(data.user.id);
      set({ 
        user: data.user, 
        session: data.session, 
        profile,
        isAuthenticated: true 
      });
    }
    return { error };
  },

  signOut: async () => {
    await auth.signOut();
    set({ user: null, session: null, profile: null, isAuthenticated: false });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await db.profiles.update(user.id, updates);
    if (!error && data) {
      set({ profile: data });
    }
    return { error };
  },

  setProfile: (profile) => set({ profile }),

  setOnboarded: async (value: boolean) => {
    set({ isOnboarded: value });
    // Persist to AsyncStorage if needed
  },
}));

// Journal Store
interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  mood_emoji: string;
  energy: number;
  gratitude: string;
  reflection: string;
  moon_phase?: string;
  created_at: string;
}

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: any }>;
  deleteEntry: (id: string) => Promise<{ error: any }>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isLoading: false,

  loadEntries: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    const { data, error } = await db.journal.list(user.id);
    
    if (!error && data) {
      set({ entries: data });
    }
    set({ isLoading: false });
  },

  addEntry: async (entry) => {
    const user = useAuthStore.getState().user;
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await db.journal.create({
      ...entry,
      user_id: user.id,
    });

    if (!error && data) {
      set({ entries: [data, ...get().entries] });
    }
    return { error };
  },

  deleteEntry: async (id) => {
    const { error } = await db.journal.delete(id);
    if (!error) {
      set({ entries: get().entries.filter(e => e.id !== id) });
    }
    return { error };
  },
}));

// App Store (UI state, daily insights, etc)
interface OnboardingData {
  intent?: string;
  fortune_method?: string;
  method?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  name?: string;
  dob?: string;
}

interface AppState {
  dailyInsight: any | null;
  isGenerating: boolean;
  hasCompletedOnboarding: boolean;
  onboardingData: OnboardingData;
  
  setDailyInsight: (insight: any) => void;
  setIsGenerating: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  dailyInsight: null,
  isGenerating: false,
  hasCompletedOnboarding: false,
  onboardingData: {},

  setDailyInsight: (insight) => set({ dailyInsight: insight }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  setOnboardingData: (data) => set({ onboardingData: { ...get().onboardingData, ...data } }),
  clearOnboardingData: () => set({ onboardingData: {} }),
}));

// Favorites Store
interface Favorite {
  id: string;
  user_id: string;
  type: string;
  content: any;
  created_at: string;
}

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  
  loadFavorites: (type?: string) => Promise<void>;
  addFavorite: (type: string, content: any) => Promise<{ error: any }>;
  removeFavorite: (id: string) => Promise<{ error: any }>;
  isFavorite: (type: string, contentId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  loadFavorites: async (type) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    const { data, error } = await db.favorites.list(user.id, type);
    
    if (!error && data) {
      set({ favorites: data });
    }
    set({ isLoading: false });
  },

  addFavorite: async (type, content) => {
    const user = useAuthStore.getState().user;
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await db.favorites.add({
      user_id: user.id,
      type,
      content,
    });

    if (!error && data) {
      set({ favorites: [data, ...get().favorites] });
    }
    return { error };
  },

  removeFavorite: async (id) => {
    const { error } = await db.favorites.remove(id);
    if (!error) {
      set({ favorites: get().favorites.filter(f => f.id !== id) });
    }
    return { error };
  },

  isFavorite: (type, contentId) => {
    return get().favorites.some(
      f => f.type === type && f.content?.id === contentId
    );
  },
}));
