import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { StarField } from './StarField';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const orbitRotation = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Text animation
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));

    // Orbit animation
    orbitRotation.value = withTiming(360, { 
      duration: 8000, 
      easing: Easing.linear 
    });

    // Fade out and finish
    const timeout = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const orbitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation.value}deg` }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.background, '#0A0A1E', COLORS.background]}
        style={StyleSheet.absoluteFill}
      />
      <StarField starCount={80} />

      {/* Orbit rings */}
      <Animated.View style={[styles.orbitContainer, orbitAnimatedStyle]}>
        <View style={[styles.orbit, styles.orbitOuter]} />
        <View style={[styles.orbit, styles.orbitMiddle]} />
        <View style={[styles.orbit, styles.orbitInner]} />
        
        {/* Orbiting dot */}
        <View style={styles.orbitingDot} />
      </Animated.View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logoGlow} />
        <Text style={styles.logoEmoji}>✦</Text>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>Veya</Text>
        <Text style={styles.subtitle}>Your Cosmic Guide</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.loadingContainer}>
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </View>
    </Animated.View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        )
      );
    };

    animate();
    const interval = setInterval(animate, 1000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Orbits
  orbitContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 1000,
    borderStyle: 'dashed',
  },
  orbitOuter: {
    width: 280,
    height: 280,
    borderColor: COLORS.primary + '20',
  },
  orbitMiddle: {
    width: 200,
    height: 200,
    borderColor: COLORS.primary + '30',
  },
  orbitInner: {
    width: 120,
    height: 120,
    borderColor: COLORS.primary + '40',
  },
  orbitingDot: {
    position: 'absolute',
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  logoEmoji: {
    fontSize: 56,
    color: COLORS.accent,
  },

  // Text
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: 8,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textMuted,
    marginTop: 8,
    letterSpacing: 2,
  },

  // Loading
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default SplashScreen;
