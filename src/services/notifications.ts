import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Register for push notifications
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  // Get Expo push token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'bc189d9b-4f4f-403a-90dc-256ba92e24b5', // Veya project ID
  });

  // Configure for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Veya Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#9B8FD9',
    });
  }

  return token.data;
}

// Save push token to database
export async function savePushToken(userId: string, token: string) {
  try {
    await supabase
      .from('profiles')
      .update({ push_token: token })
      .eq('id', userId);
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

// Schedule daily horoscope notification
export async function scheduleDailyHoroscope(hour: number = 8, minute: number = 0) {
  // Cancel existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule daily notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✨ Your Daily Horoscope',
      body: 'The stars have aligned! Tap to see what the cosmos has in store for you today.',
      data: { type: 'daily_horoscope' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  console.log(`Daily horoscope scheduled for ${hour}:${minute}`);
}

// Schedule moon phase notification
export async function scheduleMoonPhaseAlert() {
  // This would ideally check moon phase and schedule accordingly
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌕 Full Moon Tonight',
      body: 'The full moon brings powerful energy for release and manifestation.',
      data: { type: 'moon_phase' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24 * 14, // ~2 weeks for demo
    },
  });
}

// Send immediate notification (for testing)
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔮 Veya Says Hello',
      body: 'Your cosmic connection is active! Notifications are working.',
      data: { type: 'test' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

// Listen for notification responses
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Listen for incoming notifications
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Get all scheduled notifications
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export default {
  registerForPushNotifications,
  savePushToken,
  scheduleDailyHoroscope,
  scheduleMoonPhaseAlert,
  sendTestNotification,
  addNotificationResponseListener,
  addNotificationReceivedListener,
  getScheduledNotifications,
  cancelAllNotifications,
};
