import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

// Gemstone data based on zodiac
const gemstones = [
  {
    id: 1,
    name: 'Citrine',
    subtitle: 'Stone of Abundance',
    description: 'Attracts wealth, prosperity, and success. Perfect for career-focused goals.',
    benefits: ['Abundance', 'Clarity', 'Confidence'],
    color: '#F5C542',
    gradient: ['#F5C542', '#E5A832'] as const,
    zodiac: ['Leo', 'Gemini', 'Aries'],
    chakra: 'Solar Plexus',
    recommended: true,
  },
  {
    id: 2,
    name: 'Amethyst',
    subtitle: 'Stone of Spirituality',
    description: 'Enhances intuition and spiritual awareness. Calms the mind and promotes peace.',
    benefits: ['Intuition', 'Peace', 'Wisdom'],
    color: '#9B59B6',
    gradient: ['#9B59B6', '#8E44AD'] as const,
    zodiac: ['Pisces', 'Aquarius', 'Capricorn'],
    chakra: 'Crown',
    recommended: false,
  },
  {
    id: 3,
    name: 'Rose Quartz',
    subtitle: 'Stone of Love',
    description: 'Opens the heart to all forms of love. Promotes self-love and emotional healing.',
    benefits: ['Love', 'Healing', 'Compassion'],
    color: '#FFB6C1',
    gradient: ['#FFB6C1', '#FF69B4'] as const,
    zodiac: ['Taurus', 'Libra', 'Cancer'],
    chakra: 'Heart',
    recommended: false,
  },
  {
    id: 4,
    name: 'Tiger\'s Eye',
    subtitle: 'Stone of Courage',
    description: 'Brings focus, determination, and protection. Great for decision-making.',
    benefits: ['Courage', 'Focus', 'Protection'],
    color: '#B8860B',
    gradient: ['#DAA520', '#B8860B'] as const,
    zodiac: ['Leo', 'Capricorn'],
    chakra: 'Solar Plexus',
    recommended: false,
  },
  {
    id: 5,
    name: 'Moonstone',
    subtitle: 'Stone of New Beginnings',
    description: 'Enhances intuition and promotes inspiration. Connected to lunar energy.',
    benefits: ['Intuition', 'Balance', 'Fertility'],
    color: '#E8E8F0',
    gradient: ['#E8E8F0', '#C7D0E8'] as const,
    zodiac: ['Cancer', 'Libra', 'Scorpio'],
    chakra: 'Third Eye',
    recommended: false,
  },
  {
    id: 6,
    name: 'Black Tourmaline',
    subtitle: 'Stone of Protection',
    description: 'Powerful protection against negative energy. Grounds and purifies.',
    benefits: ['Protection', 'Grounding', 'Purification'],
    color: '#1C1C1C',
    gradient: ['#2C2C2C', '#1C1C1C'] as const,
    zodiac: ['Capricorn', 'Scorpio'],
    chakra: 'Root',
    recommended: false,
  },
];

