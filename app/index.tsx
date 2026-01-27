import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../src/stores';
import { COLORS, FONTS } from '../src/constants/theme';
import { StarField } from '../src/components';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isAuthenticated, profile } = useAuthStore();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const lineWidth = useSharedValue(0);
  const orbPulse = useSharedValue(0);
  const starsOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate stars fade in
    starsOpacity.value = withTiming(1, { duration: 1500 });

    // Animate logo
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) }));

    // Animate tagline
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    taglineY.value = withDelay(600, withTiming(0, { duration: 600 }));

    // Animate line
    lineWidth.value = withDelay(900, withTiming(80, { duration: 800, easing: Easing.inOut(Easing.ease) }));

    // Pulse animation
    orbPulse.value = withDelay(
      1200,
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      )
    );
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const navigate = () => {
      if (isAuthenticated && profile?.fortune_method) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    };

    const timer = setTimeout(navigate, 2500);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, profile]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
    opacity: interpolate(lineWidth.value, [0, 80], [0, 0.4]),
  }));

  const orbStyle = useAnimatedStyle(() => ({
    opacity: interpolate(orbPulse.value, [0, 1], [0.2, 0.5]),
    transform: [{ scale: interpolate(orbPulse.value, [0, 1], [0.9, 1.1]) }],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Animated stars */}
      <Animated.View style={[StyleSheet.absoluteFill, starsStyle]}>
        <StarField density={60} />
      </Animated.View>

      {/* Glow orb behind logo */}
      <Animated.View style={[styles.glowOrb, orbStyle]}>
        <LinearGradient
          colors={['rgba(201, 169, 98, 0.3)', 'transparent']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text style={[styles.logo, logoStyle]}>
          Veya
        </Animated.Text>
        
        <Animated.View style={[styles.line, lineStyle]} />
        
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Your Cosmic Companion
        </Animated.Text>
      </View>

      {/* Bottom accent */}
      <View style={styles.bottomGlow}>
        <LinearGradient
          colors={['transparent', 'rgba(139, 126, 200, 0.08)']}
          style={styles.bottomGradient}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    top: height * 0.3,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 150,
  },
  logo: {
    ...FONTS.hero,
    fontSize: 72,
    color: COLORS.primary,
    letterSpacing: -3,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: 16,
  },
  tagline: {
    ...FONTS.bodyLarge,
    color: COLORS.textSecondary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  bottomGradient: {
    flex: 1,
  },
});
