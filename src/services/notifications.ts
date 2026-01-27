/**
 * PUSH NOTIFICATIONS SERVICE
 * Daily reminders, transit alerts, engagement hooks
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationPreferences {
  dailyReading: boolean;
  dailyReadingTime: string; // "09:00"
  transitAlerts: boolean;
  moonPhases: boolean;
  weeklyForecast: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  dailyReading: true,
  dailyReadingTime: '09:00',
  transitAlerts: true,
  moonPhases: true,
  weeklyForecast: true,
};

const PREFS_KEY = 'notification_prefs';

// Notification content templates
const DAILY_MESSAGES = [
  { title: "✨ Your cosmic guidance awaits", body: "The stars have aligned with a message just for you today." },
  { title: "🌟 Good morning, stargazer", body: "Your daily reading is ready. What will the universe reveal?" },
  { title: "🔮 The cosmos are calling", body: "Check in with your celestial forecast for today." },
  { title: "💫 New day, new energy", body: "Discover what cosmic forces are at play in your life today." },
  { title: "🌙 Rise and shine", body: "Your personalized astrology update is waiting." },
];

const TRANSIT_MESSAGES = {
  mercury_retrograde: {
    title: "⚠️ Mercury Retrograde begins",
    body: "Time to double-check communications and back up your data!",
  },
  full_moon: {
    title: "🌕 Full Moon tonight",
    body: "Emotions run high. Perfect time for release and reflection.",
  },
  new_moon: {
    title: "🌑 New Moon energy",
    body: "Set your intentions. The universe is listening.",
  },
  venus_transit: {
    title: "💕 Venus is active",
    body: "Love and beauty are highlighted. Open your heart.",
  },
};

class NotificationService {
  private token: string | null = null;
  private prefs: NotificationPreferences = DEFAULT_PREFS;
  
  // Initialize notifications
  async initialize(): Promise<string | null> {
    // Load preferences
    const stored = await AsyncStorage.getItem(PREFS_KEY);
    if (stored) {
      this.prefs = { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    }
    
    // Request permissions
    if (!Device.isDevice) {
      console.log('Notifications require physical device');
      return null;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return null;
    }
    
    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with actual project ID
    });
    this.token = tokenData.data;
    
    // Set up Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Daily Readings',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#A855F7',
      });
      
      await Notifications.setNotificationChannelAsync('alerts', {
        name: 'Transit Alerts',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    
    // Schedule daily notification
    if (this.prefs.dailyReading) {
      await this.scheduleDailyReading();
    }
    
    return this.token;
  }
  
  // Schedule daily reading notification
  async scheduleDailyReading(): Promise<void> {
    // Cancel existing daily notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const [hours, minutes] = this.prefs.dailyReadingTime.split(':').map(Number);
    const message = DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: { type: 'daily_reading' },
        sound: true,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }
  
  // Send transit alert
  async sendTransitAlert(transitType: keyof typeof TRANSIT_MESSAGES): Promise<void> {
    if (!this.prefs.transitAlerts) return;
    
    const message = TRANSIT_MESSAGES[transitType];
    if (!message) return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: { type: 'transit_alert', transit: transitType },
        sound: true,
      },
      trigger: null, // Send immediately
    });
  }
  
  // Schedule moon phase notification
  async scheduleMoonPhaseAlert(phase: 'full' | 'new', date: Date): Promise<void> {
    if (!this.prefs.moonPhases) return;
    
    const message = phase === 'full' ? TRANSIT_MESSAGES.full_moon : TRANSIT_MESSAGES.new_moon;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: { type: 'moon_phase', phase },
        sound: true,
      },
      trigger: {
        date,
      },
    });
  }
  
  // Update preferences
  async updatePreferences(updates: Partial<NotificationPreferences>): Promise<void> {
    this.prefs = { ...this.prefs, ...updates };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
    
    if (updates.dailyReading !== undefined || updates.dailyReadingTime !== undefined) {
      if (this.prefs.dailyReading) {
        await this.scheduleDailyReading();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }
  }
  
  // Get current preferences
  getPreferences(): NotificationPreferences {
    return { ...this.prefs };
  }
  
  // Listen for notifications
  addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }
  
  // Listen for notification responses (taps)
  addResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
