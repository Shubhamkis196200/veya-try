import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

// Mock weekly forecast data
const weeklyForecast = [
  { day: 'Mon', date: 27, energy: 78, mood: '✨', highlight: 'Great for new beginnings' },
  { day: 'Tue', date: 28, energy: 65, mood: '🌙', highlight: 'Rest and reflect' },
  { day: 'Wed', date: 29, energy: 82, mood: '🔥', highlight: 'High creativity day' },
  { day: 'Thu', date: 30, energy: 70, mood: '💫', highlight: 'Focus on relationships' },
  { day: 'Fri', date: 31, energy: 88, mood: '⭐', highlight: 'Career opportunities' },
  { day: 'Sat', date: 1, energy: 75, mood: '🌸', highlight: 'Self-care priority' },
  { day: 'Sun', date: 2, energy: 80, mood: '🌟', highlight: 'Spiritual growth' },
];

// Mock monthly overview
const monthlyOverview = {
  theme: 'Transformation & Growth',
  overview: 'February brings powerful energy for personal transformation. The stars align for major life decisions and spiritual breakthroughs.',
  keyDates: [
    { date: 'Feb 4', event: 'New Moon in Aquarius', type: 'moon' },
    { date: 'Feb 14', event: 'Venus enters Aries', type: 'planet' },
    { date: 'Feb 20', event: 'Full Moon in Virgo', type: 'moon' },
  ],
  areas: [
    { name: 'Love', score: 85, trend: 'up' },
    { name: 'Career', score: 72, trend: 'stable' },
    { name: 'Health', score: 90, trend: 'up' },
    { name: 'Finance', score: 68, trend: 'down' },
  ],
};

