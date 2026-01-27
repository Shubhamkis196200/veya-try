import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, INTENTS } from '../../src/constants/theme';
import { useAppStore } from '../../src/stores';
import { StarField } from '../../src/components';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IntentCardProps {
  intent: typeof INTENTS[keyof typeof INTENTS];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function IntentCard({ intent, index, isSelected, onSelect }: IntentCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);
  const selected = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    opacity.value = withDelay(100 + index * 80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(100 + index * 80, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  useEffect(() => {
    selected.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selected.value,
      [0, 1],
      [COLORS.border, intent.color]
    ),
    borderWidth: selected.value === 1 ? 2 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyle]}
    >
      <Animated.View style={[styles.card, borderStyle]}>
        <LinearGradient
          colors={isSelected 
            ? [`${intent.color}15`, `${intent.color}08`]
            : [COLORS.backgroundCard, COLORS.backgroundElevated]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${intent.color}20` }]}>
            <Ionicons name={intent.icon as any} size={24} color={intent.color} />
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{intent.title}</Text>
              <Text style={[styles.symbol, { color: intent.color }]}>{intent.symbol}</Text>
            </View>
            <Text style={styles.cardDesc}>{intent.description}</Text>
          </View>

          {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: intent.color }]}>
              <Ionicons name="checkmark" size={14} color={COLORS.textInverse} />
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </AnimatedPressable>
  );
}

export default function IntentSelectScreen() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useAppStore();

  // Header animations
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const handleSelect = (intentKey: string) => {
    setOnboardingData({ intent: intentKey });
    
    // Brief delay for visual feedback
    setTimeout(() => {
      router.push('/(auth)/method-select');
    }, 150);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />
      
      <StarField density={30} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            <View style={styles.stepDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>

          {/* Header */}
          <Animated.View style={[styles.header, headerStyle]}>
            <Text style={styles.title}>What brings you{'\n'}to Veya?</Text>
            <Text style={styles.subtitle}>
              Choose your primary focus for personalized cosmic guidance
            </Text>
          </Animated.View>

          {/* Options */}
          <View style={styles.options}>
            {Object.values(INTENTS).map((intent, index) => (
              <IntentCard
                key={intent.key}
                intent={intent}
                index={index}
                isSelected={onboardingData.intent === intent.key}
                onSelect={() => handleSelect(intent.key)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  stepIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotLine: {
    width: 32,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  stepText: {
    ...FONTS.overline,
    color: COLORS.primary,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 40,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  options: {
    gap: SPACING.md,
  },
  card: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  symbol: {
    fontSize: 18,
    opacity: 0.6,
  },
  cardDesc: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
