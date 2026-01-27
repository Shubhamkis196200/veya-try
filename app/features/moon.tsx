import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

// Moon phase calculation (simplified)
const getMoonPhase = (date: Date): { phase: string; illumination: number; emoji: string; description: string } => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const daysInCycle = jd / 29.53058867;
  const phase = daysInCycle - Math.floor(daysInCycle);
  const phaseDay = Math.round(phase * 29.53);
  
  if (phaseDay < 1) return { phase: 'New Moon', illumination: 0, emoji: '🌑', description: 'Perfect time for new beginnings, setting intentions, and planting seeds of change.' };
  if (phaseDay < 7) return { phase: 'Waxing Crescent', illumination: Math.round(phase * 100), emoji: '🌒', description: 'Time to take action on intentions. Energy is building - start new projects.' };
  if (phaseDay < 8) return { phase: 'First Quarter', illumination: 50, emoji: '🌓', description: 'Challenges may arise. Stay committed to your goals and overcome obstacles.' };
  if (phaseDay < 14) return { phase: 'Waxing Gibbous', illumination: Math.round(phase * 100), emoji: '🌔', description: 'Refine and adjust your plans. The momentum is building toward completion.' };
  if (phaseDay < 16) return { phase: 'Full Moon', illumination: 100, emoji: '🌕', description: 'Peak energy! Time for celebration, gratitude, and releasing what no longer serves you.' };
  if (phaseDay < 22) return { phase: 'Waning Gibbous', illumination: Math.round((1 - phase) * 100), emoji: '🌖', description: 'Share your wisdom with others. Reflect on lessons learned.' };
  if (phaseDay < 24) return { phase: 'Last Quarter', illumination: 50, emoji: '🌗', description: 'Let go of the old to make space for the new. Forgiveness is powerful now.' };
  if (phaseDay < 29) return { phase: 'Waning Crescent', illumination: Math.round((1 - phase) * 100), emoji: '🌘', description: 'Rest and recuperate. Prepare for the new cycle approaching.' };
  return { phase: 'New Moon', illumination: 0, emoji: '🌑', description: 'Perfect time for new beginnings, setting intentions, and planting seeds of change.' };
};

// Retrograde data (mock - would be calculated from ephemeris)
const currentRetrogrades = [
  { planet: 'Mercury', status: 'direct', until: null, effect: 'Communication and travel flow smoothly' },
  { planet: 'Venus', status: 'direct', until: null, effect: 'Love and finances are harmonious' },
  { planet: 'Mars', status: 'direct', until: null, effect: 'Energy and drive are strong' },
];

// Daily affirmation based on moon phase
const getAffirmation = (phase: string): string => {
  const affirmations: Record<string, string[]> = {
    'New Moon': [
      'I am open to new possibilities and fresh starts.',
      'I plant the seeds of my dreams with intention.',
      'I embrace the darkness as a space for growth.',
    ],
    'Waxing Crescent': [
      'I take confident steps toward my goals.',
      'My intentions are powerful and manifest easily.',
      'I trust the process of growth.',
    ],
    'First Quarter': [
      'I overcome challenges with grace and determination.',
      'Obstacles are opportunities for growth.',
      'I am committed to my path.',
    ],
    'Waxing Gibbous': [
      'I refine my vision and trust the timing.',
      'Success is building momentum in my life.',
      'I am patient and persistent.',
    ],
    'Full Moon': [
      'I am grateful for all the abundance in my life.',
      'I release what no longer serves me.',
      'My light shines brightly for all to see.',
    ],
    'Waning Gibbous': [
      'I share my gifts and wisdom generously.',
      'I reflect on my journey with pride.',
      'I am a teacher and a student.',
    ],
    'Last Quarter': [
      'I forgive myself and others completely.',
      'I let go with love and trust.',
      'I make space for new blessings.',
    ],
    'Waning Crescent': [
      'I rest and restore my energy.',
      'I honor my need for stillness.',
      'I prepare for beautiful new beginnings.',
    ],
  };
  
  const options = affirmations[phase] || affirmations['New Moon'];
  return options[Math.floor(Math.random() * options.length)];
};

