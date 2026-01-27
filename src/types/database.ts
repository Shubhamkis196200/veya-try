export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          dob: string | null
          birth_time: string | null
          birth_place: string | null
          fortune_method: string | null
          intent: string | null
          zodiac_sign: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          dob?: string | null
          birth_time?: string | null
          birth_place?: string | null
          fortune_method?: string | null
          intent?: string | null
          zodiac_sign?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          dob?: string | null
          birth_time?: string | null
          birth_place?: string | null
          fortune_method?: string | null
          intent?: string | null
          zodiac_sign?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_insights: {
        Row: {
          id: string
          user_id: string
          date: string
          theme: string
          energy_summary: string
          do_list: Json
          avoid_list: Json
          lucky_color: string
          lucky_number: number
          lucky_time: string
          gem_name: string
          gem_reason: string
          focus_area: string | null
          energy_level: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          theme: string
          energy_summary: string
          do_list: Json
          avoid_list: Json
          lucky_color: string
          lucky_number: number
          lucky_time: string
          gem_name: string
          gem_reason: string
          focus_area?: string | null
          energy_level: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          theme?: string
          energy_summary?: string
          do_list?: Json
          avoid_list?: Json
          lucky_color?: string
          lucky_number?: number
          lucky_time?: string
          gem_name?: string
          gem_reason?: string
          focus_area?: string | null
          energy_level?: number
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}

// App Types
export interface Profile {
  id: string;
  name: string | null;
  dob: string | null;
  birth_time: string | null;
  birth_place: string | null;
  fortune_method: string | null;
  intent: string | null;
  zodiac_sign: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyInsight {
  id: string;
  user_id: string;
  date: string;
  theme: string;
  energy_summary: string;
  do_list: string[];
  avoid_list: string[];
  lucky_color: string;
  lucky_number: number;
  lucky_time: string;
  gem_name: string;
  gem_reason: string;
  focus_area: string | null;
  energy_level: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
