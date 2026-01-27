import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { GlowButton, StarField } from '../../src/components';

const { width, height } = Dimensions.get('window');

const features = [
  { 
    icon: 'sunny-outline', 
    title: 'Daily Cosmic Insights', 
    desc: 'Personalized guidance aligned with your stars',
    color: COLORS.celestial.sun,
  },
  { 
    icon: 'chatbubble-ellipses-outline', 
    title: 'AI Astrologer', 
    desc: 'Ask anything about your celestial path',
    color: COLORS.accent,
  },
  { 
    icon: 'diamond-outline', 
    title: 'Gem Recommendations', 
    desc: 'Crystals chosen for your unique energy',
    color: COLORS.primary,
  },
];

function AnimatedFeature({ feature, index }: { feature: typeof features[0]; index: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);

  useEffect(() => {
    opacity.value = withDelay(600 + index * 150, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(600 + index * 150, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.featureItem, animatedStyle]}>
      <LinearGradient
        colors={[`${feature.color}15`, `${feature.color}05`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureGradient}
      >
        <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
          <Ionicons name={feature.icon as any} size={24} color={feature.color} />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDesc}>{feature.desc}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  // Animations
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const taglineOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(30);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 100 }));
    
    // Tagline
    taglineOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    
    // CTA
    ctaOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));
    ctaY.value = withDelay(1200, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#1A1A2E', '#0A0A0F']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      <StarField density={40} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.header}>
            <Animated.View style={logoStyle}>
              <Text style={styles.logo}>Veya</Text>
            </Animated.View>
            <Animated.Text style={[styles.tagline, taglineStyle]}>
              Unlock Your Cosmic Blueprint
            </Animated.Text>
            
            {/* Decorative line */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            {features.map((feature, index) => (
              <AnimatedFeature key={index} feature={feature} index={index} />
            ))}
          </View>

          {/* CTA */}
          <Animated.View style={[styles.footer, ctaStyle]}>
            <GlowButton
              title="Begin Your Journey"
              onPress={() => router.push('/(auth)/intent-select')}
              size="large"
              icon={<Ionicons name="sparkles" size={18} color={COLORS.textInverse} />}
            />
            
            <Text style={styles.disclaimer}>
              By continuing, you accept our terms of service and privacy policy
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(10, 10, 15, 0.9)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  logo: {
    ...FONTS.hero,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    ...FONTS.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  features: {
    gap: SPACING.md,
    marginVertical: SPACING.xl,
  },
  featureItem: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingRight: SPACING.lg,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  footer: {
    gap: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  disclaimer: {
    ...FONTS.caption,
    color: COLORS.textDim,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
});
