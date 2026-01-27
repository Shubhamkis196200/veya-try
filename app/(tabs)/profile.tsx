/**
 * PROFILE SCREEN - ENHANCED
 * Birth chart display, Big 3, element balance, settings
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme, useThemeStore } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores';
import { BirthChart } from '../../src/components/BirthChart';
import { InviteFriends } from '../../src/components/ShareCard';
import { getZodiacSymbol } from '../../src/utils/zodiac';

// Element data
const ELEMENTS = {
  fire: { color: '#FF6B35', signs: ['Aries', 'Leo', 'Sagittarius'] },
  earth: { color: '#6B8E23', signs: ['Taurus', 'Virgo', 'Capricorn'] },
  air: { color: '#87CEEB', signs: ['Gemini', 'Libra', 'Aquarius'] },
  water: { color: '#4169E1', signs: ['Cancer', 'Scorpio', 'Pisces'] },
};

function getElement(sign: string): keyof typeof ELEMENTS {
  for (const [element, data] of Object.entries(ELEMENTS)) {
    if (data.signs.includes(sign)) return element as keyof typeof ELEMENTS;
  }
  return 'fire';
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, spacing, radius, mode, setMode, isDark } = useTheme();
  const { profile, signOut } = useAuthStore();
  
  const [showChart, setShowChart] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const sunSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  const moonSign = profile?.moon_sign || 'Cancer';
  const risingSign = profile?.rising_sign || 'Leo';
  
  // Calculate element balance (mock for demo)
  const elementBalance = {
    fire: 30,
    earth: 25,
    air: 20,
    water: 25,
  };
  
  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    signOut();
    router.replace('/');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      <LinearGradient colors={colors.gradient.cosmic} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
              <Text style={styles.avatarText}>
                {(profile?.name?.[0] || 'V').toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {profile?.name || 'Cosmic Traveler'}
            </Text>
            <Text style={[styles.email, { color: colors.text.muted }]}>
              {profile?.email || ''}
            </Text>
          </Animated.View>
          
          {/* Big 3 */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              YOUR BIG 3
            </Text>
            <View style={[styles.big3Container, { backgroundColor: colors.bg.elevated }]}>
              <View style={styles.big3Item}>
                <View style={[styles.big3Icon, { backgroundColor: '#FFB800' + '20' }]}>
                  <Text style={styles.big3Emoji}>☉</Text>
                </View>
                <Text style={[styles.big3Label, { color: colors.text.muted }]}>Sun</Text>
                <Text style={[styles.big3Sign, { color: colors.text.primary }]}>{sunSign}</Text>
              </View>
              
              <View style={styles.big3Item}>
                <View style={[styles.big3Icon, { backgroundColor: '#E8E8F0' + '20' }]}>
                  <Text style={styles.big3Emoji}>☽</Text>
                </View>
                <Text style={[styles.big3Label, { color: colors.text.muted }]}>Moon</Text>
                <Text style={[styles.big3Sign, { color: colors.text.primary }]}>{moonSign}</Text>
              </View>
              
              <View style={styles.big3Item}>
                <View style={[styles.big3Icon, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={styles.big3Emoji}>↑</Text>
                </View>
                <Text style={[styles.big3Label, { color: colors.text.muted }]}>Rising</Text>
                <Text style={[styles.big3Sign, { color: colors.text.primary }]}>{risingSign}</Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Birth Chart Toggle */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <TouchableOpacity
              style={[styles.chartToggle, { backgroundColor: colors.bg.elevated }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowChart(!showChart);
              }}
            >
              <Ionicons name="planet" size={22} color={colors.primary} />
              <Text style={[styles.chartToggleText, { color: colors.text.primary }]}>
                {showChart ? 'Hide Birth Chart' : 'View Birth Chart'}
              </Text>
              <Ionicons 
                name={showChart ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.text.muted} 
              />
            </TouchableOpacity>
            
            {showChart && (
              <Animated.View entering={FadeIn} style={styles.chartContainer}>
                <BirthChart />
              </Animated.View>
            )}
          </Animated.View>
          
          {/* Element Balance */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              ELEMENT BALANCE
            </Text>
            <View style={[styles.elementsCard, { backgroundColor: colors.bg.elevated }]}>
              {Object.entries(elementBalance).map(([element, percentage]) => (
                <View key={element} style={styles.elementRow}>
                  <View style={styles.elementInfo}>
                    <View 
                      style={[
                        styles.elementDot, 
                        { backgroundColor: ELEMENTS[element as keyof typeof ELEMENTS].color }
                      ]} 
                    />
                    <Text style={[styles.elementName, { color: colors.text.primary }]}>
                      {element.charAt(0).toUpperCase() + element.slice(1)}
                    </Text>
                  </View>
                  <View style={[styles.elementBar, { backgroundColor: colors.bg.muted }]}>
                    <View 
                      style={[
                        styles.elementFill,
                        { 
                          width: `${percentage}%`,
                          backgroundColor: ELEMENTS[element as keyof typeof ELEMENTS].color,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.elementPercent, { color: colors.text.muted }]}>
                    {percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
          
          {/* Settings */}
          <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              SETTINGS
            </Text>
            
            {/* Theme Toggle */}
            <View style={[styles.settingCard, { backgroundColor: colors.bg.elevated }]}>
              <View style={styles.settingRow}>
                <Ionicons name="moon" size={22} color={colors.text.secondary} />
                <Text style={[styles.settingText, { color: colors.text.primary }]}>
                  Dark Mode
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={(value) => {
                    Haptics.selectionAsync();
                    setMode(value ? 'dark' : 'light');
                  }}
                  trackColor={{ false: colors.bg.muted, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border.default }]} />
              
              <View style={styles.settingRow}>
                <Ionicons name="notifications" size={22} color={colors.text.secondary} />
                <Text style={[styles.settingText, { color: colors.text.primary }]}>
                  Notifications
                </Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => {
                    Haptics.selectionAsync();
                    setNotificationsEnabled(value);
                  }}
                  trackColor={{ false: colors.bg.muted, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
            
            {/* Menu Items */}
            <View style={[styles.menuCard, { backgroundColor: colors.bg.elevated }]}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-circle" size={22} color={colors.text.secondary} />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
              </TouchableOpacity>
              
              <View style={[styles.divider, { backgroundColor: colors.border.default }]} />
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle" size={22} color={colors.text.secondary} />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
              </TouchableOpacity>
              
              <View style={[styles.divider, { backgroundColor: colors.border.default }]} />
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="document-text" size={22} color={colors.text.secondary} />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* Invite Friends */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <InviteFriends />
          </Animated.View>
          
          {/* Sign Out */}
          <Animated.View entering={FadeInDown.delay(350)}>
            <TouchableOpacity
              style={[styles.signOutButton, { backgroundColor: colors.error + '15' }]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out" size={22} color={colors.error} />
              <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Version */}
          <Text style={[styles.version, { color: colors.text.muted }]}>
            Veya v1.0.0
          </Text>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#A855F7' },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 14 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  big3Container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
  },
  big3Item: { flex: 1, alignItems: 'center' },
  big3Icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  big3Emoji: { fontSize: 22 },
  big3Label: { fontSize: 12, marginBottom: 4 },
  big3Sign: { fontSize: 15, fontWeight: '600' },
  chartToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  chartToggleText: { flex: 1, fontSize: 16, fontWeight: '500' },
  chartContainer: { marginBottom: 20 },
  elementsCard: { borderRadius: 16, padding: 16 },
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  elementInfo: { flexDirection: 'row', alignItems: 'center', width: 80 },
  elementDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  elementName: { fontSize: 14 },
  elementBar: { flex: 1, height: 6, borderRadius: 3, marginHorizontal: 12 },
  elementFill: { height: '100%', borderRadius: 3 },
  elementPercent: { width: 40, textAlign: 'right', fontSize: 13 },
  settingCard: { borderRadius: 16, padding: 4, marginBottom: 12 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  settingText: { flex: 1, fontSize: 16 },
  divider: { height: 1, marginHorizontal: 12 },
  menuCard: { borderRadius: 16, padding: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuText: { flex: 1, fontSize: 16 },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
  },
  signOutText: { fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 13, marginTop: 24 },
});
