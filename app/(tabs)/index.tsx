import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, INTENTS } from '../../src/constants/theme';
import { useAuthStore, useAppStore } from '../../src/stores';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Mock daily insight for demo
const mockInsight = {
  theme: 'Inner Clarity',
  energy_summary: 'Today brings a wave of mental clarity and emotional balance. The cosmic energies favor introspection and meaningful conversations.',
  do_list: ['Trust your intuition', 'Connect with loved ones', 'Start a creative project'],
  avoid_list: ['Impulsive decisions', 'Overcommitting your time'],
  lucky_color: 'Gold',
  lucky_number: 7,
  lucky_time: '3:00 PM',
  gem_name: 'Citrine',
  gem_reason: 'Enhances clarity and positive energy',
  focus_area: 'Focus on nurturing your most important relationships today. A heartfelt conversation could strengthen bonds.',
  energy_level: 78,
};

export default function TodayScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { dailyInsight, setDailyInsight } = useAppStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [insight, setInsight] = useState(mockInsight);

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');
  
  // Animations
  const glowOpacity = useSharedValue(0.3);
  const energyScale = useSharedValue(0);

  useEffect(() => {
    // Pulsing glow effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Energy bar animation
    energyScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const energyStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: energyScale.value }],
  }));
  
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const intentInfo = profile?.intent 
    ? INTENTS[profile.intent as keyof typeof INTENTS] 
    : null;

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>{dateString}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.avatarText}>
              {(profile?.name?.[0] || 'V').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.overline}>TODAY'S THEME</Text>
            {intentInfo && (
              <View style={[styles.badge, { backgroundColor: intentInfo.color + '20' }]}>
                <Ionicons name={intentInfo.icon as any} size={12} color={intentInfo.color} />
                <Text style={[styles.badgeText, { color: intentInfo.color }]}>
                  {intentInfo.title.split(' ')[0]}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.heroTitle}>{insight.theme}</Text>
          <Text style={styles.heroSummary}>{insight.energy_summary}</Text>
          
          {/* Energy Bar */}
          <View style={styles.energySection}>
            <View style={styles.energyHeader}>
              <Text style={styles.energyLabel}>Overall Energy</Text>
              <Text style={styles.energyValue}>{insight.energy_level}%</Text>
            </View>
            <View style={styles.energyTrack}>
              <View style={[styles.energyFill, { width: `${insight.energy_level}%` }]} />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={styles.statBadge}>
            <Ionicons name="color-palette" size={18} color={COLORS.celestial.venus} />
            <Text style={styles.statLabel}>Color</Text>
            <Text style={styles.statValue}>{insight.lucky_color}</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="star" size={18} color={COLORS.celestial.jupiter} />
            <Text style={styles.statLabel}>Number</Text>
            <Text style={styles.statValue}>{insight.lucky_number}</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="time" size={18} color={COLORS.celestial.mercury} />
            <Text style={styles.statLabel}>Best Time</Text>
            <Text style={styles.statValue}>{insight.lucky_time}</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="diamond" size={18} color={COLORS.primary} />
            <Text style={styles.statLabel}>Gem</Text>
            <Text style={styles.statValue}>{insight.gem_name}</Text>
          </View>
        </ScrollView>

        {/* Guidance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY GUIDANCE</Text>
          
          {insight.do_list.map((item, index) => (
            <View key={`do-${index}`} style={styles.guidanceCard}>
              <View style={[styles.guidanceIcon, { backgroundColor: COLORS.success + '15' }]}>
                <Ionicons name="checkmark" size={18} color={COLORS.success} />
              </View>
              <View style={styles.guidanceContent}>
                <Text style={styles.guidanceLabel}>Focus On</Text>
                <Text style={styles.guidanceText}>{item}</Text>
              </View>
            </View>
          ))}
          
          {insight.avoid_list.map((item, index) => (
            <View key={`avoid-${index}`} style={styles.guidanceCard}>
              <View style={[styles.guidanceIcon, { backgroundColor: COLORS.warning + '15' }]}>
                <Ionicons name="alert" size={18} color={COLORS.warning} />
              </View>
              <View style={styles.guidanceContent}>
                <Text style={styles.guidanceLabel}>Be Mindful</Text>
                <Text style={styles.guidanceText}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Focus Card */}
        {insight.focus_area && intentInfo && (
          <View style={styles.focusCard}>
            <View style={[styles.focusIcon, { backgroundColor: intentInfo.color + '15' }]}>
              <Ionicons name={intentInfo.icon as any} size={24} color={intentInfo.color} />
            </View>
            <View style={styles.focusContent}>
              <Text style={styles.focusLabel}>{intentInfo.title.toUpperCase()} FOCUS</Text>
              <Text style={styles.focusText}>{insight.focus_area}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/forecast')}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.celestial.saturn + '15' }]}>
              <Ionicons name="calendar" size={22} color={COLORS.celestial.saturn} />
            </View>
            <Text style={styles.actionTitle}>Weekly Forecast</Text>
            <Text style={styles.actionSubtitle}>See what's ahead</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/chat')}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="chatbubble" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>Ask Veya</Text>
            <Text style={styles.actionSubtitle}>Get guidance</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE</Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/features/moon' as any)}>
              <Text style={styles.featureEmoji}>🌙</Text>
              <Text style={styles.featureTitle}>Moon Phase</Text>
              <Text style={styles.featureSubtitle}>Lunar energy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/features/tarot' as any)}>
              <Text style={styles.featureEmoji}>🎴</Text>
              <Text style={styles.featureTitle}>Daily Tarot</Text>
              <Text style={styles.featureSubtitle}>Card reading</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/features/compatibility' as any)}>
              <Text style={styles.featureEmoji}>💕</Text>
              <Text style={styles.featureTitle}>Compatibility</Text>
              <Text style={styles.featureSubtitle}>Love match</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/features/affirmations' as any)}>
              <Text style={styles.featureEmoji}>✨</Text>
              <Text style={styles.featureTitle}>Affirmations</Text>
              <Text style={styles.featureSubtitle}>Daily mantras</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/features/journal' as any)}>
              <Text style={styles.featureEmoji}>📔</Text>
              <Text style={styles.featureTitle}>Journal</Text>
              <Text style={styles.featureSubtitle}>Daily reflection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.featureEmoji}>💎</Text>
              <Text style={styles.featureTitle}>Gemstones</Text>
              <Text style={styles.featureSubtitle}>Lucky stones</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
  },
  greeting: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  date: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...FONTS.bodyMedium,
    color: COLORS.primary,
  },
  heroCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  overline: {
    ...FONTS.overline,
    color: COLORS.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    ...FONTS.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  heroTitle: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  heroSummary: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  energySection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  energyLabel: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  energyValue: {
    ...FONTS.bodyMedium,
    color: COLORS.primary,
  },
  energyTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  statsScroll: {
    marginTop: SPACING.lg,
  },
  statsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  statBadge: {
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  statValue: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  section: {
    padding: SPACING.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    ...FONTS.overline,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  guidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guidanceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  guidanceContent: {
    flex: 1,
  },
  guidanceLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  guidanceText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  focusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  focusContent: {
    flex: 1,
  },
  focusLabel: {
    ...FONTS.overline,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  focusText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  featureTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  featureSubtitle: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
