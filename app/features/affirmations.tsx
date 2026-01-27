import { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Share 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, ZODIAC } from '../../src/constants/theme';

const { width, height } = Dimensions.get('window');

// Affirmations by category
const affirmations = {
  general: [
    "I am worthy of love, success, and happiness.",
    "I trust the universe has a plan for me.",
    "I release what no longer serves my highest good.",
    "I am exactly where I need to be.",
    "My potential is limitless.",
    "I attract abundance in all forms.",
    "I am grateful for this present moment.",
    "My intuition guides me to my best path.",
    "I radiate positive energy wherever I go.",
    "I am becoming the best version of myself.",
  ],
  love: [
    "I am deserving of deep, meaningful love.",
    "I open my heart to giving and receiving love.",
    "Love flows to me effortlessly and abundantly.",
    "I attract relationships that nurture my soul.",
    "My heart is a magnet for authentic connection.",
    "I release past hurts and welcome new love.",
    "I am whole and complete within myself.",
    "Love surrounds me in all that I do.",
  ],
  career: [
    "I am capable of achieving my professional dreams.",
    "Opportunities flow to me with ease.",
    "I am valued for my unique contributions.",
    "Success is my natural state.",
    "I attract wealth and prosperity.",
    "My work makes a positive impact.",
    "I am confident in my abilities.",
    "Every challenge is an opportunity for growth.",
  ],
  health: [
    "My body is healthy, strong, and full of energy.",
    "I honor my body with nourishing choices.",
    "I am at peace with my body.",
    "Healing energy flows through me.",
    "I prioritize my mental and physical well-being.",
    "I deserve rest and restoration.",
    "Every cell in my body vibrates with wellness.",
    "I listen to what my body needs.",
  ],
  spiritual: [
    "I am connected to the divine energy of the universe.",
    "My spirit is aligned with my highest purpose.",
    "I trust the timing of my life.",
    "I am a channel for love and light.",
    "The universe supports my spiritual growth.",
    "I am one with all that is.",
    "My soul knows the way forward.",
    "I embrace the mystery of existence.",
  ],
};

const categories = [
  { key: 'general', label: 'Daily', icon: 'sunny', color: COLORS.celestial.sun },
  { key: 'love', label: 'Love', icon: 'heart', color: COLORS.intent.love },
  { key: 'career', label: 'Career', icon: 'briefcase', color: COLORS.intent.career },
  { key: 'health', label: 'Health', icon: 'fitness', color: COLORS.intent.growth },
  { key: 'spiritual', label: 'Spiritual', icon: 'sparkles', color: COLORS.primary },
];

export default function AffirmationsScreen() {
  const [category, setCategory] = useState('general');
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    generateAffirmation();
  }, [category]);

  const generateAffirmation = () => {
    // Animate out
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.9, { duration: 200 });
    
    setTimeout(() => {
      const categoryAffirmations = affirmations[category as keyof typeof affirmations];
      const randomIndex = Math.floor(Math.random() * categoryAffirmations.length);
      setCurrentAffirmation(categoryAffirmations[randomIndex]);
      
      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12 });
    }, 200);
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentAffirmation)) {
      setFavorites(favorites.filter(f => f !== currentAffirmation));
    } else {
      setFavorites([...favorites, currentAffirmation]);
    }
    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
  };

  const shareAffirmation = async () => {
    try {
      await Share.share({
        message: `✨ ${currentAffirmation}\n\n— Sent from Veya`,
      });
    } catch (error) {
      // Share failed
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const isFavorite = favorites.includes(currentAffirmation);
  const currentCategory = categories.find(c => c.key === category);

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Affirmations',
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Background Gradient */}
        <LinearGradient
          colors={[COLORS.background, currentCategory?.color + '10', COLORS.background]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Category Selector */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryButton,
                category === cat.key && styles.categoryButtonActive,
                category === cat.key && { borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.key)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={18} 
                color={category === cat.key ? cat.color : COLORS.textMuted} 
              />
              <Text style={[
                styles.categoryLabel,
                category === cat.key && { color: cat.color }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Affirmation Display */}
        <View style={styles.affirmationContainer}>
          <Animated.View style={[styles.affirmationCard, animatedStyle]}>
            <Text style={styles.quoteOpen}>"</Text>
            <Text style={styles.affirmationText}>{currentAffirmation}</Text>
            <Text style={styles.quoteClose}>"</Text>
          </Animated.View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? COLORS.intent.love : COLORS.textMuted} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={generateAffirmation}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[currentCategory?.color || COLORS.primary, COLORS.primary]}
              style={styles.mainActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="refresh" size={24} color="#FFF" />
              <Text style={styles.mainActionText}>New Affirmation</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={shareAffirmation}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>How to Use</Text>
          <Text style={styles.tipsText}>
            Read your affirmation slowly. Breathe deeply. Repeat it three times, 
            feeling its truth in your heart.
          </Text>
        </View>

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <View style={styles.favoritesInfo}>
            <Ionicons name="heart" size={14} color={COLORS.intent.love} />
            <Text style={styles.favoritesText}>{favorites.length} saved affirmations</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },

  // Categories
  categories: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    gap: SPACING.xs,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
  },
  categoryLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // Affirmation
  affirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  affirmationCard: {
    alignItems: 'center',
  },
  quoteOpen: {
    fontSize: 64,
    color: COLORS.primary,
    opacity: 0.3,
    fontFamily: 'serif',
    marginBottom: -SPACING.xl,
  },
  affirmationText: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  quoteClose: {
    fontSize: 64,
    color: COLORS.primary,
    opacity: 0.3,
    fontFamily: 'serif',
    marginTop: -SPACING.xl,
    alignSelf: 'flex-end',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mainActionButton: {
    flex: 1,
    maxWidth: 220,
  },
  mainActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    minHeight: 48,
  },
  mainActionText: {
    ...FONTS.bodyMedium,
    color: '#FFF',
  },

  // Tips
  tips: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tipsText: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    lineHeight: 20,
  },

  // Favorites
  favoritesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
  },
  favoritesText: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
});
