/**
 * WELCOME SCREEN - PREMIUM DESIGN
 * Inspired by Co-Star, The Pattern, Sanctuary
 */
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Animated Star component
function AnimatedStar({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1500 }),
      ),
      -1, true
    ));
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.8, { duration: 1200 }),
      ),
      -1, true
    ));
  }, []);
  
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, style]}>
      <Text style={{ fontSize: size, color: '#FFF' }}>✦</Text>
    </Animated.View>
  );
}

// Floating Orb component
function FloatingOrb({ color, size, x, y, delay }: any) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    ));
  }, []);
  
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, style]}>
      <LinearGradient
        colors={[color, 'transparent']}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animations
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const moonRotation = useSharedValue(0);
  const glowPulse = useSharedValue(0.3);
  
  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withDelay(300, withSpring(1, { damping: 15 }));
    logoScale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }));
    
    // Continuous moon rotation
    moonRotation.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1, false
    );
    
    // Glow pulse
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 }),
      ),
      -1, true
    );
  }, []);
  
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${moonRotation.value}deg` }],
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));
  
  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/intent-select');
  };

  // Generate stars
  const stars = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.6,
    size: 6 + Math.random() * 10,
    delay: Math.random() * 2000,
  }));

  return (
    <View style={styles.container}>
      {/* Deep space gradient */}
      <LinearGradient
        colors={['#030108', '#0D0620', '#1A0A30', '#0D0620', '#030108']}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Nebula effect */}
      <Animated.View style={[styles.nebula, glowStyle]}>
        <LinearGradient
          colors={['rgba(139,92,246,0.15)', 'transparent']}
          style={styles.nebulaGradient}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        />
      </Animated.View>
      
      {/* Floating orbs */}
      <FloatingOrb color="rgba(167,139,250,0.4)" size={150} x={-50} y={height * 0.15} delay={0} />
      <FloatingOrb color="rgba(251,191,36,0.3)" size={100} x={width - 80} y={height * 0.25} delay={500} />
      <FloatingOrb color="rgba(96,165,250,0.25)" size={120} x={width * 0.3} y={height * 0.6} delay={1000} />
      
      {/* Animated stars */}
      {stars.map((star, i) => (
        <AnimatedStar key={i} {...star} />
      ))}

      <SafeAreaView style={styles.safeArea}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, logoStyle]}>
          {/* Glow behind logo */}
          <Animated.View style={[styles.logoGlow, glowStyle]}>
            <LinearGradient
              colors={['rgba(167,139,250,0.5)', 'rgba(139,92,246,0.2)', 'transparent']}
              style={styles.logoGlowGradient}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          {/* Moon orbit */}
          <Animated.View style={[styles.moonOrbit, moonStyle]}>
            <View style={styles.moonDot} />
          </Animated.View>
          
          {/* Logo */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoStar}>✧</Text>
          </View>
          
          <Text style={styles.logoText}>Veya</Text>
          <Text style={styles.tagline}>YOUR COSMIC GUIDE</Text>
        </Animated.View>
        
        {/* Features */}
        <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌙</Text>
              <Text style={styles.featureText}>Daily Insights</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Birth Chart</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💫</Text>
              <Text style={styles.featureText}>AI Guide</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View entering={FadeIn.delay(900).duration(600)} style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.ctaContent}>
              <Text style={styles.ctaText}>Begin Your Journey</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Unlock the secrets written in your stars
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030108',
  },
  nebula: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
  },
  nebulaGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: height * 0.1,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: -50,
  },
  logoGlowGradient: {
    flex: 1,
    borderRadius: 125,
  },
  moonOrbit: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    top: 10,
  },
  moonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCD34D',
    position: 'absolute',
    top: -4,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoStar: {
    fontSize: 48,
    color: '#FCD34D',
    textShadowColor: '#FCD34D',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 6,
    marginTop: 12,
  },
  features: {
    marginTop: -40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  featureDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ctaArrow: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
