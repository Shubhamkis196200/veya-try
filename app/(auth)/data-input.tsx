/**
 * BIRTH DATA INPUT - NATIVE DATE PICKER
 */
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../../src/stores';

export default function DataInputScreen() {
  const router = useRouter();
  const { updateProfile } = useAuthStore();
  
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const canContinue = birthDate !== null && (unknownTime || birthTime !== null);

  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  const formatDate = (date: Date): string => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  const handleContinue = async () => {
    if (!canContinue || !birthDate) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const sunSign = getZodiacSign(birthDate);
    const dateStr = birthDate.toISOString().split('T')[0];
    const timeStr = birthTime ? formatTime(birthTime) : undefined;
    
    await updateProfile({
      birth_date: dateStr,
      birth_time: unknownTime ? undefined : timeStr,
      birth_location: location || undefined,
      sun_sign: sunSign,
      zodiac_sign: sunSign,
    });
    
    router.push('/(auth)/generating');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0D0D1A']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepDotComplete}><Text style={styles.stepCheck}>✓</Text></View>
              <View style={styles.stepLineComplete} />
              <View style={styles.stepDotComplete}><Text style={styles.stepCheck}>✓</Text></View>
              <View style={styles.stepLineComplete} />
              <View style={styles.stepDotActive} />
            </View>
            <Text style={styles.step}>STEP 3 OF 3</Text>
            <Text style={styles.title}>Your birth details</Text>
            <Text style={styles.subtitle}>This helps us calculate your cosmic blueprint</Text>
          </Animated.View>

          {/* Birth Date */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.label}>📅 Birth Date</Text>
            <TouchableOpacity 
              style={styles.pickerButton} 
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pickerText, !birthDate && styles.pickerPlaceholder]}>
                {birthDate ? formatDate(birthDate) : 'Select your birth date'}
              </Text>
              <Ionicons name="calendar-outline" size={22} color="#8B7FD9" />
            </TouchableOpacity>
          </Animated.View>

          {/* Birth Time */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>🕐 Birth Time</Text>
              <TouchableOpacity style={styles.unknownToggle} onPress={() => setUnknownTime(!unknownTime)}>
                <View style={[styles.checkbox, unknownTime && styles.checkboxChecked]}>
                  {unknownTime && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </View>
                <Text style={styles.unknownText}>I don't know</Text>
              </TouchableOpacity>
            </View>
            
            {!unknownTime && (
              <TouchableOpacity 
                style={styles.pickerButton} 
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pickerText, !birthTime && styles.pickerPlaceholder]}>
                  {birthTime ? formatTime(birthTime) : 'Select your birth time'}
                </Text>
                <Ionicons name="time-outline" size={22} color="#8B7FD9" />
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Location */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.label}>📍 Birth Location (Optional)</Text>
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </Animated.View>

          {/* Zodiac Preview */}
          {birthDate && (
            <Animated.View entering={FadeIn} style={styles.preview}>
              <Text style={styles.previewLabel}>Your Sun Sign</Text>
              <Text style={styles.previewSign}>{getZodiacSign(birthDate)}</Text>
              <Text style={styles.previewDate}>{formatDate(birthDate)}</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <Modal transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Birth Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthDate || new Date(2000, 0, 1)}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <Modal transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Birth Time</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthTime || new Date()}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Continue */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={canContinue ? ['#A78BFA', '#8B5CF6'] : ['#2D2D3D', '#1D1D2D']}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.continueText}>Generate My Chart ✨</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  header: { paddingTop: 16, paddingBottom: 24 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepDotComplete: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  stepCheck: { fontSize: 12, color: '#FFF', fontWeight: 'bold' },
  stepDotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#A78BFA' },
  stepLineComplete: { width: 40, height: 1, backgroundColor: '#10B981', marginHorizontal: 8 },
  step: { fontSize: 11, color: '#A78BFA', letterSpacing: 3, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '300', color: '#FFF' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 8 },
  section: { marginBottom: 24 },
  label: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12, fontWeight: '500' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pickerButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139,127,217,0.3)',
  },
  pickerText: { color: '#FFF', fontSize: 16 },
  pickerPlaceholder: { color: 'rgba(255,255,255,0.4)' },
  unknownToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  unknownText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  locationInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, fontSize: 16, color: '#FFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  preview: { backgroundColor: 'rgba(139,127,217,0.15)', borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: 'rgba(139,127,217,0.3)' },
  previewLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  previewSign: { fontSize: 32, fontWeight: '600', color: '#A78BFA' },
  previewDate: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1A1A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  modalDone: { fontSize: 16, color: '#8B7FD9', fontWeight: '600' },
  picker: { height: 200 },
  footer: { paddingHorizontal: 24, paddingBottom: 24 },
  continueBtn: { height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.5 },
  continueText: { fontSize: 17, fontWeight: '600', color: '#FFF' },
});
