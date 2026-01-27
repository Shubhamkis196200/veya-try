import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, ZODIAC } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const zodiacSigns = Object.entries(ZODIAC).map(([key, data]) => ({
  key,
  ...data,
}));

// Compatibility matrix (simplified)
const compatibilityData: Record<string, Record<string, { score: number; desc: string }>> = {
  aries: {
    aries: { score: 70, desc: "Two fires create explosive passion but may clash for dominance." },
    taurus: { score: 55, desc: "Different paces - Aries rushes while Taurus takes time." },
    gemini: { score: 85, desc: "Exciting match! Both love adventure and spontaneity." },
    cancer: { score: 45, desc: "Emotional needs differ - requires patience and understanding." },
    leo: { score: 95, desc: "Fire meets fire! Passionate, dramatic, and deeply loyal." },
    virgo: { score: 50, desc: "Different approaches - can learn from each other." },
    libra: { score: 75, desc: "Opposites attract - balance of action and harmony." },
    scorpio: { score: 60, desc: "Intense connection but power struggles possible." },
    sagittarius: { score: 90, desc: "Adventure partners! Freedom-loving and optimistic." },
    capricorn: { score: 55, desc: "Cardinal clash - both want to lead differently." },
    aquarius: { score: 80, desc: "Independent spirits who respect each other's freedom." },
    pisces: { score: 65, desc: "Fire and water - passionate but may steam up." },
  },
  // Simplified - in real app would have full matrix
  taurus: {
    taurus: { score: 85, desc: "Two earthy souls finding comfort and stability together." },
    virgo: { score: 90, desc: "Earth harmony - practical, loyal, and deeply connected." },
    capricorn: { score: 95, desc: "Power couple! Shared values and long-term vision." },
    cancer: { score: 88, desc: "Nurturing match - home and security focused." },
  },
  leo: {
    leo: { score: 75, desc: "Double the drama, double the love! Need to share spotlight." },
    sagittarius: { score: 92, desc: "Fire and adventure! Endless fun and optimism." },
    aries: { score: 95, desc: "Fire meets fire! Passionate, dramatic, and deeply loyal." },
    libra: { score: 85, desc: "Glamorous pair - both appreciate beauty and romance." },
  },
};

const getCompatibility = (sign1: string, sign2: string) => {
  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();
  
  if (compatibilityData[s1]?.[s2]) return compatibilityData[s1][s2];
  if (compatibilityData[s2]?.[s1]) return compatibilityData[s2][s1];
  
  // Generate random if not in matrix
  const score = 50 + Math.floor(Math.random() * 45);
  return {
    score,
    desc: score > 80 
      ? "Strong cosmic connection with natural understanding."
      : score > 60 
      ? "Good potential - with effort, this can flourish."
      : "Challenging but growth-oriented connection."
  };
};

