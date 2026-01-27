import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

// Tarot card data
const majorArcana = [
  { id: 0, name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, risk-taking, inconsideration', emoji: '🃏' },
  { id: 1, name: 'The Magician', meaning: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, untapped talents', emoji: '🎩' },
  { id: 2, name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, divine feminine, subconscious', reversed: 'Secrets, withdrawal, silence', emoji: '🌙' },
  { id: 3, name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Creative block, dependence, emptiness', emoji: '👑' },
  { id: 4, name: 'The Emperor', meaning: 'Authority, structure, control, fatherhood', reversed: 'Tyranny, rigidity, coldness', emoji: '🦁' },
  { id: 5, name: 'The Hierophant', meaning: 'Spiritual wisdom, tradition, conformity, morality', reversed: 'Rebellion, subversiveness, new approaches', emoji: '📿' },
  { id: 6, name: 'The Lovers', meaning: 'Love, harmony, relationships, values alignment', reversed: 'Disharmony, imbalance, misalignment', emoji: '💕' },
  { id: 7, name: 'The Chariot', meaning: 'Control, willpower, success, determination', reversed: 'Lack of control, aggression, obstacles', emoji: '🏆' },
  { id: 8, name: 'Strength', meaning: 'Courage, persuasion, influence, compassion', reversed: 'Self-doubt, weakness, insecurity', emoji: '🦋' },
  { id: 9, name: 'The Hermit', meaning: 'Soul searching, introspection, being alone, guidance', reversed: 'Isolation, loneliness, withdrawal', emoji: '🏔️' },
  { id: 10, name: 'Wheel of Fortune', meaning: 'Change, cycles, fate, decisive moments', reversed: 'Bad luck, resistance to change, breaking cycles', emoji: '🎡' },
  { id: 11, name: 'Justice', meaning: 'Fairness, truth, cause and effect, law', reversed: 'Unfairness, lack of accountability, dishonesty', emoji: '⚖️' },
  { id: 12, name: 'The Hanged Man', meaning: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling', emoji: '🙃' },
  { id: 13, name: 'Death', meaning: 'Endings, change, transformation, transition', reversed: 'Resistance to change, stagnation, decay', emoji: '🦋' },
  { id: 14, name: 'Temperance', meaning: 'Balance, moderation, patience, purpose', reversed: 'Imbalance, excess, self-healing', emoji: '⚗️' },
  { id: 15, name: 'The Devil', meaning: 'Shadow self, attachment, addiction, restriction', reversed: 'Releasing limiting beliefs, exploring dark thoughts', emoji: '⛓️' },
  { id: 16, name: 'The Tower', meaning: 'Sudden change, upheaval, chaos, revelation', reversed: 'Personal transformation, fear of change', emoji: '🗼' },
  { id: 17, name: 'The Star', meaning: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, disconnection', emoji: '⭐' },
  { id: 18, name: 'The Moon', meaning: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, inner confusion', emoji: '🌙' },
  { id: 19, name: 'The Sun', meaning: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic', emoji: '☀️' },
  { id: 20, name: 'Judgement', meaning: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, inner critic, ignoring the call', emoji: '📯' },
  { id: 21, name: 'The World', meaning: 'Completion, integration, accomplishment, travel', reversed: 'Seeking closure, short-cuts, delays', emoji: '🌍' },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TarotScreen() {
  const [selectedCard, setSelectedCard] = useState<typeof majorArcana[0] | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const cardRotation = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${cardRotation.value}deg` },
      { scale: cardScale.value },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const drawCard = () => {
    if (isRevealing) return;
    
    setIsRevealing(true);
    setHasDrawn(true);
    
    // Shuffle animation
    cardScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    // Pick random card
    const randomIndex = Math.floor(Math.random() * majorArcana.length);
    const reversed = Math.random() > 0.7; // 30% chance reversed
    
    setTimeout(() => {
      setSelectedCard(majorArcana[randomIndex]);
      setIsReversed(reversed);
      
      // Flip animation
      cardRotation.value = withSequence(
        withTiming(90, { duration: 300 }),
        withTiming(0, { duration: 300 }),
      );
      
      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.3, { duration: 1000 }),
      );
      
      setIsRevealing(false);
    }, 500);
  };

  const resetReading = () => {
    setSelectedCard(null);
    setIsReversed(false);
    setHasDrawn(false);
    cardRotation.value = 0;
    glowOpacity.value = 0;
  };

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Daily Tarot',
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Daily Card Pull</Text>
            <Text style={styles.subtitle}>Receive guidance from the universe</Text>
          </View>

          {/* Card Area */}
          <View style={styles.cardArea}>
            <Animated.View style={[styles.glowEffect, glowAnimatedStyle]} />
            
            <AnimatedTouchable 
              style={[styles.card, cardAnimatedStyle]}
              onPress={hasDrawn ? undefined : drawCard}
              activeOpacity={hasDrawn ? 1 : 0.8}
            >
              <LinearGradient
                colors={selectedCard ? ['#2A2A4A', '#1A1A2E'] : ['#1A1A2E', '#0A0A1E']}
                style={styles.cardGradient}
              >
                {selectedCard ? (
                  <View style={[styles.cardContent, isReversed && styles.cardReversed]}>
                    <Text style={styles.cardEmoji}>{selectedCard.emoji}</Text>
                    <Text style={styles.cardName}>{selectedCard.name}</Text>
                    {isReversed && (
                      <View style={styles.reversedBadge}>
                        <Text style={styles.reversedText}>Reversed</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.cardBack}>
                    <Text style={styles.cardBackSymbol}>✦</Text>
                    <Text style={styles.cardBackText}>Tap to Draw</Text>
                  </View>
                )}
              </LinearGradient>
            </AnimatedTouchable>
          </View>

          {/* Card Meaning */}
          {selectedCard && (
            <View style={styles.meaningSection}>
              <LinearGradient
                colors={['rgba(139, 126, 200, 0.1)', 'rgba(201, 169, 98, 0.05)']}
                style={styles.meaningCard}
              >
                <View style={styles.meaningHeader}>
                  <Ionicons name="sparkles" size={20} color={COLORS.primary} />
                  <Text style={styles.meaningTitle}>
                    {isReversed ? 'Reversed Meaning' : 'Card Meaning'}
                  </Text>
                </View>
                
                <Text style={styles.meaningText}>
                  {isReversed ? selectedCard.reversed : selectedCard.meaning}
                </Text>

                {/* Guidance */}
                <View style={styles.guidanceBox}>
                  <Text style={styles.guidanceLabel}>TODAY'S GUIDANCE</Text>
                  <Text style={styles.guidanceText}>
                    {isReversed 
                      ? `${selectedCard.name} reversed invites you to reflect on ${selectedCard.reversed.toLowerCase()}. This is a time for inner work and honest self-assessment.`
                      : `${selectedCard.name} brings the energy of ${selectedCard.meaning.split(',')[0].toLowerCase()}. Embrace this energy in your day.`
                    }
                  </Text>
                </View>

                <TouchableOpacity style={styles.newReadingButton} onPress={resetReading}>
                  <Text style={styles.newReadingText}>Draw Another Card</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* Info Section */}
          {!selectedCard && (
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle-outline" size={24} color={COLORS.accent} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>How it Works</Text>
                  <Text style={styles.infoText}>
                    Focus on a question or simply ask for guidance. Tap the card to reveal your daily message from the universe.
                  </Text>
                </View>
              </View>

              <View style={styles.tipsList}>
                <Text style={styles.tipsTitle}>Tips for Your Reading</Text>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Take a deep breath before drawing</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Clear your mind and set an intention</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Trust your intuition when interpreting</Text>
                </View>
              </View>
            </View>
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
  
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Card Area
  cardArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    height: 320,
  },
  glowEffect: {
    position: 'absolute',
    width: 250,
    height: 350,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  card: {
    width: 200,
    height: 300,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
  },
  cardBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackSymbol: {
    fontSize: 48,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  cardBackText: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  cardReversed: {
    transform: [{ rotate: '180deg' }],
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  cardName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  reversedBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    backgroundColor: COLORS.warning + '30',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    transform: [{ rotate: '180deg' }],
  },
  reversedText: {
    ...FONTS.caption,
    color: COLORS.warning,
  },

  // Meaning Section
  meaningSection: { marginBottom: SPACING.xl },
  meaningCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  meaningTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  meaningText: {
    ...FONTS.bodyLarge,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  guidanceBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  guidanceLabel: {
    ...FONTS.overline,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  guidanceText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  newReadingButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  newReadingText: {
    ...FONTS.bodyMedium,
    color: COLORS.primary,
  },

  // Info Section
  infoSection: { gap: SPACING.lg },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoContent: { flex: 1, marginLeft: SPACING.md },
  infoTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  infoText: { ...FONTS.bodySmall, color: COLORS.textMuted, marginTop: 4 },

  tipsList: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary, marginBottom: SPACING.md },
  tipItem: { flexDirection: 'row', marginBottom: SPACING.sm },
  tipBullet: { ...FONTS.body, color: COLORS.primary, marginRight: SPACING.sm },
  tipText: { ...FONTS.body, color: COLORS.textSecondary, flex: 1 },
});
