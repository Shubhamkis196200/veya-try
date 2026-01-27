/**
 * GENERATING SCREEN - AI CALCULATES FULL CHART
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useAuthStore } from '../../src/stores';

const SUPABASE_URL = 'https://ennlryjggdoljgbqhttb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubmxyeWpnZ2RvbGpnYnFodHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MjkxNzAsImV4cCI6MjA1MzUwNTE3MH0.2utgjnoFsHJeKtwofLeeT-AHM_2I19RSqYTdFqp90qY';

const MESSAGES = [
  'Consulting the cosmos...',
  'Mapping your stars...',
  'Calculating moon position...',
  'Finding your rising sign...',
  'Aligning the planets...',
  'Weaving your cosmic story...',
];

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
      // Call AI to calculate full chart
      const response = await fetch(`${SUPABASE_URL}/functions/v1/calculate-chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({
          birthDate: profile?.birth_date,
          birthTime: profile?.birth_time,
          birthLocation: profile?.birth_place || profile?.birth_location,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.chart) {
        // Update profile with AI-calculated signs
        await updateProfile({
          sun_sign: data.chart.sun_sign || profile?.sun_sign,
          moon_sign: data.chart.moon_sign || 'Unknown',
          rising_sign: data.chart.rising_sign || 'Unknown',
          element: data.chart.element,
          ruling_planet: data.chart.ruling_planet,
          personality_summary: data.chart.personality,
        });
      }
      
      // Complete onboarding
      await setOnboarded(true);
      
      // Wait for animations then navigate
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
      
    } catch (error) {
      console.error('Chart calculation error:', error);
      // Still complete onboarding even if AI fails
      await setOnboarded(true);
      setTimeout(() => router.replace('/(tabs)'), 2000);
    }
  };

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
            <Text style={styles.previewValue}>{profile?.birth_date || 'Your birth data'}</Text>
            {profile?.birth_time && <Text style={styles.previewTime}>{profile.birth_time}</Text>}
            {(profile?.birth_place || profile?.birth_location) && <Text style={styles.previewLocation}>📍 {profile.birth_place || profile.birth_location}</Text>}
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
