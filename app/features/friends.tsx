/**
 * FRIENDS FEATURE - SIMPLIFIED
 */
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A12', '#12122A', '#0A0A12']} style={StyleSheet.absoluteFill} />
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>👥 Friends</Text>
        <Text style={styles.subtitle}>Coming soon!</Text>
        <Text style={styles.text}>Connect with friends and compare charts.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 20, color: '#A78BFA', marginBottom: 16 },
  text: { fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
});
