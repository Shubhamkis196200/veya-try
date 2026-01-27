import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={22} color={color} />
                {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="forecast"
          options={{
            title: 'Forecast',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
                {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Ask',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={22} color={color} />
                {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Gems',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'diamond' : 'diamond-outline'} size={22} color={color} />
                {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
                {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLORS.backgroundCard,
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    height: Platform.OS === 'ios' ? 88 : 68,
    elevation: 0,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  iconWrap: {
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
