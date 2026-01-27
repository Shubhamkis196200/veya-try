import { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Dimensions, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, darkTheme } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  energy: number;
  gratitude: string;
  reflection: string;
  moonPhase?: string;
}

const moods = [
  { emoji: '😊', label: 'Happy', color: '#7CB587' },
  { emoji: '😌', label: 'Peaceful', color: '#9B8FD9' },
  { emoji: '🤔', label: 'Thoughtful', color: '#5A9BE8' },
  { emoji: '😔', label: 'Sad', color: '#8B8B9B' },
  { emoji: '😤', label: 'Frustrated', color: '#E85A8F' },
  { emoji: '😴', label: 'Tired', color: '#6B6B7B' },
  { emoji: '🥰', label: 'Loved', color: '#E85A8F' },
  { emoji: '✨', label: 'Inspired', color: '#E8B85A' },
];

const STORAGE_KEY = 'veya_journal_entries';

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [energy, setEnergy] = useState(5);
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (e) {
      // Error loading entries - will show empty state
    }
  };

  const saveEntry = async () => {
    if (!selectedMood) {
      Alert.alert('Select a mood', 'Please choose how you\'re feeling today.');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood.label,
      moodEmoji: selectedMood.emoji,
      energy,
      gratitude: gratitude.trim(),
      reflection: reflection.trim(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (e) {
      // Error saving entry - data will only persist in memory
    }

    // Reset form
    setIsWriting(false);
    setSelectedMood(null);
    setEnergy(5);
    setGratitude('');
    setReflection('');
  };

  const deleteEntry = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedEntries = entries.filter(e => e.id !== id);
          setEntries(updatedEntries);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        },
      },
    ]);
  };

  const todayEntry = entries.find(
    e => format(new Date(e.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Cosmic Journal',
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
      }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Write Entry Mode */}
          {isWriting ? (
            <View style={styles.writeContainer}>
              <Text style={styles.sectionTitle}>Today's Entry</Text>
              <Text style={styles.dateText}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>

              {/* Mood Selector */}
              <View style={styles.moodSection}>
                <Text style={styles.label}>How are you feeling?</Text>
                <View style={styles.moodGrid}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood.label}
                      style={[
                        styles.moodButton,
                        selectedMood?.label === mood.label && {
                          backgroundColor: mood.color + '30',
                          borderColor: mood.color,
                        },
                      ]}
                      onPress={() => setSelectedMood(mood)}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={[
                        styles.moodLabel,
                        selectedMood?.label === mood.label && { color: mood.color }
                      ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Energy Level */}
              <View style={styles.energySection}>
                <Text style={styles.label}>Energy Level: {energy}/10</Text>
                <View style={styles.energyBar}>
                  {[...Array(10)].map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.energySegment,
                        i < energy && { backgroundColor: COLORS.primary },
                      ]}
                      onPress={() => setEnergy(i + 1)}
                    />
                  ))}
                </View>
              </View>

              {/* Gratitude */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>What are you grateful for today?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Three things I'm grateful for..."
                  placeholderTextColor={COLORS.textMuted}
                  value={gratitude}
                  onChangeText={setGratitude}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Reflection */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Daily Reflection</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputLarge]}
                  placeholder="What's on your mind? Any cosmic insights?"
                  placeholderTextColor={COLORS.textMuted}
                  value={reflection}
                  onChangeText={setReflection}
                  multiline
                  numberOfLines={5}
                />
              </View>

              {/* Actions */}
              <View style={styles.writeActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsWriting(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.accent]}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                    <Text style={styles.saveButtonText}>Save Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Your Journal</Text>
                <Text style={styles.subtitle}>Track your cosmic journey</Text>
              </View>

              {/* Today's Status */}
              {todayEntry ? (
                <View style={styles.todayCard}>
                  <LinearGradient
                    colors={['rgba(139, 126, 200, 0.1)', 'rgba(201, 169, 98, 0.05)']}
                    style={styles.todayGradient}
                  >
                    <View style={styles.todayHeader}>
                      <Text style={styles.todayEmoji}>{todayEntry.moodEmoji}</Text>
                      <View style={styles.todayInfo}>
                        <Text style={styles.todayTitle}>Today's Entry</Text>
                        <Text style={styles.todayMood}>{todayEntry.mood} • Energy {todayEntry.energy}/10</Text>
                      </View>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                    </View>
                    {todayEntry.gratitude && (
                      <Text style={styles.todayGratitude}>"{todayEntry.gratitude}"</Text>
                    )}
                  </LinearGradient>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.writePrompt}
                  onPress={() => setIsWriting(true)}
                >
                  <View style={styles.writePromptIcon}>
                    <Ionicons name="create-outline" size={28} color={COLORS.primary} />
                  </View>
                  <View style={styles.writePromptContent}>
                    <Text style={styles.writePromptTitle}>Write Today's Entry</Text>
                    <Text style={styles.writePromptSubtitle}>
                      Reflect on your day and track your cosmic energy
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}

              {/* Stats */}
              {entries.length > 0 && (
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{entries.length}</Text>
                    <Text style={styles.statLabel}>Entries</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {Math.round(entries.reduce((a, b) => a + b.energy, 0) / entries.length)}
                    </Text>
                    <Text style={styles.statLabel}>Avg Energy</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {entries.filter(e => {
                        const date = new Date(e.date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth();
                      }).length}
                    </Text>
                    <Text style={styles.statLabel}>This Month</Text>
                  </View>
                </View>
              )}

              {/* Past Entries */}
              <View style={styles.entriesSection}>
                <Text style={styles.sectionTitle}>Past Entries</Text>
                {entries.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={48} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>No entries yet</Text>
                    <Text style={styles.emptySubtext}>Start your cosmic journey today</Text>
                  </View>
                ) : (
                  entries.slice(0, 10).map((entry) => (
                    <TouchableOpacity 
                      key={entry.id} 
                      style={styles.entryCard}
                      onLongPress={() => deleteEntry(entry.id)}
                    >
                      <Text style={styles.entryEmoji}>{entry.moodEmoji}</Text>
                      <View style={styles.entryContent}>
                        <Text style={styles.entryDate}>
                          {format(new Date(entry.date), 'EEEE, MMM d')}
                        </Text>
                        <Text style={styles.entryMeta}>
                          {entry.mood} • Energy {entry.energy}/10
                        </Text>
                        {entry.gratitude && (
                          <Text style={styles.entryGratitude} numberOfLines={1}>
                            {entry.gratitude}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* FAB */}
        {!isWriting && !todayEntry && (
          <TouchableOpacity style={styles.fab} onPress={() => setIsWriting(true)}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  writeContainer: { marginBottom: SPACING.lg },
  scrollView: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 100 },

  // Header
  header: { marginBottom: SPACING.xl },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Section
  sectionTitle: { ...FONTS.h3, color: COLORS.textPrimary, marginBottom: SPACING.md },
  dateText: { ...FONTS.body, color: COLORS.textMuted, marginBottom: SPACING.lg },
  label: { ...FONTS.bodyMedium, color: COLORS.textPrimary, marginBottom: SPACING.sm },

  // Today Card
  todayCard: { marginBottom: SPACING.xl },
  todayGradient: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    ...darkTheme.shadows.card,
  },
  todayHeader: { flexDirection: 'row', alignItems: 'center' },
  todayEmoji: { fontSize: 40, marginRight: SPACING.md },
  todayInfo: { flex: 1 },
  todayTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  todayMood: { ...FONTS.bodySmall, color: COLORS.textMuted },
  todayGratitude: { 
    ...FONTS.body, 
    color: COLORS.textSecondary, 
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },

  // Write Prompt
  writePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...darkTheme.shadows.medium,
  },
  writePromptIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  writePromptContent: { flex: 1 },
  writePromptTitle: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  writePromptSubtitle: { ...FONTS.bodySmall, color: COLORS.textMuted, marginTop: 2 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...darkTheme.shadows.small,
  },
  statValue: { ...FONTS.h2, color: COLORS.primary },
  statLabel: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 2 },

  // Mood Section
  moodSection: { marginBottom: SPACING.xl },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  moodButton: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...darkTheme.shadows.small,
  },
  moodEmoji: { fontSize: 24 },
  moodLabel: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 4 },

  // Energy
  energySection: { marginBottom: SPACING.xl },
  energyBar: {
    flexDirection: 'row',
    gap: 4,
  },
  energySegment: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },

  // Input
  inputSection: { marginBottom: SPACING.lg },
  textInput: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...FONTS.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  textInputLarge: { minHeight: 120 },

  // Write Actions
  writeActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: { ...FONTS.bodyMedium, color: COLORS.textMuted },
  saveButton: { flex: 2 },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  saveButtonText: { ...FONTS.bodyMedium, color: '#FFF' },

  // Entries
  entriesSection: { marginTop: SPACING.md },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...darkTheme.shadows.small,
  },
  entryEmoji: { fontSize: 28, marginRight: SPACING.md },
  entryContent: { flex: 1 },
  entryDate: { ...FONTS.bodyMedium, color: COLORS.textPrimary },
  entryMeta: { ...FONTS.caption, color: COLORS.textMuted, marginTop: 2 },
  entryGratitude: { ...FONTS.bodySmall, color: COLORS.textSecondary, marginTop: 4 },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: { ...FONTS.bodyMedium, color: COLORS.textMuted, marginTop: SPACING.md },
  emptySubtext: { ...FONTS.bodySmall, color: COLORS.textMuted },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...darkTheme.shadows.large,
  },
});
