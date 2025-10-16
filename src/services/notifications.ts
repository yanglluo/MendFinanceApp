
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6EE7B7',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  async scheduleNudge(title: string, body: string, triggerSeconds: number = 5): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'nudge' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: triggerSeconds,
      },
    });

    return id;
  }

  async scheduleBudgetWarning(percentUsed: number, categoryName?: string): Promise<void> {
    const title = categoryName 
      ? `${categoryName} Budget Alert`
      : 'Budget Alert';
    
    const body = percentUsed >= 90
      ? `You've used ${percentUsed.toFixed(0)}% of your budget. Time to slow down? 💛`
      : `You're at ${percentUsed.toFixed(0)}% of your budget. Still on track! 💚`;

    await this.scheduleNudge(title, body, 1);
  }

  async scheduleDailySummary(hour: number = 19): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Mendi's Daily Check-in",
        body: "Let's see how your day went! 🌟",
        data: { type: 'daily_summary' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  }
}

export default new NotificationService();