export default function CompatibilityScreen() {
  const router = useRouter();
  const [sign1, setSign1] = useState<string | null>(null);
  const [sign2, setSign2] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; desc: string } | null>(null);
  const [selectingFor, setSelectingFor] = useState<1 | 2 | null>(null);

  const handleSelectSign = (signKey: string) => {
    if (selectingFor === 1) {
      setSign1(signKey);
      setSelectingFor(null);
      setResult(null);
    } else if (selectingFor === 2) {
      setSign2(signKey);
      setSelectingFor(null);
      setResult(null);
    }
  };

  const checkCompatibility = () => {
    if (sign1 && sign2) {
      setResult(getCompatibility(sign1, sign2));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.primary;
    if (score >= 40) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Compatibility',
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={styles.title}>Zodiac Compatibility</Text>
            <Text style={styles.subtitle}>Discover your cosmic connection</Text>
          </Animated.View>

          {/* Selection Cards */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.selectionRow}>
            <TouchableOpacity 
              style={[styles.signCard, selectingFor === 1 && styles.signCardActive]}
              onPress={() => setSelectingFor(1)}
              activeOpacity={0.7}
            >
              {sign1 ? (
                <>
                  <Text style={styles.signSymbol}>{ZODIAC[sign1 as keyof typeof ZODIAC].symbol}</Text>
                  <Text style={styles.signName}>{ZODIAC[sign1 as keyof typeof ZODIAC].name}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={32} color={COLORS.textMuted} />
                  <Text style={styles.signPlaceholder}>Your Sign</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.heartContainer}>
              <Ionicons name="heart" size={28} color={COLORS.intent.love} />
            </View>

            <TouchableOpacity 
              style={[styles.signCard, selectingFor === 2 && styles.signCardActive]}
              onPress={() => setSelectingFor(2)}
              activeOpacity={0.7}
            >
              {sign2 ? (
                <>
                  <Text style={styles.signSymbol}>{ZODIAC[sign2 as keyof typeof ZODIAC].symbol}</Text>
                  <Text style={styles.signName}>{ZODIAC[sign2 as keyof typeof ZODIAC].name}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={32} color={COLORS.textMuted} />
                  <Text style={styles.signPlaceholder}>Their Sign</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Selector */}
          {selectingFor && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.selectorSection}>
              <Text style={styles.selectorTitle}>
                Select {selectingFor === 1 ? 'Your' : 'Their'} Sign
              </Text>
              <View style={styles.zodiacGrid}>
                {zodiacSigns.map((sign, idx) => (
                  <TouchableOpacity
                    key={sign.key}
                    style={[
                      styles.zodiacItem,
                      (selectingFor === 1 ? sign1 : sign2) === sign.key && styles.zodiacItemSelected
                    ]}
                    onPress={() => handleSelectSign(sign.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.zodiacSymbol}>{sign.symbol}</Text>
                    <Text style={styles.zodiacName}>{sign.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Check Button */}
          {sign1 && sign2 && !selectingFor && !result && (
            <Animated.View entering={FadeIn.duration(300)}>
              <TouchableOpacity 
                style={styles.checkButton} 
                onPress={checkCompatibility}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E85A8F', '#9B8FD9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.checkButtonGradient}
                >
                  <Text style={styles.checkButtonText}>Check Compatibility</Text>
                  <Ionicons name="sparkles" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Result */}
          {result && sign1 && sign2 && (
            <Animated.View entering={FadeInDown.duration(500)} style={styles.resultSection}>
              <LinearGradient
                colors={['rgba(232, 90, 143, 0.1)', 'rgba(155, 143, 217, 0.1)']}
                style={styles.resultCard}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>
                    {ZODIAC[sign1 as keyof typeof ZODIAC].name} & {ZODIAC[sign2 as keyof typeof ZODIAC].name}
                  </Text>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
                    {result.score}%
                  </Text>
                  <Text style={styles.scoreLabel}>Compatibility</Text>
                </View>

                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreBarFill, 
                      { width: `${result.score}%`, backgroundColor: getScoreColor(result.score) }
                    ]} 
                  />
                </View>

                <Text style={styles.resultDesc}>{result.desc}</Text>

                {/* Areas */}
                <View style={styles.areasContainer}>
                  <View style={styles.areaItem}>
                    <Ionicons name="heart" size={20} color={COLORS.intent.love} />
                    <Text style={styles.areaLabel}>Romance</Text>
                    <Text style={styles.areaScore}>{Math.min(100, result.score + 5)}%</Text>
                  </View>
                  <View style={styles.areaItem}>
                    <Ionicons name="chatbubbles" size={20} color={COLORS.intent.career} />
                    <Text style={styles.areaLabel}>Communication</Text>
                    <Text style={styles.areaScore}>{Math.max(30, result.score - 10)}%</Text>
                  </View>
                  <View style={styles.areaItem}>
                    <Ionicons name="shield-checkmark" size={20} color={COLORS.intent.family} />
                    <Text style={styles.areaLabel}>Trust</Text>
                    <Text style={styles.areaScore}>{result.score}%</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => { setSign1(null); setSign2(null); setResult(null); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetButtonText}>Try Another Pair</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  
  header: { marginBottom: SPACING.xl },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Selection Row
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  signCard: {
    width: (width - SPACING.lg * 2 - SPACING.md * 2 - 50) / 2,
    height: 140,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  signCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  signSymbol: { fontSize: 48, marginBottom: SPACING.xs },
  signName: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  signPlaceholder: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },
  heartContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.intent.love + '20',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },

  // Selector
  selectorSection: { marginBottom: SPACING.xl },
  selectorTitle: { ...FONTS.h3, color: COLORS.textPrimary, marginBottom: SPACING.md },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  zodiacItem: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  zodiacItemSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  zodiacSymbol: { fontSize: 24 },
  zodiacName: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 2 },

  // Check Button
  checkButton: { marginBottom: SPACING.xl },
  checkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    minHeight: 48,
  },
  checkButtonText: { ...FONTS.bodyMedium, color: '#FFF' },

  // Result
  resultSection: { marginBottom: SPACING.xl },
  resultCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  resultHeader: { alignItems: 'center', marginBottom: SPACING.lg },
  resultTitle: { ...FONTS.h3, color: COLORS.textPrimary, textAlign: 'center' },
  scoreContainer: { alignItems: 'center', marginBottom: SPACING.md },
  scoreValue: { fontSize: 64, fontWeight: '200' },
  scoreLabel: { ...FONTS.caption, color: COLORS.textMuted, marginTop: SPACING.xs },
  scoreBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  resultDesc: { 
    ...FONTS.body, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },

  // Areas
  areasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  areaItem: { alignItems: 'center', minWidth: 48 },
  areaLabel: { ...FONTS.caption, color: COLORS.textMuted, marginTop: SPACING.xs },
  areaScore: { ...FONTS.bodyMedium, color: COLORS.textPrimary, marginTop: 2 },

  // Reset
  resetButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  resetButtonText: { ...FONTS.body, color: COLORS.primary },
});
