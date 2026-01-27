/**
 * STREAK DISPLAY COMPONENT
 * Show current streak, badges, level
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown,
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { streakService, StreakData, Badge } from '../lib/streaks';
import { useAuthStore } from '../stores';

interface StreakDisplayProps {
  compact?: boolean;
  onPress?: () => void;
}

export function StreakDisplay({ compact = false, onPress }: StreakDisplayProps) {
  const { colors } = useTheme();
  const { profile } = useAuthStore();
  const [data, setData] = useState<StreakData | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  
  const fireScale = useSharedValue(1);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const streakData = await streakService.load(profile?.id || 'guest');
    setData(streakData);
    
    // Animate if streak > 0
    if (streakData.currentStreak > 0) {
      fireScale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withSpring(1)
      );
    }
  };
  
  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));
  
  if (!data) return null;
  
  const nextBadge = streakService.getNextBadgeProgress();
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: colors.bg.elevated }]}
        onPress={onPress}
      >
        <Animated.Text style={[styles.fireEmoji, fireStyle]}>🔥</Animated.Text>
        <Text style={[styles.compactStreak, { color: colors.accent }]}>
          {data.currentStreak}
        </Text>
        <Text style={[styles.compactLabel, { color: colors.text.muted }]}>day streak</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.bg.elevated }]}
    >
      {/* Streak & Level */}
      <View style={styles.header}>
        <View style={styles.streakSection}>
          <Animated.Text style={[styles.fireEmoji, fireStyle]}>🔥</Animated.Text>
          <View>
            <Text style={[styles.streakValue, { color: colors.text.primary }]}>
              {data.currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.text.muted }]}>
              day streak
            </Text>
          </View>
        </View>
        
        <View style={styles.levelSection}>
          <View style={[styles.levelBadge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.levelValue, { color: colors.primary }]}>
              Lv.{data.level}
            </Text>
          </View>
          <View style={[styles.xpBar, { backgroundColor: colors.bg.muted }]}>
            <View 
              style={[
                styles.xpFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${(data.xp % 100)}%`,
                }
              ]} 
            />
          </View>
          <Text style={[styles.xpText, { color: colors.text.muted }]}>
            {data.xp % 100}/100 XP
          </Text>
        </View>
      </View>
      
      {/* Next Badge Progress */}
      {nextBadge && (
        <View style={styles.nextBadgeSection}>
          <Text style={[styles.nextBadgeLabel, { color: colors.text.muted }]}>
            Next badge: {nextBadge.badge.emoji} {nextBadge.badge.name}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.bg.muted }]}>
            <View 
              style={[
                styles.progressFill,
                { backgroundColor: colors.accent, width: `${nextBadge.progress}%` }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text.muted }]}>
            {data.currentStreak}/{nextBadge.badge.requirement} days
          </Text>
        </View>
      )}
      
      {/* Recent Badges */}
      <View style={styles.badgesSection}>
        <Text style={[styles.badgesTitle, { color: colors.text.secondary }]}>
          Badges ({streakService.getUnlockedBadges().length}/{data.badges.length})
        </Text>
        <View style={styles.badgesRow}>
          {data.badges.slice(0, 6).map((badge, i) => (
            <View 
              key={badge.id}
              style={[
                styles.badgeItem,
                !badge.unlockedAt && styles.badgeLocked,
              ]}
            >
              <Text style={styles.badgeEmoji}>
                {badge.unlockedAt ? badge.emoji : '🔒'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {data.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.muted }]}>Best</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {data.totalCheckIns}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.muted }]}>Total</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// Badge notification popup
export function BadgeUnlocked({ badge, onDismiss }: { badge: Badge; onDismiss: () => void }) {
  const { colors } = useTheme();
  
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);
  
  return (
    <Animated.View 
      entering={FadeInDown.springify()}
      style={[styles.badgePopup, { backgroundColor: colors.bg.elevated }]}
    >
      <Text style={styles.badgePopupEmoji}>{badge.emoji}</Text>
      <Text style={[styles.badgePopupTitle, { color: colors.accent }]}>
        Badge Unlocked!
      </Text>
      <Text style={[styles.badgePopupName, { color: colors.text.primary }]}>
        {badge.name}
      </Text>
      <Text style={[styles.badgePopupDesc, { color: colors.text.muted }]}>
        {badge.description}
      </Text>
      <TouchableOpacity
        style={[styles.dismissButton, { backgroundColor: colors.primary }]}
        onPress={onDismiss}
      >
        <Text style={styles.dismissText}>Awesome!</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 16 },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  fireEmoji: { fontSize: 24 },
  compactStreak: { fontSize: 18, fontWeight: '700' },
  compactLabel: { fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  streakSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakValue: { fontSize: 32, fontWeight: '700' },
  streakLabel: { fontSize: 13 },
  levelSection: { alignItems: 'flex-end' },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  levelValue: { fontSize: 14, fontWeight: '600' },
  xpBar: { width: 80, height: 4, borderRadius: 2, overflow: 'hidden' },
  xpFill: { height: '100%' },
  xpText: { fontSize: 11, marginTop: 2 },
  nextBadgeSection: { marginBottom: 16 },
  nextBadgeLabel: { fontSize: 13, marginBottom: 6 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12 },
  badgesSection: { marginBottom: 16 },
  badgesTitle: { fontSize: 13, marginBottom: 8 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badgeItem: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  badgeLocked: { opacity: 0.4 },
  badgeEmoji: { fontSize: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12 },
  badgePopup: {
    position: 'absolute',
    top: '30%',
    left: 40,
    right: 40,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  badgePopupEmoji: { fontSize: 64, marginBottom: 16 },
  badgePopupTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  badgePopupName: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  badgePopupDesc: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  dismissButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 },
  dismissText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default StreakDisplay;
