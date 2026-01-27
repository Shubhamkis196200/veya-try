import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20);
  
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBar, { height: 60 + bottomPadding, paddingBottom: bottomPadding }],
          tabBarActiveTintColor: '#8B7FD9',
          tabBarInactiveTintColor: '#666680',
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarHideOnKeyboard: true,
          tabBarBackground: () => (
            <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,10,20,0.9)' }]} />
          ),
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={24} color={color} /> }} />
        <Tabs.Screen name="forecast" options={{ title: 'Forecast', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} /> }} />
        <Tabs.Screen name="chat" options={{ title: 'Ask', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} color={color} /> }} />
        <Tabs.Screen name="shop" options={{ title: 'Gems', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'diamond' : 'diamond-outline'} size={24} color={color} /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} /> }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  tabBar: { backgroundColor: 'transparent', borderTopWidth: 0, paddingTop: 8, position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 0 },
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
});
