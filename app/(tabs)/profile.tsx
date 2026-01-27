/**
 * PROFILE SCREEN - COMPLETE
 */
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores';

const ZODIAC_EMOJIS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const ELEMENTS: Record<string, { color: string; icon: string }> = {
  fire: { color: '#EF4444', icon: '🔥' },
  earth: { color: '#22C55E', icon: '🌿' },
  air: { color: '#60A5FA', icon: '💨' },
  water: { color: '#3B82F6', icon: '💧' },
};

function getElement(sign: string): string {
  const fireSign = ['Aries', 'Leo', 'Sagittarius'];
  const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
  const airSigns = ['Gemini', 'Libra', 'Aquarius'];
  if (fireSign.includes(sign)) return 'fire';
  if (earthSigns.includes(sign)) return 'earth';
  if (airSigns.includes(sign)) return 'air';
  return 'water';
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuthStore();
  
  const sunSign = profile?.sun_sign || profile?.zodiac_sign || 'Aries';
  const moonSign = profile?.moon_sign || 'Cancer';
  const risingSign = profile?.rising_sign || 'Libra';
  const element = getElement(sunSign);
  const elementData = ELEMENTS[element];
  const userName = profile?.name || 'Stargazer';
  const userEmail = profile?.email || '';
  const method = profile?.fortune_method || 'western';
  const intent = profile?.intent || 'guidance';

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: `${elementData.color}30` }]}>
              <Text style={styles.avatarEmoji}>{ZODIAC_EMOJIS[sunSign] || '✨'}</Text>
            </View>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
          </Animated.View>

          {/* Big 3 */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Your Big 3</Text>
            <View style={styles.big3Container}>
              <View style={styles.big3Card}>
                <Text style={styles.big3Label}>☀️ Sun</Text>
                <Text style={styles.big3Sign}>{sunSign}</Text>
                <Text style={styles.big3Desc}>Core identity</Text>
              </View>
              <View style={styles.big3Card}>
                <Text style={styles.big3Label}>🌙 Moon</Text>
                <Text style={styles.big3Sign}>{moonSign}</Text>
                <Text style={styles.big3Desc}>Emotions</Text>
              </View>
              <View style={styles.big3Card}>
                <Text style={styles.big3Label}>⬆️ Rising</Text>
                <Text style={styles.big3Sign}>{risingSign}</Text>
                <Text style={styles.big3Desc}>Outer self</Text>
              </View>
            </View>
          </Animated.View>

          {/* Element */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Your Element</Text>
            <View style={[styles.elementCard, { borderColor: elementData.color }]}>
              <Text style={styles.elementIcon}>{elementData.icon}</Text>
              <View>
                <Text style={[styles.elementName, { color: elementData.color }]}>
                  {element.charAt(0).toUpperCase() + element.slice(1)}
                </Text>
                <Text style={styles.elementDesc}>
                  {element === 'fire' ? 'Passionate, dynamic, temperamental' :
                   element === 'earth' ? 'Grounded, practical, reliable' :
                   element === 'air' ? 'Intellectual, social, analytical' :
                   'Intuitive, emotional, sensitive'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Settings */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <Ionicons name="planet-outline" size={22} color="#8B7FD9" />
                <Text style={styles.settingLabel}>Astrology Type</Text>
                <Text style={styles.settingValue}>{method.charAt(0).toUpperCase() + method.slice(1)}</Text>
              </View>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <Ionicons name="heart-outline" size={22} color="#8B7FD9" />
                <Text style={styles.settingLabel}>Primary Focus</Text>
                <Text style={styles.settingValue}>{intent.charAt(0).toUpperCase() + intent.slice(1)}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.settingCard} onPress={() => router.push('/features/friends')}>
              <View style={styles.settingRow}>
                <Ionicons name="people-outline" size={22} color="#8B7FD9" />
                <Text style={styles.settingLabel}>Friends</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Out */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.version}>Veya v1.6 • Made with ✨</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safeArea: { flex: 1 },
  content: { padding: 20, paddingBottom: 160 },
  header: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarEmoji: { fontSize: 48 },
  name: { fontSize: 26, fontWeight: '600', color: '#FFF' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  big3Container: { flexDirection: 'row', gap: 10 },
  big3Card: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  big3Label: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  big3Sign: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 2 },
  big3Desc: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  elementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, gap: 14, borderWidth: 1 },
  elementIcon: { fontSize: 36 },
  elementName: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  elementDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  settingCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { flex: 1, fontSize: 15, color: '#FFF' },
  settingValue: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  signOutSection: { marginTop: 20 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  signOutText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
  version: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 24 },
});
