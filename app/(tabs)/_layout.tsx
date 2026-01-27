import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { COLORS, SPACING, ANIMATION, RADIUS } from '../../src/constants/theme';

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
          tabBarHideOnKeyboard: true,
          tabBarBackground: () => (
            <BlurView 
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, focused }) => (
              <Animated.View 
                style={styles.iconWrap}
                entering={FadeIn.duration(ANIMATION.fast)}
              >
                <Ionicons 
                  name={focused ? 'sunny' : 'sunny-outline'} 
                  size={24} 
                  color={color} 
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="forecast"
          options={{
            title: 'Forecast',
            tabBarIcon: ({ color, focused }) => (
              <Animated.View 
                style={styles.iconWrap}
                entering={FadeIn.duration(ANIMATION.fast)}
              >
                <Ionicons 
                  name={focused ? 'calendar' : 'calendar-outline'} 
                  size={24} 
                  color={color} 
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Ask',
            tabBarIcon: ({ color, focused }) => (
              <Animated.View 
                style={styles.iconWrap}
                entering={FadeIn.duration(ANIMATION.fast)}
              >
                <Ionicons 
                  name={focused ? 'chatbubble' : 'chatbubble-outline'} 
                  size={24} 
                  color={color} 
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Gems',
            tabBarIcon: ({ color, focused }) => (
              <Animated.View 
                style={styles.iconWrap}
                entering={FadeIn.duration(ANIMATION.fast)}
              >
                <Ionicons 
                  name={focused ? 'diamond' : 'diamond-outline'} 
                  size={24} 
                  color={color} 
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Animated.View 
                style={styles.iconWrap}
                entering={FadeIn.duration(ANIMATION.fast)}
              >
                <Ionicons 
                  name={focused ? 'person' : 'person-outline'} 
                  size={24} 
                  color={color} 
                />
              </Animated.View>
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
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 32 : SPACING.md,
    height: Platform.OS === 'ios' ? 90 : 70,
    elevation: 0,
    position: 'absolute',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
});
