/**
 * PUSH NOTIFICATIONS SERVICE
 * Simplified version for compatibility
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationPreferences {
  dailyReading: boolean;
  dailyReadingTime: string;
  transitAlerts: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  dailyReading: true,
  dailyReadingTime: '09:00',
  transitAlerts: true,
};

const PREFS_KEY = 'notification_prefs';

class NotificationService {
  private prefs: NotificationPreferences = DEFAULT_PREFS;
  
  async initialize(): Promise<string | null> {
    const stored = await AsyncStorage.getItem(PREFS_KEY);
    if (stored) {
      this.prefs = { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    }
    
    if (!Device.isDevice) {
      console.log('Notifications require physical device');
      return null;
    }
    
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Daily Readings',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    
    return 'initialized';
  }
  
  async scheduleDailyReading(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const [hours, minutes] = this.prefs.dailyReadingTime.split(':').map(Number);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Your cosmic guidance awaits',
        body: 'The stars have aligned with a message just for you today.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  }
  
  async sendLocalNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  }
  
  async updatePreferences(updates: Partial<NotificationPreferences>): Promise<void> {
    this.prefs = { ...this.prefs, ...updates };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
  }
  
  getPreferences(): NotificationPreferences {
    return { ...this.prefs };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
