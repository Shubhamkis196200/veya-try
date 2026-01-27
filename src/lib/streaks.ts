/**
 * ENGAGEMENT STREAKS SYSTEM
 * Daily streaks, badges, achievements
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  badges: Badge[];
  level: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string | null;
  requirement: number;
}

const BADGES: Omit<Badge, 'unlockedAt'>[] = [
  { id: 'first_reading', name: 'Cosmic Beginner', description: 'Got your first reading', emoji: '🌟', requirement: 1 },
  { id: 'streak_3', name: 'Star Seeker', description: '3 day streak', emoji: '⭐', requirement: 3 },
  { id: 'streak_7', name: 'Moon Child', description: '7 day streak', emoji: '🌙', requirement: 7 },
  { id: 'streak_14', name: 'Cosmic Explorer', description: '14 day streak', emoji: '🚀', requirement: 14 },
  { id: 'streak_30', name: 'Astral Master', description: '30 day streak', emoji: '✨', requirement: 30 },
  { id: 'streak_100', name: 'Celestial Legend', description: '100 day streak', emoji: '👑', requirement: 100 },
  { id: 'readings_10', name: 'Fortune Seeker', description: '10 total readings', emoji: '🔮', requirement: 10 },
  { id: 'readings_50', name: 'Wisdom Collector', description: '50 total readings', emoji: '📚', requirement: 50 },
  { id: 'readings_100', name: 'Oracle', description: '100 total readings', emoji: '🏆', requirement: 100 },
];

const STREAK_KEY = 'veya_streaks';
const XP_PER_CHECKIN = 10;
const XP_PER_LEVEL = 100;

class StreakService {
  private data: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    totalCheckIns: 0,
    badges: BADGES.map(b => ({ ...b, unlockedAt: null })),
    level: 1,
    xp: 0,
  };
  
  // Load streak data
  async load(userId: string): Promise<StreakData> {
    try {
      const stored = await AsyncStorage.getItem(`${STREAK_KEY}_${userId}`);
      if (stored) {
        this.data = JSON.parse(stored);
      }
      return this.data;
    } catch (error) {
      console.error('Failed to load streaks:', error);
      return this.data;
    }
  }
  
  // Save streak data
  async save(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${STREAK_KEY}_${userId}`, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save streaks:', error);
    }
  }
  
  // Check in for today
  async checkIn(userId: string): Promise<{
    streakIncreased: boolean;
    newBadges: Badge[];
    leveledUp: boolean;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.data.lastCheckIn;
    
    let streakIncreased = false;
    const newBadges: Badge[] = [];
    
    if (lastDate !== today) {
      // Check if yesterday to continue streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        // Continue streak
        this.data.currentStreak += 1;
        streakIncreased = true;
      } else if (lastDate !== today) {
        // Streak broken, start new
        this.data.currentStreak = 1;
        streakIncreased = true;
      }
      
      this.data.lastCheckIn = today;
      this.data.totalCheckIns += 1;
      
      // Update longest streak
      if (this.data.currentStreak > this.data.longestStreak) {
        this.data.longestStreak = this.data.currentStreak;
      }
      
      // Add XP
      this.data.xp += XP_PER_CHECKIN;
      
      // Check for badge unlocks
      const streakBadges = ['streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_100'];
      for (const badgeId of streakBadges) {
        const badge = this.data.badges.find(b => b.id === badgeId);
        if (badge && !badge.unlockedAt && this.data.currentStreak >= badge.requirement) {
          badge.unlockedAt = new Date().toISOString();
          newBadges.push(badge);
          this.data.xp += 50; // Bonus XP for badge
        }
      }
      
      // Check for total readings badges
      const readingBadges = ['first_reading', 'readings_10', 'readings_50', 'readings_100'];
      for (const badgeId of readingBadges) {
        const badge = this.data.badges.find(b => b.id === badgeId);
        if (badge && !badge.unlockedAt && this.data.totalCheckIns >= badge.requirement) {
          badge.unlockedAt = new Date().toISOString();
          newBadges.push(badge);
          this.data.xp += 50;
        }
      }
      
      await this.save(userId);
    }
    
    // Check for level up
    const newLevel = Math.floor(this.data.xp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > this.data.level;
    if (leveledUp) {
      this.data.level = newLevel;
      await this.save(userId);
    }
    
    return { streakIncreased, newBadges, leveledUp };
  }
  
  // Get current data
  getData(): StreakData {
    return this.data;
  }
  
  // Get unlocked badges
  getUnlockedBadges(): Badge[] {
    return this.data.badges.filter(b => b.unlockedAt !== null);
  }
  
  // Get locked badges
  getLockedBadges(): Badge[] {
    return this.data.badges.filter(b => b.unlockedAt === null);
  }
  
  // Get progress to next badge
  getNextBadgeProgress(): { badge: Badge; progress: number } | null {
    const lockedStreakBadges = this.data.badges
      .filter(b => b.id.startsWith('streak_') && !b.unlockedAt)
      .sort((a, b) => a.requirement - b.requirement);
    
    if (lockedStreakBadges.length === 0) return null;
    
    const nextBadge = lockedStreakBadges[0];
    const progress = (this.data.currentStreak / nextBadge.requirement) * 100;
    
    return { badge: nextBadge, progress: Math.min(progress, 100) };
  }
}

export const streakService = new StreakService();
export default streakService;