export default function ForecastScreen() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Forecast</Text>
          <Text style={styles.subtitle}>Your cosmic outlook</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'monthly' && styles.tabActive]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.tabTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'weekly' ? (
          <>
            {/* Weekly Calendar Strip */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.weekStrip}
              contentContainerStyle={styles.weekStripContent}
            >
              {weeklyForecast.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard,
                    selectedDay === index && styles.dayCardActive
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[styles.dayName, selectedDay === index && styles.dayNameActive]}>
                    {day.day}
                  </Text>
                  <Text style={[styles.dayDate, selectedDay === index && styles.dayDateActive]}>
                    {day.date}
                  </Text>
                  <Text style={styles.dayMood}>{day.mood}</Text>
                  <View style={styles.energyDot}>
                    <View 
                      style={[
                        styles.energyDotFill, 
                        { 
                          height: `${day.energy}%`,
                          backgroundColor: day.energy > 75 ? COLORS.success : 
                                          day.energy > 60 ? COLORS.primary : COLORS.warning
                        }
                      ]} 
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Selected Day Details */}
            <View style={styles.dayDetails}>
              <LinearGradient
                colors={['rgba(201, 169, 98, 0.1)', 'rgba(139, 126, 200, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dayDetailsGradient}
              >
                <View style={styles.dayDetailsHeader}>
                  <Text style={styles.dayDetailsTitle}>
                    {weeklyForecast[selectedDay].day}, Jan {weeklyForecast[selectedDay].date}
                  </Text>
                  <View style={styles.energyBadge}>
                    <Ionicons name="flash" size={14} color={COLORS.primary} />
                    <Text style={styles.energyBadgeText}>
                      {weeklyForecast[selectedDay].energy}%
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.dayHighlight}>
                  {weeklyForecast[selectedDay].highlight}
                </Text>

                {/* Day Energy Breakdown */}
                <View style={styles.timeBlocks}>
                  <View style={styles.timeBlock}>
                    <Ionicons name="sunny-outline" size={20} color={COLORS.celestial.sun} />
                    <Text style={styles.timeBlockLabel}>Morning</Text>
                    <Text style={styles.timeBlockValue}>High Energy</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Ionicons name="partly-sunny-outline" size={20} color={COLORS.celestial.jupiter} />
                    <Text style={styles.timeBlockLabel}>Afternoon</Text>
                    <Text style={styles.timeBlockValue}>Moderate</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Ionicons name="moon-outline" size={20} color={COLORS.celestial.moon} />
                    <Text style={styles.timeBlockLabel}>Evening</Text>
                    <Text style={styles.timeBlockValue}>Reflective</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Weekly Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>WEEKLY GUIDANCE</Text>
              
              <View style={styles.tipCard}>
                <View style={[styles.tipIcon, { backgroundColor: COLORS.success + '15' }]}>
                  <Ionicons name="trending-up" size={20} color={COLORS.success} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipLabel}>Best Days</Text>
                  <Text style={styles.tipText}>Wednesday & Friday have peak energy</Text>
                </View>
              </View>

              <View style={styles.tipCard}>
                <View style={[styles.tipIcon, { backgroundColor: COLORS.warning + '15' }]}>
                  <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipLabel}>Take It Easy</Text>
                  <Text style={styles.tipText}>Tuesday may feel low - schedule rest</Text>
                </View>
              </View>

              <View style={styles.tipCard}>
                <View style={[styles.tipIcon, { backgroundColor: COLORS.accent + '15' }]}>
                  <Ionicons name="heart" size={20} color={COLORS.accent} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipLabel}>Love Focus</Text>
                  <Text style={styles.tipText}>Thursday favors heart-to-heart talks</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Monthly Theme Card */}
            <View style={styles.monthCard}>
              <LinearGradient
                colors={['#1A1A2E', '#16161F']}
                style={styles.monthCardGradient}
              >
                <Text style={styles.monthLabel}>FEBRUARY 2026</Text>
                <Text style={styles.monthTheme}>{monthlyOverview.theme}</Text>
                <Text style={styles.monthOverview}>{monthlyOverview.overview}</Text>
              </LinearGradient>
            </View>

            {/* Key Dates */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>KEY DATES</Text>
              {monthlyOverview.keyDates.map((item, index) => (
                <View key={index} style={styles.dateCard}>
                  <View style={[
                    styles.dateIcon,
                    { backgroundColor: item.type === 'moon' ? COLORS.celestial.moon + '20' : COLORS.celestial.venus + '20' }
                  ]}>
                    <Ionicons 
                      name={item.type === 'moon' ? 'moon' : 'planet'} 
                      size={18} 
                      color={item.type === 'moon' ? COLORS.celestial.moon : COLORS.celestial.venus} 
                    />
                  </View>
                  <View style={styles.dateContent}>
                    <Text style={styles.dateLabel}>{item.date}</Text>
                    <Text style={styles.dateEvent}>{item.event}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </View>
              ))}
            </View>

            {/* Monthly Areas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LIFE AREAS</Text>
              <View style={styles.areasGrid}>
                {monthlyOverview.areas.map((area, index) => (
                  <View key={index} style={styles.areaCard}>
                    <View style={styles.areaHeader}>
                      <Text style={styles.areaName}>{area.name}</Text>
                      <Ionicons 
                        name={area.trend === 'up' ? 'arrow-up' : area.trend === 'down' ? 'arrow-down' : 'remove'} 
                        size={14} 
                        color={area.trend === 'up' ? COLORS.success : area.trend === 'down' ? COLORS.error : COLORS.textMuted} 
                      />
                    </View>
                    <Text style={styles.areaScore}>{area.score}%</Text>
                    <View style={styles.areaBar}>
                      <View 
                        style={[
                          styles.areaBarFill, 
                          { 
                            width: `${area.score}%`,
                            backgroundColor: area.score > 80 ? COLORS.success : 
                                            area.score > 60 ? COLORS.primary : COLORS.warning
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { paddingBottom: 100 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.bodyMedium,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.textInverse,
  },

  // Week Strip
  weekStrip: { marginBottom: SPACING.lg },
  weekStripContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  dayCard: {
    width: 56,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayCardActive: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  dayName: { ...FONTS.caption, color: COLORS.textMuted },
  dayNameActive: { color: COLORS.primary },
  dayDate: { ...FONTS.h3, color: COLORS.textPrimary, marginVertical: 2 },
  dayDateActive: { color: COLORS.primary },
  dayMood: { fontSize: 16, marginVertical: 4 },
  energyDot: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  energyDotFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 2,
  },

  // Day Details
  dayDetails: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  dayDetailsGradient: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  dayDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dayDetailsTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryMuted,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  energyBadgeText: { ...FONTS.captionMedium, color: COLORS.primary },
  dayHighlight: { ...FONTS.bodyLarge, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  
  // Time Blocks
  timeBlocks: { flexDirection: 'row', gap: SPACING.sm },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  timeBlockLabel: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 4 },
  timeBlockValue: { ...FONTS.captionMedium, color: COLORS.textPrimary, marginTop: 2 },

  // Section
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { ...FONTS.overline, color: COLORS.textMuted, marginBottom: SPACING.md },

  // Tip Cards
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tipContent: { flex: 1 },
  tipLabel: { ...FONTS.caption, color: COLORS.textMuted },
  tipText: { ...FONTS.body, color: COLORS.textPrimary, marginTop: 2 },

  // Monthly Card
  monthCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  monthCardGradient: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthLabel: { ...FONTS.overline, color: COLORS.primary, marginBottom: SPACING.sm },
  monthTheme: { ...FONTS.h2, color: COLORS.textPrimary, marginBottom: SPACING.md },
  monthOverview: { ...FONTS.body, color: COLORS.textSecondary, lineHeight: 24 },

  // Date Cards
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  dateContent: { flex: 1 },
  dateLabel: { ...FONTS.captionMedium, color: COLORS.primary },
  dateEvent: { ...FONTS.body, color: COLORS.textPrimary, marginTop: 2 },

  // Areas Grid
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  areaCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaName: { ...FONTS.caption, color: COLORS.textMuted },
  areaScore: { ...FONTS.h2, color: COLORS.textPrimary, marginVertical: SPACING.xs },
  areaBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  areaBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
