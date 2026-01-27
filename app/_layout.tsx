import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { COLORS } from '../src/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="features/compatibility" options={{ presentation: 'modal' }} />
          <Stack.Screen name="features/affirmations" options={{ presentation: 'modal' }} />
          <Stack.Screen name="features/journal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="features/moon" options={{ presentation: 'modal' }} />
          <Stack.Screen name="features/tarot" options={{ presentation: 'modal' }} />
          <Stack.Screen name="features/friends" options={{ presentation: 'modal' }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