export default function MoonPhaseScreen() {
  const [moonData, setMoonData] = useState(getMoonPhase(new Date()));
  const [affirmation, setAffirmation] = useState('');
  
  const pulseAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    setMoonData(getMoonPhase(new Date()));
    setAffirmation(getAffirmation(moonData.phase));
    
    // Pulse animation
    pulseAnim.value = withRepeat(
      withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Slow rotation
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Moon Phase',
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Moon Display */}
          <View style={styles.moonSection}>
            <Animated.View style={[styles.moonGlow, pulseStyle]} />
            <Animated.View style={[styles.starsContainer, rotateStyle]}>
              {[...Array(12)].map((_, i) => (
                <Text 
                  key={i} 
                  style={[
                    styles.star,
                    { 
                      transform: [
                        { rotate: `${i * 30}deg` },
                        { translateY: -120 },
                      ]
                    }
                  ]}
                >
                  ✦
                </Text>
              ))}
            </Animated.View>
            <View style={styles.moonEmoji}>
              <Text style={styles.moonEmojiText}>{moonData.emoji}</Text>
            </View>
          </View>

          {/* Phase Info */}
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseName}>{moonData.phase}</Text>
            <Text style={styles.illumination}>{moonData.illumination}% Illuminated</Text>
          </View>

          {/* Description Card */}
          <View style={styles.descriptionCard}>
            <LinearGradient
              colors={['rgba(199, 208, 232, 0.1)', 'rgba(139, 126, 200, 0.05)']}
              style={styles.descriptionGradient}
            >
              <View style={styles.descriptionHeader}>
                <Ionicons name="moon" size={20} color={COLORS.celestial.moon} />
                <Text style={styles.descriptionTitle}>Lunar Energy</Text>
              </View>
              <Text style={styles.descriptionText}>{moonData.description}</Text>
            </LinearGradient>
          </View>

          {/* Daily Affirmation */}
          <View style={styles.affirmationCard}>
            <Text style={styles.affirmationLabel}>TODAY'S LUNAR AFFIRMATION</Text>
            <Text style={styles.affirmationText}>"{affirmation}"</Text>
          </View>

          {/* Retrograde Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PLANETARY STATUS</Text>
            {currentRetrogrades.map((planet, index) => (
              <View key={index} style={styles.planetCard}>
                <View style={styles.planetHeader}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: planet.status === 'direct' ? COLORS.success : COLORS.warning }
                  ]} />
                  <Text style={styles.planetName}>{planet.planet}</Text>
                  <Text style={[
                    styles.statusText,
                    { color: planet.status === 'direct' ? COLORS.success : COLORS.warning }
                  ]}>
                    {planet.status === 'direct' ? 'Direct' : 'Retrograde'}
                  </Text>
                </View>
                <Text style={styles.planetEffect}>{planet.effect}</Text>
              </View>
            ))}
          </View>

          {/* Moon Calendar Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UPCOMING PHASES</Text>
            <View style={styles.phasesRow}>
              <View style={styles.phaseItem}>
                <Text style={styles.phaseItemEmoji}>🌕</Text>
                <Text style={styles.phaseItemName}>Full Moon</Text>
                <Text style={styles.phaseItemDate}>Feb 12</Text>
              </View>
              <View style={styles.phaseItem}>
                <Text style={styles.phaseItemEmoji}>🌑</Text>
                <Text style={styles.phaseItemName}>New Moon</Text>
                <Text style={styles.phaseItemDate}>Feb 28</Text>
              </View>
              <View style={styles.phaseItem}>
                <Text style={styles.phaseItemEmoji}>🌕</Text>
                <Text style={styles.phaseItemName}>Full Moon</Text>
                <Text style={styles.phaseItemDate}>Mar 14</Text>
              </View>
            </View>
          </View>

          {/* Rituals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUGGESTED RITUALS</Text>
            <View style={styles.ritualCard}>
              <Ionicons name="flame-outline" size={24} color={COLORS.celestial.sun} />
              <View style={styles.ritualContent}>
                <Text style={styles.ritualTitle}>
                  {moonData.phase.includes('Waxing') || moonData.phase === 'New Moon' 
                    ? 'Manifestation Ritual' 
                    : 'Release Ritual'}
                </Text>
                <Text style={styles.ritualText}>
                  {moonData.phase.includes('Waxing') || moonData.phase === 'New Moon'
                    ? 'Write your intentions on paper. Light a candle and visualize them manifesting.'
                    : 'Write what you want to release. Safely burn the paper and let it go.'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 100 },

  // Moon Section
  moonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginBottom: SPACING.lg,
  },
  moonGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.celestial.moon,
    opacity: 0.3,
  },
  starsContainer: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    position: 'absolute',
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.6,
  },
  moonEmoji: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.celestial.moon + '40',
  },
  moonEmojiText: {
    fontSize: 72,
  },

  // Phase Info
  phaseInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  phaseName: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  illumination: {
    ...FONTS.body,
    color: COLORS.celestial.moon,
  },

  // Description
  descriptionCard: { marginBottom: SPACING.lg },
  descriptionGradient: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  descriptionTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  descriptionText: { ...FONTS.body, color: COLORS.textSecondary, lineHeight: 24 },

  // Affirmation
  affirmationCard: {
    backgroundColor: COLORS.primaryMuted,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  affirmationLabel: { ...FONTS.overline, color: COLORS.primary, marginBottom: SPACING.sm },
  affirmationText: { ...FONTS.bodyLarge, color: COLORS.textPrimary, textAlign: 'center', fontStyle: 'italic' },

  // Section
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...FONTS.overline, color: COLORS.textMuted, marginBottom: SPACING.md },

  // Planet Cards
  planetCard: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  planetName: { ...FONTS.bodyMedium, color: COLORS.textPrimary, flex: 1 },
  statusText: { ...FONTS.caption, textTransform: 'uppercase' },
  planetEffect: { ...FONTS.bodySmall, color: COLORS.textMuted },

  // Phases Row
  phasesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseItem: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phaseItemEmoji: { fontSize: 28, marginBottom: SPACING.xs },
  phaseItemName: { ...FONTS.caption, color: COLORS.textMuted },
  phaseItemDate: { ...FONTS.bodyMedium, color: COLORS.textPrimary, marginTop: 2 },

  // Rituals
  ritualCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ritualContent: { flex: 1, marginLeft: SPACING.md },
  ritualTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary, marginBottom: SPACING.xs },
  ritualText: { ...FONTS.bodySmall, color: COLORS.textMuted, lineHeight: 20 },
});
