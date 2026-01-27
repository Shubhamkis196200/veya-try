import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, INTENTS, METHODS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores';
import { getZodiacSymbol } from '../../src/utils/zodiac';

export default function ProfileScreen() {
  const { profile, signOut } = useAuthStore();
  
  const intentInfo = profile?.intent ? INTENTS[profile.intent as keyof typeof INTENTS] : null;
  const methodInfo = profile?.fortune_method ? METHODS[profile.fortune_method as keyof typeof METHODS] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.name?.[0] || 'V').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.name || 'Veya User'}</Text>
          {profile?.zodiac_sign && (
            <Text style={styles.zodiac}>
              {getZodiacSymbol(profile.zodiac_sign)} {profile.zodiac_sign}
            </Text>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.cards}>
          {/* Method */}
          {methodInfo && (
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: methodInfo.color + '15' }]}>
                <Ionicons name={methodInfo.icon as any} size={20} color={methodInfo.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Astrology System</Text>
                <Text style={styles.infoValue}>{methodInfo.title}</Text>
              </View>
            </View>
          )}

          {/* Intent */}
          {intentInfo && (
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: intentInfo.color + '15' }]}>
                <Ionicons name={intentInfo.icon as any} size={20} color={intentInfo.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Focus Area</Text>
                <Text style={styles.infoValue}>{intentInfo.title}</Text>
              </View>
            </View>
          )}

          {/* DOB */}
          {profile?.dob && (
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: COLORS.celestial.sun + '15' }]}>
                <Ionicons name="calendar" size={20} color={COLORS.celestial.sun} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Birth Date</Text>
                <Text style={styles.infoValue}>{profile.dob}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.signOut]} onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
            <Text style={[styles.menuText, { color: COLORS.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.version}>Veya v1.0.0</Text>
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  zodiac: {
    ...FONTS.body,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  cards: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  infoValue: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    ...FONTS.overline,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.md,
  },
  signOut: {
    marginTop: SPACING.md,
    borderColor: COLORS.error + '30',
  },
  version: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
