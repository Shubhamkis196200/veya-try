import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = 'https://ennlryjggdoljgbqhttb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Nzg3ODMsImV4cCI6MjA4NTA1NDc4M30.FOlCuYFogxXTdvgUTMw7Em4-dn2ANRRAHdf6WeJi3yY';

// Custom storage adapter for Expo
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helpers
export const auth = {
  // Sign up with email
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  // User profile
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    upsert: async (profile: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single();
      return { data, error };
    },

    update: async (userId: string, updates: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    },
  },

  // Journal entries
  journal: {
    list: async (userId: string, limit = 30) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return { data, error };
    },

    create: async (entry: any) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entry)
        .select()
        .single();
      return { data, error };
    },

    delete: async (entryId: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      return { error };
    },
  },

  // Favorites (affirmations, readings, etc)
  favorites: {
    list: async (userId: string, type?: string) => {
      let query = supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      return { data, error };
    },

    add: async (favorite: any) => {
      const { data, error } = await supabase
        .from('favorites')
        .insert(favorite)
        .select()
        .single();
      return { data, error };
    },

    remove: async (favoriteId: string) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      return { error };
    },
  },

  // Daily readings (cached)
  readings: {
    getToday: async (userId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      return { data, error };
    },

    save: async (reading: any) => {
      const { data, error } = await supabase
        .from('daily_readings')
        .upsert(reading)
        .select()
        .single();
      return { data, error };
    },
  },
};

export default supabase;
