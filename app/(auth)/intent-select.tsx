/**
 * INTENT SELECT - PREMIUM MULTI-SELECT
 * Beautiful grid with animations
 */
import { useState, useEffect } from 'react';
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
const CARD_WIDTH = (width - 60) / 2;

const INTENTS = [
  { id: 'love', emoji: '💕', title: 'Love', subtitle: 'Relationships & Romance', color: '#F472B6' },
  { id: 'career', emoji: '🚀', title: 'Career', subtitle: 'Success & Growth', color: '#60A5FA' },
  { id: 'money', emoji: '✨', title: 'Wealth', subtitle: 'Abundance & Prosperity', color: '#FBBF24' },
  { id: 'health', emoji: '🌿', title: 'Wellness', subtitle: 'Mind & Body Balance', color: '#34D399' },
  { id: 'family', emoji: '🏠', title: 'Family', subtitle: 'Home & Bonds', color: '#FB923C' },
  { id: 'growth', emoji: '🦋', title: 'Growth', subtitle: 'Self Transformation', color: '#A78BFA' },
  { id: 'spiritual', emoji: '🔮', title: 'Spiritual', subtitle: 'Higher Purpose', color: '#C084FC' },
  { id: 'guidance', emoji: '⭐', title: 'Guidance', subtitle: 'Daily Wisdom', color: '#F9A8D4' },
];

function IntentCard({ intent, isSelected, isPrimary, onPress, index }: any) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    onPress();
  };
  
  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 60).duration(400).springify()}
      style={[styles.cardWrapper, animatedStyle]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && { borderColor: intent.color, borderWidth: 2 },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {isSelected && (
          <LinearGradient
            colors={[`${intent.color}25`, `${intent.color}05`]}
            style={StyleSheet.absoluteFill}
          />
        )}
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{intent.emoji}</Text>
            {isPrimary && (
              <View style={[styles.badge, { backgroundColor: intent.color }]}>
                <Text style={styles.badgeText}>1ST</Text>
              </View>
            )}
            {isSelected && !isPrimary && (
              <View style={[styles.checkCircle, { borderColor: intent.color }]}>
                <Text style={[styles.checkMark, { color: intent.color }]}>✓</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.cardTitle}>{intent.title}</Text>
          <Text style={[styles.cardSubtitle, isSelected && { color: intent.color }]}>
            {intent.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function IntentSelectScreen() {
  const router = useRouter();
  const { updateProfile } = useAuthStore();
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ 
      intent: selected[0],
      // intents removed
    });
    router.push('/(auth)/method-select');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030108', '#0D0620', '#1A0A30', '#0D0620']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Ambient glow */}
      <View style={styles.ambientGlow}>
        <LinearGradient
          colors={['rgba(139,92,246,0.12)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={styles.stepIndicator}>
            <View style={styles.stepDotActive} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>
          
          <Text style={styles.stepText}>STEP 1 OF 3</Text>
          <Text style={styles.title}>What calls to you?</Text>
          <Text style={styles.subtitle}>
            Select all that resonate with your soul
          </Text>
        </Animated.View>

        {/* Grid */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        >
          {INTENTS.map((intent, index) => (
            <IntentCard
              key={intent.id}
              intent={intent}
              index={index}
              isSelected={selected.includes(intent.id)}
              isPrimary={selected[0] === intent.id}
              onPress={() => toggleSelect(intent.id)}
            />
          ))}
        </ScrollView>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
          {selected.length > 0 && (
            <View style={styles.selectionInfo}>
              <View style={styles.selectionDots}>
                {selected.map((id, i) => (
                  <View 
                    key={id} 
                    style={[
                      styles.selectionDot,
                      { backgroundColor: INTENTS.find(x => x.id === id)?.color }
                    ]} 
                  />
                ))}
              </View>
              <Text style={styles.selectionText}>
                {selected.length} selected • First is primary
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.continueBtn, selected.length === 0 && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={selected.length === 0}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={selected.length > 0 ? ['#A78BFA', '#8B5CF6'] : ['#2D2D3D', '#1D1D2D']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.continueText}>
              {selected.length > 0 ? 'Continue' : 'Select at least one'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108' },
  ambientGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.5 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  stepDotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#A78BFA' },
  stepLine: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  stepText: { fontSize: 11, color: '#A78BFA', letterSpacing: 3, marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '300', color: '#FFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 8 },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 20, 
    gap: 12,
    paddingBottom: 120,
  },
  cardWrapper: { width: CARD_WIDTH },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    minHeight: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardEmoji: { fontSize: 32 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  checkCircle: { 
    width: 24, height: 24, borderRadius: 12, 
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 14, fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  footer: { paddingHorizontal: 24, paddingBottom: 20 },
  selectionInfo: { alignItems: 'center', marginBottom: 16 },
  selectionDots: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  selectionDot: { width: 8, height: 8, borderRadius: 4 },
  selectionText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  continueBtn: {
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  continueBtnDisabled: { shadowOpacity: 0 },
  continueText: { fontSize: 17, fontWeight: '600', color: '#FFF' },
});
