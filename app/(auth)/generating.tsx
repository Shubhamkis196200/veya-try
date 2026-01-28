/**
 * GENERATING SCREEN - Calculate chart locally (no API needed)
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useAuthStore, getZodiacSign } from '../../src/stores';

const MESSAGES = [
  'Consulting the cosmos...',
  'Mapping your stars...',
  'Calculating moon position...',
  'Finding your rising sign...',
  'Aligning the planets...',
  'Weaving your cosmic story...',
];

// Zodiac data for local calculation
const ZODIAC_DATA: Record<string, { element: string; ruling_planet: string; personality: string }> = {
  Aries: { element: 'Fire', ruling_planet: 'Mars', personality: 'Bold, ambitious, and courageous leader' },
  Taurus: { element: 'Earth', ruling_planet: 'Venus', personality: 'Reliable, patient, and devoted soul' },
  Gemini: { element: 'Air', ruling_planet: 'Mercury', personality: 'Curious, adaptable, and witty communicator' },
  Cancer: { element: 'Water', ruling_planet: 'Moon', personality: 'Nurturing, intuitive, and deeply emotional' },
  Leo: { element: 'Fire', ruling_planet: 'Sun', personality: 'Confident, creative, and natural performer' },
  Virgo: { element: 'Earth', ruling_planet: 'Mercury', personality: 'Analytical, practical, and helpful perfectionist' },
  Libra: { element: 'Air', ruling_planet: 'Venus', personality: 'Diplomatic, graceful, and harmony-seeking' },
  Scorpio: { element: 'Water', ruling_planet: 'Pluto', personality: 'Intense, mysterious, and deeply passionate' },
  Sagittarius: { element: 'Fire', ruling_planet: 'Jupiter', personality: 'Adventurous, optimistic, and freedom-loving' },
  Capricorn: { element: 'Earth', ruling_planet: 'Saturn', personality: 'Disciplined, ambitious, and wise achiever' },
  Aquarius: { element: 'Air', ruling_planet: 'Uranus', personality: 'Innovative, humanitarian, and unique thinker' },
  Pisces: { element: 'Water', ruling_planet: 'Neptune', personality: 'Dreamy, compassionate, and artistic soul' },
};

export default function GeneratingScreen() {
  const router = useRouter();
  const { profile, updateProfile, setOnboarded } = useAuthStore();
  const [message, setMessage] = useState(MESSAGES[0]);
  const [step, setStep] = useState(0);
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false);
    scale.value = withRepeat(withTiming(1.1, { duration: 2000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => {
        const next = s + 1;
        if (next < MESSAGES.length) setMessage(MESSAGES[next]);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateChart();
  }, []);

  const calculateChart = async () => {
    try {
      // Calculate sun sign from birth date
      const birthDate = profile?.birthDate || profile?.birth_date || '';
      const sunSign = birthDate ? getZodiacSign(birthDate) : (profile?.sunSign || profile?.sun_sign || 'Aries');
      
      // Get zodiac data
      const zodiacInfo = ZODIAC_DATA[sunSign] || ZODIAC_DATA.Aries;
      
      // Update profile with calculated data
      await updateProfile({
        sunSign: sunSign,
        sun_sign: sunSign,
        zodiac_sign: sunSign,
        moon_sign: 'Calculating...', // Would need exact time + location for real calc
        rising_sign: 'Calculating...', // Would need exact time + location for real calc
        element: zodiacInfo.element,
        ruling_planet: zodiacInfo.ruling_planet,
        personality_summary: zodiacInfo.personality,
      });
      
      // Complete onboarding
      await setOnboarded(true);
      
      // Wait for animations then navigate
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2500);
      
    } catch (error) {
      console.error('Chart calculation error:', error);
      
      // Fallback
      await updateProfile({
        sun_sign: profile?.sunSign || 'Aries',
        moon_sign: 'Unknown',
        rising_sign: 'Unknown',
      });
      
      await setOnboarded(true);
      setTimeout(() => router.replace('/(tabs)'), 2000);
    }
  };

  const displayDate = profile?.birthDate || profile?.birth_date || 'Your birth data';
  const displayTime = profile?.birthTime || profile?.birth_time;
  const displayLocation = profile?.birth_place || profile?.birth_location;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#1A1030', '#0D0D1A']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View entering={FadeIn.duration(1000)} style={animatedStyle}>
            <Text style={styles.orb}>🔮</Text>
          </Animated.View>
          
          <Animated.Text entering={FadeInUp.delay(500)} style={styles.title}>
            Creating Your Chart
          </Animated.Text>
          
          <Animated.Text entering={FadeInUp.delay(700)} style={styles.message}>
            {message}
          </Animated.Text>
          
          <View style={styles.progress}>
            {MESSAGES.map((_, i) => (
              <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
            ))}
          </View>

          <Animated.View entering={FadeIn.delay(1000)} style={styles.dataPreview}>
            <Text style={styles.previewLabel}>Processing</Text>
            <Text style={styles.previewValue}>{displayDate}</Text>
            {displayTime && <Text style={styles.previewTime}>{displayTime}</Text>}
            {displayLocation && <Text style={styles.previewLocation}>📍 {displayLocation}</Text>}
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  orb: { fontSize: 100, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '300', color: '#FFF', marginBottom: 16, letterSpacing: 1 },
  message: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 },
  progress: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: '#A78BFA', width: 24 },
  dataPreview: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  previewLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
  previewValue: { fontSize: 18, color: '#FFF', fontWeight: '500' },
  previewTime: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  previewLocation: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
});