const categories = ['All', 'Recommended', 'Love', 'Career', 'Protection'];

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGems = activeCategory === 'All' 
    ? gemstones 
    : activeCategory === 'Recommended'
    ? gemstones.filter(g => g.recommended)
    : gemstones.filter(g => g.benefits.some(b => 
        b.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(b.toLowerCase())
      ));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Gem Shop</Text>
          <Text style={styles.subtitle}>Lucky stones for your journey</Text>
        </Animated.View>

        {/* Featured Gem */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.featuredContainer}>
          <LinearGradient
            colors={['rgba(201, 169, 98, 0.15)', 'rgba(139, 126, 200, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredCard}
          >
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={COLORS.primary} />
              <Text style={styles.featuredBadgeText}>Recommended for You</Text>
            </View>
            
            <View style={styles.featuredContent}>
              <View style={styles.featuredGemIcon}>
                <LinearGradient
                  colors={gemstones[0].gradient}
                  style={styles.gemIconGradient}
                >
                  <Ionicons name="diamond" size={32} color="#FFF" />
                </LinearGradient>
              </View>
              
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName}>{gemstones[0].name}</Text>
                <Text style={styles.featuredSubtitle}>{gemstones[0].subtitle}</Text>
                <Text style={styles.featuredDesc} numberOfLines={2}>
                  {gemstones[0].description}
                </Text>
              </View>
            </View>

            <View style={styles.featuredBenefits}>
              {gemstones[0].benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitTag}>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Learn More</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.textInverse} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                activeCategory === category && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </Animated.View>

        {/* Gemstone Grid */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.gemGrid}>
          {filteredGems.map((gem, idx) => (
            <TouchableOpacity 
              key={gem.id} 
              style={styles.gemCard}
              activeOpacity={0.7}
            >
              <View style={styles.gemCardInner}>
                {gem.recommended && (
                  <View style={styles.recommendedTag}>
                    <Ionicons name="star" size={10} color={COLORS.primary} />
                  </View>
                )}
                
                <LinearGradient
                  colors={gem.gradient}
                  style={styles.gemCardIcon}
                >
                  <Ionicons name="diamond" size={24} color="#FFF" />
                </LinearGradient>
                
                <Text style={styles.gemName}>{gem.name}</Text>
                <Text style={styles.gemSubtitle}>{gem.subtitle}</Text>
                
                <View style={styles.gemChakra}>
                  <Text style={styles.gemChakraText}>{gem.chakra} Chakra</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Info Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How it Works</Text>
              <Text style={styles.infoText}>
                Gemstones are recommended based on your zodiac sign, birth chart, and current planetary positions.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Zodiac Matches */}
        <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR ZODIAC MATCHES</Text>
          <View style={styles.zodiacRow}>
            <View style={styles.zodiacItem}>
              <Text style={styles.zodiacEmoji}>♌</Text>
              <Text style={styles.zodiacName}>Leo</Text>
              <Text style={styles.zodiacGem}>Citrine, Tiger's Eye</Text>
            </View>
            <View style={styles.zodiacItem}>
              <Text style={styles.zodiacEmoji}>♍</Text>
              <Text style={styles.zodiacName}>Virgo</Text>
              <Text style={styles.zodiacGem}>Sapphire, Peridot</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { paddingBottom: 160 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Featured Card
  featuredContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  featuredCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryMuted,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  featuredBadgeText: { ...FONTS.caption, color: COLORS.primary, fontWeight: '600' },
  featuredContent: { flexDirection: 'row', marginBottom: SPACING.md },
  featuredGemIcon: { marginRight: SPACING.md },
  gemIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredInfo: { flex: 1 },
  featuredName: { ...FONTS.h2, color: COLORS.textPrimary },
  featuredSubtitle: { ...FONTS.caption, color: COLORS.primary, marginTop: 2 },
  featuredDesc: { ...FONTS.bodySmall, color: COLORS.textSecondary, marginTop: SPACING.xs },
  featuredBenefits: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  benefitTag: {
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  benefitText: { ...FONTS.caption, color: COLORS.textSecondary },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  featuredButtonText: { ...FONTS.bodyMedium, color: COLORS.textInverse },

  // Categories
  categoryScroll: { marginBottom: SPACING.lg },
  categoryContainer: { paddingHorizontal: SPACING.lg, gap: SPACING.xs },
  categoryPill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: { ...FONTS.bodySmall, color: COLORS.textMuted },
  categoryTextActive: { color: COLORS.textInverse },

  // Gem Grid
  gemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  gemCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
  },
  gemCardInner: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendedTag: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primaryMuted,
    padding: 4,
    borderRadius: RADIUS.full,
  },
  gemCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  gemName: { ...FONTS.bodyMedium, color: COLORS.textPrimary, textAlign: 'center' },
  gemSubtitle: { ...FONTS.caption, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  gemChakra: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  gemChakraText: { ...FONTS.caption, color: COLORS.textMuted, fontSize: 10 },

  // Info Section
  infoSection: { padding: SPACING.lg },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoContent: { flex: 1, marginLeft: SPACING.md },
  infoTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  infoText: { ...FONTS.bodySmall, color: COLORS.textMuted, marginTop: 4 },

  // Zodiac Section
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { ...FONTS.overline, color: COLORS.textMuted, marginBottom: SPACING.md },
  zodiacRow: { flexDirection: 'row', gap: SPACING.sm },
  zodiacItem: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zodiacEmoji: { fontSize: 28, marginBottom: SPACING.xs },
  zodiacName: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  zodiacGem: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
});
