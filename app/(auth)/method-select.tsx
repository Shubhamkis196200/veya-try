/**
 * METHOD SELECT - PREMIUM 4 ASTROLOGY TYPES
 * Beautiful cards with unique visuals per tradition
 */
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores';

const { width, height } = Dimensions.get('window');

const TRADITIONS = [
  {
    id: 'western',
    emoji: '♈',
    icon: '🌟',
    title: 'Western',
    subtitle: 'Tropical Zodiac',
    desc: 'The most popular system worldwide. Based on seasons and sun signs.',
    gradient: ['#6366F1', '#4F46E5'],
    accent: '#818CF8',
  },
  {
    id: 'vedic',
    emoji: '🕉️',
    icon: '✦',
    title: 'Vedic',
    subtitle: 'Jyotish · Sidereal',
    desc: 'Ancient Indian astrology. Uses nakshatras, dashas, and karma.',
    gradient: ['#F59E0B', '#D97706'],
    accent: '#FBBF24',
  },
  {
    id: 'chinese',
    emoji: '🐉',
    icon: '陰陽',
    title: 'Chinese',
    subtitle: '12 Animal Signs',
    desc: 'Five Elements, Yin/Yang, and the wisdom of ancient China.',
    gradient: ['#EF4444', '#DC2626'],
    accent: '#F87171',
  },
  {
    id: 'numerology',
    emoji: '✡️',
    icon: '∞',
    title: 'Numerology',
    subtitle: 'Sacred Numbers',
    desc: 'Life paths and destiny revealed through numerical vibrations.',
    gradient: ['#10B981', '#059669'],
    accent: '#34D399',
  },
];

function TraditionCard({ tradition, isSelected, onPress, index }: any) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.97, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    onPress();
  };
  
  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 100).duration(500).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Background gradient on selection */}
        {isSelected && (
          <LinearGradient
            colors={[`${tradition.accent}20`, 'transparent']}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        
        {/* Accent line */}
        {isSelected && (
          <LinearGradient
            colors={tradition.gradient}
            style={styles.accentLine}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        )}
        
        <View style={styles.cardContent}>
          {/* Icon section */}
          <View style={[styles.iconBox, { backgroundColor: `${tradition.accent}15` }]}>
            <Text style={styles.iconEmoji}>{tradition.emoji}</Text>
            <View style={[styles.iconGlow, { backgroundColor: tradition.accent }]} />
          </View>
          
          {/* Text section */}
          <View style={styles.textSection}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>{tradition.title}</Text>
              {isSelected && (
                <View style={[styles.selectedBadge, { backgroundColor: tradition.gradient[0] }]}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[styles.cardSubtitle, isSelected && { color: tradition.accent }]}>
              {tradition.subtitle}
            </Text>
            <Text style={styles.cardDesc}>{tradition.desc}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MethodSelectScreen() {
  const router = useRouter();
  const { updateProfile } = useAuthStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(id);
  };

  const handleContinue = async () => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ fortune_method: selected });
    router.push('/(auth)/data-input');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030108', '#0D0620', '#150D25', '#0D0620']}
        locations={[0, 0.25, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <View style={styles.stepIndicator}>
            <View style={styles.stepDotComplete}>
              <Text style={styles.stepCheck}>✓</Text>
            </View>
            <View style={styles.stepLineComplete} />
            <View style={styles.stepDotActive} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>
          
          <Text style={styles.stepText}>STEP 2 OF 3</Text>
          <Text style={styles.title}>Choose your{'\n'}tradition</Text>
          <Text style={styles.subtitle}>
            Each path offers unique cosmic wisdom
          </Text>
        </Animated.View>

        {/* Cards */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cards}
        >
          {TRADITIONS.map((tradition, index) => (
            <TraditionCard
              key={tradition.id}
              tradition={tradition}
              index={index}
              isSelected={selected === tradition.id}
              onPress={() => handleSelect(tradition.id)}
            />
          ))}
          
          {/* Tarot mention */}
          <Animated.View entering={FadeIn.delay(700)} style={styles.tarotNote}>
            <Text style={styles.tarotText}>🎴 Tarot readings also included</Text>
          </Animated.View>
        </ScrollView>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={!selected}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={selected ? ['#A78BFA', '#8B5CF6'] : ['#2D2D3D', '#1D1D2D']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.continueContent}>
              <Text style={styles.continueText}>
                {selected ? 'Continue' : 'Select a tradition'}
              </Text>
              {selected && <Text style={styles.continueArrow}>→</Text>}
            </View>
          </TouchableOpacity>
          
          <Text style={styles.changeNote}>You can change this anytime</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108' },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  stepDotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#A78BFA' },
  stepDotComplete: { 
    width: 20, height: 20, borderRadius: 10, 
    backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center',
  },
  stepCheck: { fontSize: 12, color: '#FFF', fontWeight: 'bold' },
  stepLine: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  stepLineComplete: { width: 40, height: 1, backgroundColor: '#10B981', marginHorizontal: 8 },
  stepText: { fontSize: 11, color: '#A78BFA', letterSpacing: 3, marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '300', color: '#FFF', letterSpacing: -0.5, lineHeight: 42 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 8 },
  cards: { paddingHorizontal: 20, gap: 14, paddingBottom: 100 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  cardSelected: { borderColor: 'rgba(167,139,250,0.4)' },
  accentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardContent: { flexDirection: 'row', padding: 18, alignItems: 'center' },
  iconBox: { 
    width: 64, height: 64, borderRadius: 18, 
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  iconEmoji: { fontSize: 32 },
  iconGlow: { 
    position: 'absolute', width: 30, height: 30, borderRadius: 15, 
    opacity: 0.2, transform: [{ scale: 1.5 }],
  },
  textSection: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#FFF', flex: 1 },
  selectedBadge: { 
    width: 22, height: 22, borderRadius: 11, 
    alignItems: 'center', justifyContent: 'center',
  },
  selectedText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 18 },
  tarotNote: { alignItems: 'center', paddingVertical: 16 },
  tarotText: { fontSize: 13, color: 'rgba(255,255,255,0.3)' },
  footer: { paddingHorizontal: 24, paddingBottom: 20 },
  continueBtn: {
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  continueBtnDisabled: { shadowOpacity: 0 },
  continueContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  continueText: { fontSize: 17, fontWeight: '600', color: '#FFF' },
  continueArrow: { fontSize: 18, color: '#FFF' },
  changeNote: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 16 },
});
