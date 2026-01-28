/**
 * HOME SCREEN - REDESIGNED
 * 3 key cards, real data, energy meter, clean layout
 */
import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore, useAppStore } from '../../src/stores';
import { getDailyReading } from '../../src/services/ai';
import { HomeSkeleton, Skeleton } from '../../src/components/LoadingSkeleton';
import { StarField } from '../../src/components';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Quick action buttons
const QUICK_ACTIONS = [
  { key: 'chat', icon: 'chatbubble-ellipses', label: 'Ask Veya', route: '/(tabs)/chat', color: '#A855F7' },
  { key: 'tarot', icon: 'layers', label: 'Tarot', route: '/features/tarot', color: '#F59E0B' },
  { key: 'moon', icon: 'moon', label: 'Moon', route: '/features/moon', color: '#60A5FA' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, spacing, radius, text, card } = useTheme();
  const { profile } = useAuthStore();
  const { dailyInsight, setDailyInsight } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reading, setReading] = useState<any>(null);
  
  const energyWidth = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  
  const zodiacSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  const userName = profile?.name?.split(' ')[0] || 'Stargazer';
  const today = format(new Date(), 'EEEE, MMMM d');
  const greeting = getGreeting();
  
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
  
  // Fetch daily reading
  const fetchReading = useCallback(async () => {
    try {
      const data = await getDailyReading(zodiacSign, profile?.intent);
      setReading(data);
      setDailyInsight(data);
      
      // Animate energy bar
      energyWidth.value = withSpring((data.energy || 75) / 100, {
        damping: 15,
        stiffness: 100,
      });
    } catch (error) {
      console.error('Failed to fetch reading:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [zodiacSign, profile?.intent]);
  
  useEffect(() => {
    fetchReading();
    cardScale.value = withSpring(1, { damping: 12 });
  }, []);
  
  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchReading();
  }, [fetchReading]);
  
  const energyStyle = useAnimatedStyle(() => ({
    width: `${energyWidth.value * 100}%`,
  }));
  
  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#08080F' }]}>
        <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe}>
          <HomeSkeleton />
        </SafeAreaView>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: '#08080F' }]}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      <StarField starCount={30} />
      
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
              {greeting}, {userName} ✨
            </Text>
            <Text style={[styles.date, { color: colors.text.primary }]}>
              {today}
            </Text>
          </Animated.View>
          
          {/* Main Reading Card */}
          <Animated.View style={cardAnimStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/forecast');
              }}
            >
              <LinearGradient
                colors={[colors.bg.elevated, colors.bg.tertiary]}
                style={[styles.mainCard, { borderColor: colors.border.accent }]}
              >
                {/* Theme Badge */}
                <View style={[styles.themeBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Ionicons name="sparkles" size={14} color={colors.primary} />
                  <Text style={[styles.themeText, { color: colors.primary }]}>
                    {reading?.theme || "Today's Energy"}
                  </Text>
                </View>
                
                {/* Reading Text */}
                <Text style={[styles.readingText, { color: colors.text.primary }]}>
                  {reading?.reading || "The universe has a message for you..."}
                </Text>
                
                {/* Energy Meter */}
                <View style={styles.energyContainer}>
                  <View style={styles.energyHeader}>
                    <Text style={[styles.energyLabel, { color: colors.text.secondary }]}>
                      Cosmic Energy
                    </Text>
                    <Text style={[styles.energyValue, { color: colors.accent }]}>
                      {reading?.energy || 75}%
                    </Text>
                  </View>
                  <View style={[styles.energyBar, { backgroundColor: colors.bg.muted }]}>
                    <Animated.View 
                      style={[
                        styles.energyFill,
                        energyStyle,
                        { backgroundColor: colors.accent }
                      ]} 
                    />
                  </View>
                </View>
                
                {/* Lucky Items */}
                <View style={styles.luckyRow}>
                  <View style={styles.luckyItem}>
                    <Ionicons name="color-palette" size={16} color={colors.text.muted} />
                    <Text style={[styles.luckyText, { color: colors.text.secondary }]}>
                      {reading?.luckyColor || 'Gold'}
                    </Text>
                  </View>
                  <View style={styles.luckyItem}>
                    <Ionicons name="star" size={16} color={colors.text.muted} />
                    <Text style={[styles.luckyText, { color: colors.text.secondary }]}>
                      {reading?.luckyNumber || 7}
                    </Text>
                  </View>
                  <View style={styles.luckyItem}>
                    <Ionicons name="time" size={16} color={colors.text.muted} />
                    <Text style={[styles.luckyText, { color: colors.text.secondary }]}>
                      {reading?.luckyTime || '3:33 PM'}
                    </Text>
                  </View>
                </View>
                
                {/* Tap hint */}
                <View style={styles.tapHint}>
                  <Text style={[styles.tapText, { color: colors.text.muted }]}>
                    Tap for full forecast →
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.actionsContainer}>
            {QUICK_ACTIONS.map((action, index) => (
              <AnimatedTouchable
                key={action.key}
                entering={FadeInDown.delay(300 + index * 100)}
                style={[styles.actionButton, { backgroundColor: colors.bg.elevated }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(action.route as any);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text.primary }]}>
                  {action.label}
                </Text>
              </AnimatedTouchable>
            ))}
          </Animated.View>
          
          {/* Do & Avoid Cards */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.tipsContainer}>
            {/* Do Card */}
            <View style={[styles.tipCard, { backgroundColor: colors.bg.elevated }]}>
              <View style={[styles.tipHeader, { borderBottomColor: colors.border.default }]}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.tipTitle, { color: colors.success }]}>Embrace</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                {reading?.do || "Trust your intuition today"}
              </Text>
            </View>
            
            {/* Avoid Card */}
            <View style={[styles.tipCard, { backgroundColor: colors.bg.elevated }]}>
              <View style={[styles.tipHeader, { borderBottomColor: colors.border.default }]}>
                <Ionicons name="close-circle" size={20} color={colors.error} />
                <Text style={[styles.tipTitle, { color: colors.error }]}>Avoid</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                {reading?.avoid || "Overthinking decisions"}
              </Text>
            </View>
          </Animated.View>
          
          {/* Zodiac Badge */}
          <Animated.View entering={FadeIn.delay(600)} style={styles.zodiacContainer}>
            <Text style={[styles.zodiacText, { color: colors.text.muted }]}>
              ☉ {zodiacSign}
            </Text>
          </Animated.View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 160,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 28,
    fontWeight: '700',
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  themeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  readingText: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 20,
  },
  energyContainer: {
    marginBottom: 16,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  energyLabel: {
    fontSize: 13,
  },
  energyValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  energyBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    borderRadius: 3,
  },
  luckyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  luckyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  luckyText: {
    fontSize: 14,
  },
  tapHint: {
    alignItems: 'center',
    marginTop: 16,
  },
  tapText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  tipsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tipCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipText: {
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  zodiacContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  zodiacText: {
    fontSize: 14,
  },
});
