import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';
import { useAppStore } from '../../src/stores';

export default function DataInputScreen() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useAppStore();
  
  const [name, setName] = useState(onboardingData.name || '');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [birthTime, setBirthTime] = useState(onboardingData.birth_time || '');
  const [birthPlace, setBirthPlace] = useState(onboardingData.birth_place || '');
  
  const isValid = name.trim() && day && month && year.length === 4;
  
  const handleContinue = () => {
    if (!isValid) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    setOnboardingData({
      name: name.trim(),
      dob,
      birth_time: birthTime || undefined,
      birth_place: birthPlace || undefined,
    });
    
    router.push('/(auth)/generating');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.overline}>STEP 3 OF 3</Text>
            <Text style={styles.title}>Your Cosmic Profile</Text>
            <Text style={styles.subtitle}>
              Enter your birth details for personalized insights
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>YOUR NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="words"
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.field}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <View style={styles.dateRow}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={day}
                  onChangeText={(t) => setDay(t.replace(/\D/g, '').slice(0, 2))}
                  placeholder="DD"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={month}
                  onChangeText={(t) => setMonth(t.replace(/\D/g, '').slice(0, 2))}
                  placeholder="MM"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, styles.yearInput]}
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
                  placeholder="YYYY"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            {/* Birth Time (Optional) */}
            <View style={styles.field}>
              <Text style={styles.label}>BIRTH TIME (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                value={birthTime}
                onChangeText={setBirthTime}
                placeholder="e.g., 14:30 or 2:30 PM"
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            {/* Birth Place (Optional) */}
            <View style={styles.field}>
              <Text style={styles.label}>BIRTH PLACE (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                value={birthPlace}
                onChangeText={setBirthPlace}
                placeholder="City, Country"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity 
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Generate My Cosmic Profile</Text>
            <Ionicons name="sparkles" size={20} color={COLORS.textInverse} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  overline: {
    ...FONTS.overline,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  field: {
    gap: SPACING.sm,
  },
  label: {
    ...FONTS.overline,
    color: COLORS.textMuted,
  },
  input: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dateInput: {
    flex: 1,
    textAlign: 'center',
  },
  yearInput: {
    flex: 1.5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  buttonText: {
    ...FONTS.bodyMedium,
    color: COLORS.textInverse,
  },
});
