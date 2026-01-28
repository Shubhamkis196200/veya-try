/**
 * USER STORE - Complete
 * Matches what existing screens expect
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  birthDate: string;
  birth_date?: string;
  birthTime?: string;
  birth_time?: string;
  birth_place?: string;
  birth_location?: string;
  sunSign: string;
  sun_sign?: string;
  zodiac_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  moonSign?: string;
  risingSign?: string;
  intent?: string;
  method?: string;
  element?: string;
  fortune_method?: string;
  email?: string;
  ruling_planet?: string;
  personality_summary?: string;
  onboarded: boolean;
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboarded: (value: boolean) => void;
  signOut: () => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      
      setProfile: (profile) => set({ 
        profile: {
          ...profile,
          sun_sign: profile.sunSign || profile.sun_sign,
          zodiac_sign: profile.sunSign || profile.sun_sign,
          birth_date: profile.birthDate || profile.birth_date,
          birth_time: profile.birthTime || profile.birth_time,
        }
      }),
      
      updateProfile: (updates) => {
        const current = get().profile;
        if (current) {
          set({ 
            profile: { 
              ...current, 
              ...updates,
              sun_sign: updates.sunSign || updates.sun_sign || current.sun_sign,
              zodiac_sign: updates.sunSign || updates.sun_sign || current.zodiac_sign,
            } 
          });
        } else {
          set({ 
            profile: { 
              name: '',
              birthDate: '',
              sunSign: '',
              onboarded: false,
              ...updates 
            } as UserProfile 
          });
        }
      },
      
      setOnboarded: (value) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, onboarded: value } });
        }
      },
      
      signOut: () => set({ profile: null }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'veya-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Aliases for compatibility
export const useAuthStore = useUserStore;

// Helper to get zodiac sign from birth date
export function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}
