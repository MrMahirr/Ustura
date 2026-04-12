import type { NotificationRecord, NotificationTone } from '@/services/notification.service';

export type NotificationFilterKey = 'all' | NotificationTone;

export interface NotificationOverview {
  total: number;
  unread: number;
  critical: number;
  today: number;
}

export interface NotificationTheme {
  theme: 'light' | 'dark';
  primary: string;
  onSurface: string;
  onSurfaceVariant: string;
  onPrimary: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  cardBackground: string;
  cardBackgroundMuted: string;
  cardBackgroundStrong: string;
  borderSubtle: string;
}

export type { NotificationRecord, NotificationTone };
