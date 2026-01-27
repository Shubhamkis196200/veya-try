/**
 * FRIEND SYSTEM
 * Complete friend management with Supabase backend + local fallback
 */
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Friend {
  id: string;
  user_id: string;
  friend_user_id?: string; // If they're a Veya user
  name: string;
  username?: string;
  zodiac_sign: string;
  avatar_initial: string;
  added_at: string;
  compatibility_score?: number;
  last_checked?: string;
}

export interface FriendSearchResult {
  id: string;
  name: string;
  username: string;
  zodiac_sign: string;
  avatar_initial: string;
  is_friend: boolean;
}

export interface CompatibilityResult {
  score: number;
  summary: string;
  emoji: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  romance: number;
  communication: number;
  trust: number;
  longTerm: number;
}

const FRIENDS_STORAGE_KEY = 'veya_friends_v2';

// Zodiac element mapping
const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: 'fire', Taurus: 'earth', Gemini: 'air', Cancer: 'water',
  Leo: 'fire', Virgo: 'earth', Libra: 'air', Scorpio: 'water',
  Sagittarius: 'fire', Capricorn: 'earth', Aquarius: 'air', Pisces: 'water',
};

// Zodiac modality mapping
const ZODIAC_MODALITIES: Record<string, string> = {
  Aries: 'cardinal', Taurus: 'fixed', Gemini: 'mutable', Cancer: 'cardinal',
  Leo: 'fixed', Virgo: 'mutable', Libra: 'cardinal', Scorpio: 'fixed',
  Sagittarius: 'mutable', Capricorn: 'cardinal', Aquarius: 'fixed', Pisces: 'mutable',
};

// Compatible elements
const COMPATIBLE_ELEMENTS: Record<string, string[]> = {
  fire: ['fire', 'air'],
  earth: ['earth', 'water'],
  air: ['air', 'fire'],
  water: ['water', 'earth'],
};

// Zodiac symbols
export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

// Zodiac sign list
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

class FriendService {
  private friends: Friend[] = [];
  private userId: string = '';
  
