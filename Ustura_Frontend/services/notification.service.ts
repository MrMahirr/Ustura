import { apiRequest } from './api';

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
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListNotificationsQuery {
  recipientId?: string;
  key?: string;
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}

export class NotificationService {
  static async list(
    query: ListNotificationsQuery = {},
  ): Promise<NotificationListResponse> {
    return apiRequest<NotificationListResponse>({
      path: '/admin/notifications',
      method: 'GET',
      query: {
        ...query,
        isRead: query.isRead === undefined ? undefined : String(query.isRead),
      },
      auth: true,
    });
  }

  static async markAsRead(id: string): Promise<NotificationRecord> {
    return apiRequest<NotificationRecord>({
      path: `/admin/notifications/${id}/read`,
      method: 'PATCH',
      auth: true,
    });
  }

  static async markAllAsRead(): Promise<{ markedCount: number }> {
    return apiRequest<{ markedCount: number }>({
      path: '/admin/notifications/read-all',
      method: 'POST',
      auth: true,
    });
  }
}
