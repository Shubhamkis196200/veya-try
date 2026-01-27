/**
 * FRIEND SYSTEM
 * Add friends, compare charts, compatibility readings
 */
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Friend {
  id: string;
  name: string;
  zodiacSign: string;
  avatarInitial: string;
  addedAt: string;
  compatibility?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserSign: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const FRIENDS_KEY = 'veya_friends';

class FriendService {
  private friends: Friend[] = [];
  
  // Load friends from storage
  async loadFriends(userId: string): Promise<Friend[]> {
    try {
      const stored = await AsyncStorage.getItem(`${FRIENDS_KEY}_${userId}`);
      if (stored) {
        this.friends = JSON.parse(stored);
      }
      return this.friends;
    } catch (error) {
      console.error('Failed to load friends:', error);
      return [];
    }
  }
  
  // Save friends to storage
  async saveFriends(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${FRIENDS_KEY}_${userId}`, JSON.stringify(this.friends));
    } catch (error) {
      console.error('Failed to save friends:', error);
    }
  }
  
  // Add friend manually (for demo/testing)
  async addFriend(userId: string, friend: Omit<Friend, 'id' | 'addedAt'>): Promise<Friend> {
    const newFriend: Friend = {
      id: Date.now().toString(),
      ...friend,
      addedAt: new Date().toISOString(),
      compatibility: this.calculateCompatibility(friend.zodiacSign, 'Aries'), // Default
    };
    
    this.friends.push(newFriend);
    await this.saveFriends(userId);
    return newFriend;
  }
  
  // Remove friend
  async removeFriend(userId: string, friendId: string): Promise<void> {
    this.friends = this.friends.filter(f => f.id !== friendId);
    await this.saveFriends(userId);
  }
  
  // Calculate compatibility between two signs
  calculateCompatibility(sign1: string, sign2: string): number {
    const elements: Record<string, string> = {
      Aries: 'fire', Taurus: 'earth', Gemini: 'air', Cancer: 'water',
      Leo: 'fire', Virgo: 'earth', Libra: 'air', Scorpio: 'water',
      Sagittarius: 'fire', Capricorn: 'earth', Aquarius: 'air', Pisces: 'water',
    };
    
    const modalities: Record<string, string> = {
      Aries: 'cardinal', Taurus: 'fixed', Gemini: 'mutable', Cancer: 'cardinal',
      Leo: 'fixed', Virgo: 'mutable', Libra: 'cardinal', Scorpio: 'fixed',
      Sagittarius: 'mutable', Capricorn: 'cardinal', Aquarius: 'fixed', Pisces: 'mutable',
    };
    
    const compatibleElements: Record<string, string[]> = {
      fire: ['fire', 'air'],
      earth: ['earth', 'water'],
      air: ['air', 'fire'],
      water: ['water', 'earth'],
    };
    
    let score = 50; // Base score
    
    const elem1 = elements[sign1];
    const elem2 = elements[sign2];
    
    // Same element = high compatibility
    if (elem1 === elem2) {
      score += 30;
    }
    // Compatible elements
    else if (compatibleElements[elem1]?.includes(elem2)) {
      score += 20;
    }
    // Challenging elements
    else {
      score -= 10;
    }
    
    // Same modality can be challenging
    if (modalities[sign1] === modalities[sign2]) {
      score -= 5;
    }
    
    // Add some randomness for variety
    score += Math.floor(Math.random() * 15);
    
    return Math.min(Math.max(score, 30), 98);
  }
  
  // Get compatibility details
  getCompatibilityDetails(sign1: string, sign2: string): {
    score: number;
    summary: string;
    strengths: string[];
    challenges: string[];
    advice: string;
  } {
    const score = this.calculateCompatibility(sign1, sign2);
    
    let summary = '';
    let strengths: string[] = [];
    let challenges: string[] = [];
    let advice = '';
    
    if (score >= 80) {
      summary = `✨ ${sign1} and ${sign2} are a cosmic power couple! Your energies naturally align.`;
      strengths = ['Deep understanding', 'Natural chemistry', 'Shared values'];
      challenges = ['May become too comfortable', 'Need external stimulation'];
      advice = 'Keep nurturing your connection with new experiences together.';
    } else if (score >= 60) {
      summary = `💫 ${sign1} and ${sign2} have a harmonious connection with room to grow.`;
      strengths = ['Complementary traits', 'Good communication', 'Mutual respect'];
      challenges = ['Different approaches', 'Need patience'];
      advice = 'Focus on understanding each other\'s unique perspectives.';
    } else if (score >= 40) {
      summary = `🌙 ${sign1} and ${sign2} have an interesting dynamic - different but intriguing.`;
      strengths = ['Growth opportunities', 'Learn from differences', 'Balance each other'];
      challenges = ['Communication gaps', 'Different priorities'];
      advice = 'Embrace your differences as opportunities for growth.';
    } else {
      summary = `🔥 ${sign1} and ${sign2} have a challenging but potentially transformative bond.`;
      strengths = ['Passionate energy', 'Push each other', 'Never boring'];
      challenges = ['Frequent conflicts', 'Different needs'];
      advice = 'Practice patience and seek to understand before reacting.';
    }
    
    return { score, summary, strengths, challenges, advice };
  }
  
  // Get all friends
  getFriends(): Friend[] {
    return this.friends;
  }
}

export const friendService = new FriendService();
export default friendService;
