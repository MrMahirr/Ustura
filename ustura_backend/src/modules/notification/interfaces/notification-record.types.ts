export type NotificationTone = 'success' | 'warning' | 'error' | 'primary';

export interface NotificationRecord {
  id: string;
  recipientId: string | null;
  key: string;
  title: string;
  body: string;
  tone: NotificationTone;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationInput {
  recipientId?: string | null;
  key: string;
  title: string;
  body: string;
  tone: NotificationTone;
  metadata?: Record<string, unknown>;
}

export interface ListNotificationsFilters {
  recipientId?: string;
  key?: string;
  isRead?: boolean;
  limit: number;
  offset: number;
}
