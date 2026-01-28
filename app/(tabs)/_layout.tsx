import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20);
  
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBar, { height: 60 + bottomPadding, paddingBottom: bottomPadding }],
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarHideOnKeyboard: true,
          tabBarBackground: () => (
            <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,10,20,0.9)' }]} />
          ),
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={24} color={color} accessibilityLabel="Today's reading" /> }} />
        <Tabs.Screen name="forecast" options={{ title: 'Forecast', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} accessibilityLabel="Weekly forecast" /> }} />
        <Tabs.Screen name="chat" options={{ title: 'Ask', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} color={color} accessibilityLabel="Ask the stars" /> }} />
        <Tabs.Screen name="shop" options={{ title: 'Gems', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'diamond' : 'diamond-outline'} size={24} color={color} accessibilityLabel="Gems shop" /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} accessibilityLabel="Your profile" /> }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabBar: { backgroundColor: 'transparent', borderTopWidth: 0, paddingTop: 8, position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 0 },
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
});
