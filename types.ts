
export interface Activity {
  id: number;
  text: string;
  time: string; // Stored in "HH:mm" format
  notified: boolean;
}

export type NotificationPermission = 'default' | 'granted' | 'denied';
