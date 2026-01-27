import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeIn,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { StarField } from '../../src/components';

const { width, height } = Dimensions.get('window');

const features = [
  { icon: 'sparkles', title: 'Daily Guidance', desc: 'Personalized cosmic insights' },
  { icon: 'moon', title: 'Moon Phases', desc: 'Lunar energy tracking' },
  { icon: 'heart', title: 'Love Match', desc: 'Zodiac compatibility' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withSpring(1);
    logoScale.value = withSpring(1, { damping: 12 });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />
      <StarField starCount={60} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logoGlow} />
            <Text style={styles.logoEmoji}>✦</Text>
            <Text style={styles.logoText}>Veya</Text>
            <Text style={styles.tagline}>Your Cosmic Guide</Text>
          </Animated.View>

          {/* Features */}
          <View style={styles.features}>
            {features.map((feature, index) => (
              <Animated.View 
                key={index}
                entering={FadeIn.delay(300 + index * 150)}
                style={styles.featureCard}
              >
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* CTA */}
          <Animated.View entering={FadeIn.delay(800)} style={styles.footer}>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => router.push('/(auth)/intent-select')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="sparkles" size={18} color="#FFF" />
                <Text style={styles.ctaText}>Begin Your Journey</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              By continuing, you accept our terms
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  content: { flex: 1, padding: SPACING.lg, justifyContent: 'space-between' },

  logoContainer: { alignItems: 'center', marginTop: SPACING.xxl },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    top: 10,
  },
  logoEmoji: { fontSize: 56, color: COLORS.accent },
  logoText: { ...FONTS.h1, fontSize: 48, color: COLORS.textPrimary, marginTop: SPACING.sm },
  tagline: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  features: { gap: SPACING.md },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  featureDesc: { ...FONTS.caption, color: COLORS.textMuted },

  footer: { alignItems: 'center', paddingBottom: SPACING.lg },
  ctaButton: { width: '100%', marginBottom: SPACING.md },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  ctaText: { ...FONTS.button, color: '#FFF' },
  disclaimer: { ...FONTS.caption, color: COLORS.textMuted, textAlign: 'center' },
});
