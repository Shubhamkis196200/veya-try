/**
 * FORECAST SCREEN - ULTRA SIMPLE
 * Weekly forecast without complex dependencies
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOODS = ['✨', '🌙', '🔥', '💫', '⭐', '🌸', '🌟'];

const FORECASTS = [
  { energy: 78, highlight: 'Great for new beginnings' },
  { energy: 65, highlight: 'Rest and reflect' },
  { energy: 82, highlight: 'High creativity day' },
  { energy: 70, highlight: 'Focus on relationships' },
  { energy: 88, highlight: 'Career opportunities' },
  { energy: 75, highlight: 'Self-care priority' },
  { energy: 80, highlight: 'Spiritual growth' },
];

export default function ForecastScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const today = new Date();
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📅</Text>
          <View>
            <Text style={styles.headerTitle}>Weekly Forecast</Text>
            <Text style={styles.headerSub}>Your cosmic calendar</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Week Days */}
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => (
              <TouchableOpacity 
                key={day} 
                style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[styles.dayText, selectedDay === i && styles.dayTextActive]}>{day}</Text>
                <Text style={styles.dayMood}>{MOODS[i]}</Text>
                <Text style={[styles.dayNum, selectedDay === i && styles.dayNumActive]}>
                  {today.getDate() + i}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected Day Details */}
          <View style={styles.detailCard}>
            <Text style={styles.detailMood}>{MOODS[selectedDay]}</Text>
            <Text style={styles.detailDay}>{DAYS[selectedDay]}</Text>
            <Text style={styles.detailHighlight}>{FORECASTS[selectedDay].highlight}</Text>
            
            {/* Energy Bar */}
            <View style={styles.energySection}>
              <Text style={styles.energyLabel}>Energy Level</Text>
              <View style={styles.energyBar}>
                <View style={[styles.energyFill, { width: `${FORECASTS[selectedDay].energy}%` }]} />
              </View>
              <Text style={styles.energyValue}>{FORECASTS[selectedDay].energy}%</Text>
            </View>
          </View>

          {/* Monthly Overview */}
          <View style={styles.monthCard}>
            <Text style={styles.monthTitle}>🌙 This Month</Text>
            <Text style={styles.monthTheme}>Transformation & Growth</Text>
            <Text style={styles.monthText}>
              The stars align for major life decisions and spiritual breakthroughs. 
              Trust your intuition and embrace change.
            </Text>
          </View>

          {/* Key Dates */}
          <View style={styles.datesCard}>
            <Text style={styles.datesTitle}>✨ Key Dates</Text>
            <View style={styles.dateItem}>
              <Ionicons name="moon" size={20} color="#A78BFA" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateEvent}>New Moon in Aquarius</Text>
                <Text style={styles.dateWhen}>Feb 4</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="heart" size={20} color="#F472B6" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateEvent}>Venus enters Aries</Text>
                <Text style={styles.dateWhen}>Feb 14</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="moon" size={20} color="#FBBF24" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateEvent}>Full Moon in Virgo</Text>
                <Text style={styles.dateWhen}>Feb 20</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  headerIcon: { fontSize: 28 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  scroll: { flex: 1 },
  weekRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 20 },
  dayBtn: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 12 },
  dayBtnActive: { backgroundColor: 'rgba(139,92,246,0.2)' },
  dayText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  dayTextActive: { color: '#A78BFA' },
  dayMood: { fontSize: 20, marginBottom: 4 },
  dayNum: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  dayNumActive: { color: '#FFF', fontWeight: '700' },
  detailCard: { backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 16, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  detailMood: { fontSize: 48, marginBottom: 8 },
  detailDay: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  detailHighlight: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  energySection: { width: '100%', marginTop: 20 },
  energyLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  energyBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  energyFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  energyValue: { fontSize: 14, color: '#A78BFA', marginTop: 8, textAlign: 'right' },
  monthCard: { backgroundColor: 'rgba(139,92,246,0.1)', marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 20 },
  monthTitle: { fontSize: 16, color: '#A78BFA', marginBottom: 8 },
  monthTheme: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  monthText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  datesCard: { backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 16, borderRadius: 16, padding: 20 },
  datesTitle: { fontSize: 16, color: '#FFF', fontWeight: '600', marginBottom: 16 },
  dateItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dateInfo: { flex: 1 },
  dateEvent: { fontSize: 15, color: '#FFF' },
  dateWhen: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
});
