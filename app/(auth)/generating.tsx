import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';
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
  const { setUser, setProfile } = useAuthStore();
  
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageIndex = useRef(0);
  const [currentMessage, setCurrentMessage] = React.useState(loadingMessages[0]);

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Cycle messages
    const messageInterval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[messageIndex.current]);
    }, 2000);

    // Create profile
    createProfile();

    return () => clearInterval(messageInterval);
  }, []);

  const createProfile = async () => {
    try {
      setIsGenerating(true);

      // Sign up anonymously or create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${Date.now()}@veya.app`,
        password: `veya_${Date.now()}_${Math.random().toString(36)}`,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error('Failed to create user');

      // Calculate zodiac
      const zodiacSign = onboardingData.dob 
        ? getZodiacSign(new Date(onboardingData.dob))
        : null;

      // Create profile (table may not exist yet in demo)
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: onboardingData.name,
            dob: onboardingData.dob,
            birth_time: onboardingData.birth_time,
            birth_place: onboardingData.birth_place,
            fortune_method: onboardingData.method,
            intent: onboardingData.intent,
            zodiac_sign: zodiacSign,
          } as any)
          .select()
          .single();

        if (!profileError && profile) {
          setProfile(profile);
        }
      } catch (e) {
        console.log('Profile creation skipped (table may not exist)');
      }

      // Update stores
      setUser(user);
      clearOnboardingData();

      // Navigate to main app
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);

    } catch (error) {
      console.error('Profile creation error:', error);
      // For demo, still navigate
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Animated orb */}
        <Animated.View style={[styles.orb, { transform: [{ rotate: spin }] }]}>
          <View style={styles.orbInner}>
            <Ionicons name="sparkles" size={40} color={COLORS.primary} />
          </View>
        </Animated.View>

        {/* Message */}
        <Text style={styles.message}>{currentMessage}</Text>
        
        <Text style={styles.hint}>This may take a moment</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// Need to import React for useState
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  orbInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  message: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  hint: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});
