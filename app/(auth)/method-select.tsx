import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, METHODS } from '../../src/constants/theme';
import { useAppStore } from '../../src/stores';

export default function MethodSelectScreen() {
  const router = useRouter();
  const { onboardingData, setOnboardingData } = useAppStore();
  
  const handleSelect = (methodKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ method: methodKey });
    router.push('/(auth)/data-input');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.overline}>STEP 2 OF 3</Text>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            Select an astrological tradition for your cosmic insights
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {Object.values(METHODS).map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.option,
                onboardingData.method === method.key && styles.optionSelected,
              ]}
              onPress={() => handleSelect(method.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: method.color + '15' }]}>
                <Ionicons name={method.icon as any} size={28} color={method.color} />
              </View>
              <Text style={[styles.optionTitle, { color: method.color }]}>
                {method.title}
              </Text>
              <Text style={styles.optionSubtitle}>{method.subtitle}</Text>
              <Text style={styles.optionDesc}>{method.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
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
  options: {
    gap: SPACING.md,
  },
  option: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  optionTitle: {
    ...FONTS.h3,
    marginBottom: SPACING.xs,
  },
  optionSubtitle: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  optionDesc: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
