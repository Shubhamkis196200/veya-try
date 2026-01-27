import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { useAppStore, useAuthStore } from '../../src/stores';
import { supabase } from '../../src/lib/supabase';
import { getZodiacSign } from '../../src/utils/zodiac';

const loadingMessages = [
  'Reading the stars...',
  'Aligning your cosmic energy...',
  'Calculating planetary positions...',
  'Crafting your destiny...',
  'Finalizing your profile...',
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { onboardingData, clearOnboardingData, setIsGenerating } = useAppStore();
  const { updateProfile } = useAuthStore();
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const messageIndex = useRef(0);

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    // Scale animation
    scale.value = withSequence(
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Cycle messages
    const messageInterval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[messageIndex.current]);
    }, 2500);

    // Generate profile
    generateProfile();

    return () => clearInterval(messageInterval);
  }, []);

  const generateProfile = async () => {
    setIsGenerating(true);
    
    try {
      // Calculate zodiac from birth date
      const birthDate = onboardingData.dob || onboardingData.birth_date;
      const zodiacSign = birthDate 
        ? getZodiacSign(new Date(birthDate))
        : null;

      // Try to update profile if authenticated
      try {
        await updateProfile({
          name: onboardingData.name,
          birth_date: birthDate,
          birth_time: onboardingData.birth_time,
          birth_place: onboardingData.birth_place,
          intent: onboardingData.intent,
          fortune_method: onboardingData.method || onboardingData.fortune_method,
          sun_sign: zodiacSign?.toLowerCase(),
        });
      } catch (e) {
        console.log('Profile update skipped:', e);
      }

      clearOnboardingData();

      // Navigate to main app
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);

    } catch (error) {
      console.error('Profile creation error:', error);
      // Still navigate on error
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundSecondary, COLORS.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        {/* Spinning icon with gradient background */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={['rgba(139, 127, 217, 0.2)', 'rgba(201, 169, 98, 0.2)']}
            style={styles.iconBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="sparkles" size={60} color={COLORS.primary} />
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Loading message */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Text style={styles.message}>{currentMessage}</Text>
        </Animated.View>
        
        {/* Progress dots */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                messageIndex.current % 3 === i && styles.dotActive
              ]} 
            />
          ))}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconWrapper: {
    marginBottom: SPACING.xl,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderPurple,
  },
  message: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
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
});
