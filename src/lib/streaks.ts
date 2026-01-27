/**
 * ENGAGEMENT STREAKS SYSTEM
 * Daily streaks, XP, levels, achievement badges
 * Gamification engine for Veya
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ TYPES ============

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  badges: Badge[];
  level: number;
  xp: number;
  totalXp: number;
  streakFreezes: number; // Protect streaks
  weeklyGoal: number;
  weeklyProgress: number;
  weekStartDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string | null;
  requirement: number;
  category: 'streak' | 'total' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CheckInResult {
  streakIncreased: boolean;
  streakBroken: boolean;
  newBadges: Badge[];
  leveledUp: boolean;
  xpGained: number;
  newLevel: number;
  isNewDay: boolean;
}

// ============ CONSTANTS ============

const STREAK_KEY = 'veya_streaks_v2';

// XP rewards
const XP_REWARDS = {
  dailyCheckIn: 10,
  streakBonus: 5, // Per day of streak (caps at 50)
  weekStreak: 100,
  badgeUnlock: 50,
  readingComplete: 15,
  journalEntry: 20,
  tarotReading: 25,
  friendConnect: 30,
  perfectWeek: 150,
} as const;

const XP_PER_LEVEL = 100;
const MAX_STREAK_BONUS = 50;

// Achievement Badges
const BADGES: Omit<Badge, 'unlockedAt'>[] = [
  // Streak Badges
  { id: 'first_spark', name: 'First Spark', description: 'Your cosmic journey begins', emoji: '🌟', requirement: 1, category: 'streak', rarity: 'common' },
  { id: 'streak_3', name: 'Star Seeker', description: '3 day streak', emoji: '⭐', requirement: 3, category: 'streak', rarity: 'common' },
  { id: 'streak_7', name: 'Moon Child', description: '7 day streak', emoji: '🌙', requirement: 7, category: 'streak', rarity: 'common' },
  { id: 'streak_14', name: 'Cosmic Explorer', description: '2 week streak', emoji: '🚀', requirement: 14, category: 'streak', rarity: 'rare' },
  { id: 'streak_21', name: 'Nebula Walker', description: '3 week streak', emoji: '🌌', requirement: 21, category: 'streak', rarity: 'rare' },
  { id: 'streak_30', name: 'Astral Master', description: '30 day streak', emoji: '✨', requirement: 30, category: 'streak', rarity: 'epic' },
  { id: 'streak_60', name: 'Constellation Keeper', description: '60 day streak', emoji: '🏅', requirement: 60, category: 'streak', rarity: 'epic' },
  { id: 'streak_100', name: 'Celestial Legend', description: '100 day streak', emoji: '👑', requirement: 100, category: 'streak', rarity: 'legendary' },
  { id: 'streak_365', name: 'Eternal Stargazer', description: 'Full year streak!', emoji: '🌠', requirement: 365, category: 'streak', rarity: 'legendary' },
  
  // Total Readings Badges
  { id: 'readings_10', name: 'Fortune Seeker', description: '10 total check-ins', emoji: '🔮', requirement: 10, category: 'total', rarity: 'common' },
  { id: 'readings_25', name: 'Mystic Apprentice', description: '25 total check-ins', emoji: '📖', requirement: 25, category: 'total', rarity: 'common' },
  { id: 'readings_50', name: 'Wisdom Collector', description: '50 total check-ins', emoji: '📚', requirement: 50, category: 'total', rarity: 'rare' },
  { id: 'readings_100', name: 'Oracle', description: '100 total check-ins', emoji: '🏆', requirement: 100, category: 'total', rarity: 'rare' },
  { id: 'readings_250', name: 'Sage', description: '250 total check-ins', emoji: '🧙', requirement: 250, category: 'total', rarity: 'epic' },
  { id: 'readings_500', name: 'Cosmic Sage', description: '500 total check-ins', emoji: '🌟', requirement: 500, category: 'total', rarity: 'legendary' },
  
  // Special Badges
  { id: 'early_bird', name: 'Early Bird', description: 'Check in before 7 AM', emoji: '🐦', requirement: 1, category: 'special', rarity: 'rare' },
  { id: 'night_owl', name: 'Night Owl', description: 'Check in after 11 PM', emoji: '🦉', requirement: 1, category: 'special', rarity: 'rare' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete a 7-day week goal', emoji: '💯', requirement: 1, category: 'special', rarity: 'epic' },
];

// ============ UTILITY FUNCTIONS ============

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday);
}

function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday start
  const monday = new Date(now.setDate(diff));
  return getDateString(monday);
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function calculateStreakBonus(streak: number): number {
  return Math.min(streak * XP_REWARDS.streakBonus, MAX_STREAK_BONUS);
}

// ============ STREAK SERVICE ============

class StreakService {
  private data: StreakData;
  private userId: string = 'guest';
  private initialized: boolean = false;
  
  constructor() {
    this.data = this.getDefaultData();
  }
  
  private getDefaultData(): StreakData {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      badges: BADGES.map(b => ({ ...b, unlockedAt: null })),
      level: 1,
      xp: 0,
      totalXp: 0,
      streakFreezes: 1, // Start with 1 free freeze
      weeklyGoal: 5,
      weeklyProgress: 0,
      weekStartDate: null,
    };
  }
  
  // ============ PERSISTENCE ============
  
  async load(userId: string): Promise<StreakData> {
    this.userId = userId || 'guest';
    
    try {
      const stored = await AsyncStorage.getItem(`${STREAK_KEY}_${this.userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new fields
        this.data = { ...this.getDefaultData(), ...parsed };
        
        // Ensure badges array is complete
        this.data.badges = BADGES.map(defaultBadge => {
          const existing = parsed.badges?.find((b: Badge) => b.id === defaultBadge.id);
          return existing || { ...defaultBadge, unlockedAt: null };
        });
      }
      
      // Check if week needs reset
      this.checkWeekReset();
      
      this.initialized = true;
      return this.data;
    } catch (error) {
      console.error('Failed to load streaks:', error);
      return this.data;
    }
  }
  
  async save(): Promise<void> {
    if (!this.userId) return;
    
    try {
      await AsyncStorage.setItem(
        `${STREAK_KEY}_${this.userId}`, 
        JSON.stringify(this.data)
      );
    } catch (error) {
      console.error('Failed to save streaks:', error);
    }
  }
  
  // ============ CHECK-IN LOGIC ============
  
  async checkIn(userId?: string): Promise<CheckInResult> {
    if (userId && userId !== this.userId) {
      await this.load(userId);
    }
    
    const today = getDateString();
    const yesterday = getYesterdayString();
    const lastDate = this.data.lastCheckIn;
    
    const result: CheckInResult = {
      streakIncreased: false,
      streakBroken: false,
      newBadges: [],
      leveledUp: false,
      xpGained: 0,
      newLevel: this.data.level,
      isNewDay: lastDate !== today,
    };
    
    // Already checked in today
    if (lastDate === today) {
      return result;
    }
    
    // Calculate streak
    if (lastDate === yesterday) {
      // Continue streak
      this.data.currentStreak += 1;
      result.streakIncreased = true;
    } else if (lastDate === null) {
      // First check-in
      this.data.currentStreak = 1;
      result.streakIncreased = true;
    } else {
      // Streak broken - check for freeze
      if (this.data.streakFreezes > 0 && this.data.currentStreak > 0) {
        // Use a freeze
        this.data.streakFreezes -= 1;
        this.data.currentStreak += 1;
        result.streakIncreased = true;
      } else {
        // Streak broken, start fresh
        if (this.data.currentStreak > 0) {
          result.streakBroken = true;
        }
        this.data.currentStreak = 1;
        result.streakIncreased = true;
      }
    }
    
    // Update records
    this.data.lastCheckIn = today;
    this.data.totalCheckIns += 1;
    this.data.weeklyProgress += 1;
    
    if (this.data.currentStreak > this.data.longestStreak) {
      this.data.longestStreak = this.data.currentStreak;
    }
    
    // Calculate XP
    let xpGained = XP_REWARDS.dailyCheckIn;
    xpGained += calculateStreakBonus(this.data.currentStreak);
    
    // Weekly bonus
    if (this.data.currentStreak > 0 && this.data.currentStreak % 7 === 0) {
      xpGained += XP_REWARDS.weekStreak;
    }
    
    this.data.xp += xpGained;
    this.data.totalXp += xpGained;
    result.xpGained = xpGained;
    
    // Check for badge unlocks
    result.newBadges = this.checkBadgeUnlocks();
    if (result.newBadges.length > 0) {
      const badgeXp = result.newBadges.length * XP_REWARDS.badgeUnlock;
      this.data.xp += badgeXp;
      this.data.totalXp += badgeXp;
      result.xpGained += badgeXp;
    }
    
    // Check for level up
    const newLevel = calculateLevel(this.data.totalXp);
    if (newLevel > this.data.level) {
      this.data.level = newLevel;
      result.leveledUp = true;
      result.newLevel = newLevel;
      
      // Bonus streak freeze every 5 levels
      if (newLevel % 5 === 0) {
        this.data.streakFreezes += 1;
      }
    }
    
    // Check weekly goal
    if (this.data.weeklyProgress >= this.data.weeklyGoal) {
      this.unlockSpecialBadge('perfect_week');
      this.data.xp += XP_REWARDS.perfectWeek;
      this.data.totalXp += XP_REWARDS.perfectWeek;
    }
    
    // Check time-based badges
    this.checkTimeBadges();
    
    await this.save();
    
    return result;
  }
  
  private checkBadgeUnlocks(): Badge[] {
    const newBadges: Badge[] = [];
    
    for (const badge of this.data.badges) {
      if (badge.unlockedAt) continue;
      
      let shouldUnlock = false;
      
      if (badge.category === 'streak') {
        shouldUnlock = this.data.currentStreak >= badge.requirement;
      } else if (badge.category === 'total') {
        shouldUnlock = this.data.totalCheckIns >= badge.requirement;
      }
      
      if (shouldUnlock) {
        badge.unlockedAt = new Date().toISOString();
        newBadges.push(badge);
      }
    }
    
    return newBadges;
  }
  
  private checkTimeBadges(): void {
    const hour = new Date().getHours();
    
    if (hour < 7) {
      this.unlockSpecialBadge('early_bird');
    } else if (hour >= 23) {
      this.unlockSpecialBadge('night_owl');
    }
  }
  
  private unlockSpecialBadge(badgeId: string): Badge | null {
    const badge = this.data.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = new Date().toISOString();
      return badge;
    }
    return null;
  }
  
  private checkWeekReset(): void {
    const currentWeekStart = getWeekStartDate();
    if (this.data.weekStartDate !== currentWeekStart) {
      this.data.weeklyProgress = 0;
      this.data.weekStartDate = currentWeekStart;
    }
  }
  
  // ============ AWARD METHODS ============
  
  async awardXP(amount: number, reason?: string): Promise<boolean> {
    this.data.xp += amount;
    this.data.totalXp += amount;
    
    const newLevel = calculateLevel(this.data.totalXp);
    const leveledUp = newLevel > this.data.level;
    
    if (leveledUp) {
      this.data.level = newLevel;
      if (newLevel % 5 === 0) {
        this.data.streakFreezes += 1;
      }
    }
    
    await this.save();
    return leveledUp;
  }
  
  async useStreakFreeze(): Promise<boolean> {
    if (this.data.streakFreezes > 0) {
      this.data.streakFreezes -= 1;
      await this.save();
      return true;
    }
    return false;
  }
  
  async addStreakFreeze(count: number = 1): Promise<void> {
    this.data.streakFreezes += count;
    await this.save();
  }
  
  // ============ GETTERS ============
  
  getData(): StreakData {
    return { ...this.data };
  }
  
  getUnlockedBadges(): Badge[] {
    return this.data.badges.filter(b => b.unlockedAt !== null);
  }
  
  getLockedBadges(): Badge[] {
    return this.data.badges.filter(b => b.unlockedAt === null);
  }
  
  getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
    return this.data.badges.filter(b => b.rarity === rarity);
  }
  
  getNextStreakBadge(): { badge: Badge; progress: number; daysNeeded: number } | null {
    const lockedStreakBadges = this.data.badges
      .filter(b => b.category === 'streak' && !b.unlockedAt)
      .sort((a, b) => a.requirement - b.requirement);
    
    if (lockedStreakBadges.length === 0) return null;
    
    const nextBadge = lockedStreakBadges[0];
    const progress = (this.data.currentStreak / nextBadge.requirement) * 100;
    const daysNeeded = nextBadge.requirement - this.data.currentStreak;
    
    return { 
      badge: nextBadge, 
      progress: Math.min(progress, 100),
      daysNeeded: Math.max(daysNeeded, 0),
    };
  }
  
  getXPProgress(): { current: number; max: number; percentage: number } {
    const current = this.data.xp % XP_PER_LEVEL;
    return {
      current,
      max: XP_PER_LEVEL,
      percentage: (current / XP_PER_LEVEL) * 100,
    };
  }
  
  getWeeklyProgress(): { current: number; goal: number; percentage: number } {
    return {
      current: this.data.weeklyProgress,
      goal: this.data.weeklyGoal,
      percentage: (this.data.weeklyProgress / this.data.weeklyGoal) * 100,
    };
  }
  
  isStreakAtRisk(): boolean {
    const today = getDateString();
    return this.data.lastCheckIn !== today && this.data.currentStreak > 0;
  }
  
  shouldShowReturnPrompt(): boolean {
    // Show if user has a streak worth protecting
    return this.data.currentStreak >= 3;
  }
  
  getMotivationalMessage(): string {
    const streak = this.data.currentStreak;
    
    if (streak === 0) {
      return "Start your cosmic journey today! 🌟";
    } else if (streak < 3) {
      return `${streak} day streak! Keep going! 🔥`;
    } else if (streak < 7) {
      return `${streak} days strong! A week is within reach! 💪`;
    } else if (streak < 14) {
      return `Amazing ${streak} day streak! You're on fire! 🔥🔥`;
    } else if (streak < 30) {
      return `Incredible ${streak} day streak! True dedication! ⭐`;
    } else {
      return `Legendary ${streak} day streak! You're unstoppable! 👑`;
    }
  }
  
  getReturnPromptMessage(): string {
    const streak = this.data.currentStreak;
    
    if (streak >= 30) {
      return `Don't lose your amazing ${streak}-day streak! Return tomorrow to keep it alive! 🔥`;
    } else if (streak >= 7) {
      return `You're on a ${streak}-day streak! Come back tomorrow to keep the fire burning! 🌟`;
    } else {
      return `You've got a ${streak}-day streak going! Return tomorrow to keep your streak! ✨`;
    }
  }
}

// Export singleton instance
export const streakService = new StreakService();
export default streakService;

// Export types for use elsewhere
export type { StreakService };