  /**
   * Initialize the friend service for a user
   */
  async initialize(userId: string): Promise<Friend[]> {
    this.userId = userId;
    
    // Try to load from Supabase first
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });
      
      if (!error && data) {
        this.friends = data;
        // Cache locally
        await this.cacheLocally();
        return this.friends;
      }
    } catch (err) {
      console.warn('Supabase friends fetch failed, using local:', err);
    }
    
    // Fallback to local storage
    return this.loadFromLocal(userId);
  }
  
  /**
   * Load friends from local storage (fallback)
   */
  private async loadFromLocal(userId: string): Promise<Friend[]> {
    try {
      const stored = await AsyncStorage.getItem(`${FRIENDS_STORAGE_KEY}_${userId}`);
      if (stored) {
        this.friends = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load friends from local:', error);
      this.friends = [];
    }
    return this.friends;
  }
  
  /**
   * Cache friends locally
   */
  private async cacheLocally(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${FRIENDS_STORAGE_KEY}_${this.userId}`,
        JSON.stringify(this.friends)
      );
    } catch (error) {
      console.error('Failed to cache friends:', error);
    }
  }
  
  /**
   * Search for users by name or username
   */
  async searchUsers(query: string, currentUserId: string): Promise<FriendSearchResult[]> {
    if (!query || query.length < 2) return [];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, zodiac_sign, sun_sign')
        .or(`name.ilike.%${query}%`)
        .neq('id', currentUserId)
        .limit(10);
      
      if (error || !data) return [];
      
      return data.map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        username: user.name?.toLowerCase().replace(/\s+/g, '') || '',
        zodiac_sign: user.sun_sign || user.zodiac_sign || 'Unknown',
        avatar_initial: (user.name || 'U')[0].toUpperCase(),
        is_friend: this.friends.some(f => f.friend_user_id === user.id),
      }));
    } catch (err) {
      console.error('Search users failed:', err);
      return [];
    }
  }
  
  /**
   * Add a friend (either from search or manual)
   */
  async addFriend(
    friendData: {
      name: string;
      zodiac_sign: string;
      friend_user_id?: string;
      username?: string;
    },
    userSign: string
  ): Promise<Friend> {
    const newFriend: Friend = {
      id: `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.userId,
      friend_user_id: friendData.friend_user_id,
      name: friendData.name.trim(),
      username: friendData.username,
      zodiac_sign: friendData.zodiac_sign,
      avatar_initial: friendData.name.trim()[0].toUpperCase(),
      added_at: new Date().toISOString(),
      compatibility_score: this.calculateCompatibility(userSign, friendData.zodiac_sign).score,
    };
    
    // Try to save to Supabase
    try {
      const { data, error } = await supabase
        .from('friends')
        .insert(newFriend)
        .select()
        .single();
      
      if (!error && data) {
        newFriend.id = data.id;
      }
    } catch (err) {
      console.warn('Failed to save friend to Supabase:', err);
    }
    
    // Add to local list
    this.friends.unshift(newFriend);
    await this.cacheLocally();
    
    return newFriend;
  }
  
  /**
   * Add friend from Veya user search result
   */
  async addFriendFromSearch(
    searchResult: FriendSearchResult,
    userSign: string
  ): Promise<Friend> {
    return this.addFriend({
      name: searchResult.name,
      zodiac_sign: searchResult.zodiac_sign,
      friend_user_id: searchResult.id,
      username: searchResult.username,
    }, userSign);
  }
  
  /**
   * Remove a friend
   */
  async removeFriend(friendId: string): Promise<void> {
    // Try to remove from Supabase
    try {
      await supabase
        .from('friends')
        .delete()
        .eq('id', friendId);
    } catch (err) {
      console.warn('Failed to remove friend from Supabase:', err);
    }
    
    // Remove from local list
    this.friends = this.friends.filter(f => f.id !== friendId);
    await this.cacheLocally();
  }
  
  /**
   * Get all friends
   */
  getFriends(): Friend[] {
    return [...this.friends];
  }
  
  /**
   * Get a single friend by ID
   */
  getFriend(friendId: string): Friend | undefined {
    return this.friends.find(f => f.id === friendId);
  }
  
  /**
   * Calculate compatibility score between two signs
   */
  calculateCompatibility(sign1: string, sign2: string): CompatibilityResult {
    const elem1 = ZODIAC_ELEMENTS[sign1] || 'fire';
    const elem2 = ZODIAC_ELEMENTS[sign2] || 'fire';
    const mod1 = ZODIAC_MODALITIES[sign1] || 'cardinal';
    const mod2 = ZODIAC_MODALITIES[sign2] || 'cardinal';
    
    let score = 50; // Base score
    
    // Element compatibility
    if (elem1 === elem2) {
      score += 25; // Same element = strong connection
    } else if (COMPATIBLE_ELEMENTS[elem1]?.includes(elem2)) {
      score += 18; // Compatible elements
    } else {
      score -= 5; // Challenging elements
    }
    
    // Same sign bonus
    if (sign1 === sign2) {
      score += 10;
    }
    
    // Modality interaction
    if (mod1 === mod2) {
      score -= 3; // Same modality can cause friction
    } else {
      score += 5; // Different modalities complement
    }
    
    // Opposite signs bonus (they attract!)
    const opposites: Record<string, string> = {
      Aries: 'Libra', Taurus: 'Scorpio', Gemini: 'Sagittarius',
      Cancer: 'Capricorn', Leo: 'Aquarius', Virgo: 'Pisces',
    };
    if (opposites[sign1] === sign2 || opposites[sign2] === sign1) {
      score += 12;
    }
    
    // Add some natural variation (based on sign names for consistency)
    const hash = (sign1 + sign2).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    score += (hash % 13) - 6;
    
    // Clamp score
    score = Math.min(Math.max(score, 25), 98);
    
    // Calculate sub-scores
    const romance = Math.min(98, score + (elem1 === 'fire' || elem1 === 'water' ? 8 : 0));
    const communication = Math.min(98, score + (elem1 === 'air' || elem2 === 'air' ? 10 : -5));
    const trust = Math.min(98, score + (elem1 === 'earth' || elem2 === 'earth' ? 12 : 0));
    const longTerm = Math.round((score + trust + communication) / 3);
    
    // Generate result
    let emoji = '💫';
    let summary = '';
    let strengths: string[] = [];
    let challenges: string[] = [];
    let advice = '';
    
    if (score >= 85) {
      emoji = '✨';
      summary = `${sign1} and ${sign2} share an extraordinary cosmic bond! Your energies naturally harmonize, creating a powerful connection.`;
      strengths = [
        'Deep intuitive understanding',
        'Natural emotional chemistry',
        'Shared values and vision',
        'Effortless communication'
      ];
      challenges = [
        'May become too comfortable',
        'Could benefit from outside perspectives'
      ];
      advice = 'Nurture this special connection by continuing to grow together. Plan adventures and set shared goals!';
    } else if (score >= 70) {
      emoji = '💜';
      summary = `${sign1} and ${sign2} have a wonderful, harmonious connection with genuine understanding.`;
      strengths = [
        'Strong mutual respect',
        'Good communication flow',
        'Complementary strengths',
        'Emotional support'
      ];
      challenges = [
        'Different paces sometimes',
        'Need to stay present'
      ];
      advice = 'Keep the spark alive with meaningful conversations and quality time together.';
    } else if (score >= 55) {
      emoji = '💫';
      summary = `${sign1} and ${sign2} have good potential with room for beautiful growth.`;
      strengths = [
        'Learning from differences',
        'Balancing perspectives',
        'Growth opportunities'
      ];
      challenges = [
        'Communication styles differ',
        'Need patience at times'
      ];
      advice = 'Focus on understanding each other\'s unique perspective. Differences can become strengths!';
    } else if (score >= 40) {
      emoji = '🌙';
      summary = `${sign1} and ${sign2} bring different energies - intriguing but requires effort.`;
      strengths = [
        'Push each other to grow',
        'Unique perspectives',
        'Never boring together'
      ];
      challenges = [
        'Different priorities',
        'Communication gaps',
        'Patience needed'
      ];
      advice = 'Embrace your differences as opportunities for growth. Practice active listening.';
    } else {
      emoji = '🔥';
      summary = `${sign1} and ${sign2} have a challenging but potentially transformative dynamic.`;
      strengths = [
        'Intense energy exchange',
        'Catalysts for change',
        'Passionate interactions'
      ];
      challenges = [
        'Frequent misunderstandings',
        'Very different needs',
        'Requires conscious effort'
      ];
      advice = 'This bond requires work but can lead to profound personal growth. Focus on empathy.';
    }
    
    return {
      score,
      summary,
      emoji,
      strengths,
      challenges,
      advice,
      romance,
      communication,
      trust,
      longTerm,
    };
  }
  
  /**
   * Get detailed compatibility between user and a friend
   */
  getCompatibilityDetails(userSign: string, friend: Friend): CompatibilityResult {
    return this.calculateCompatibility(userSign, friend.zodiac_sign);
  }
  
  /**
   * Update friend's compatibility score
   */
  async updateCompatibilityScore(friendId: string, userSign: string): Promise<Friend | null> {
    const friend = this.friends.find(f => f.id === friendId);
    if (!friend) return null;
    
    const compat = this.calculateCompatibility(userSign, friend.zodiac_sign);
    friend.compatibility_score = compat.score;
    friend.last_checked = new Date().toISOString();
    
    // Update in Supabase
    try {
      await supabase
        .from('friends')
        .update({
          compatibility_score: compat.score,
          last_checked: friend.last_checked,
        })
        .eq('id', friendId);
    } catch (err) {
      console.warn('Failed to update compatibility in Supabase:', err);
    }
    
    await this.cacheLocally();
    return friend;
  }
  
  /**
   * Get friends sorted by compatibility
   */
  getFriendsByCompatibility(): Friend[] {
    return [...this.friends].sort(
      (a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0)
    );
  }
  
  /**
   * Get element color for a zodiac sign
   */
  getElementColor(sign: string): string {
    const element = ZODIAC_ELEMENTS[sign];
    const colors: Record<string, string> = {
      fire: '#FF6B35',
      earth: '#6B8E23',
      air: '#87CEEB',
      water: '#4169E1',
    };
    return colors[element] || '#A855F7';
  }
  
  /**
   * Get element name for a zodiac sign
   */
  getElement(sign: string): string {
    return ZODIAC_ELEMENTS[sign] || 'unknown';
  }
}

export const friendService = new FriendService();
export default friendService;
