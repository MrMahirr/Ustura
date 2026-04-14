import React from 'react';
import {
  NotificationService,
  type NotificationRecord,
  type NotificationListResponse,
} from '@/services/notification.service';
import type { NotificationFilterKey, NotificationOverview } from './types';

const EMPTY_RESPONSE: NotificationListResponse = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  unreadTotal: 0,
};

export function useNotificationManagement() {
  const [query, setQuery] = React.useState('');
  const [toneFilter, setToneFilter] = React.useState<NotificationFilterKey>('all');
  const [readFilter, setReadFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);

  const [data, setData] = React.useState<NotificationListResponse>(EMPTY_RESPONSE);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = React.useState(false);
  const markAllInFlightRef = React.useRef(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(
    async (options?: { showLoading?: boolean }) => {
      const showLoading = options?.showLoading !== false;
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const isRead =
          readFilter === 'unread' ? false : readFilter === 'read' ? true : undefined;
        const key = toneFilter === 'all' ? undefined : undefined;

        const response = await NotificationService.list({
          page,
          pageSize,
          isRead,
          key,
        });

        setData(response);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Bildirimler yuklenemedi.';
        setError(message);
        setData(EMPTY_RESPONSE);
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [page, pageSize, readFilter, toneFilter],
  );

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredItems = React.useMemo(() => {
    let items = data.items;

    if (toneFilter !== 'all') {
      items = items.filter((item) => item.tone === toneFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q),
      );
    }

    return items;
  }, [data.items, toneFilter, query]);

  const overview: NotificationOverview = React.useMemo(() => {
    const all = data.items;
    const unreadFromPage = all.filter((n) => !n.isRead).length;
    return {
      total: data.total,
      unread: data.unreadTotal ?? unreadFromPage,
      critical: all.filter((n) => n.tone === 'error').length,
      today: all.filter((n) => {
        const created = new Date(n.createdAt);
        const now = new Date();
        return created.toDateString() === now.toDateString();
      }).length,
    };
  }, [data]);

  const handleMarkAsRead = React.useCallback(
    async (id: string) => {
      try {
        await NotificationService.markAsRead(id);
        setData((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
        }));
      } catch {
        // best-effort
      }
    },
    [],
  );

  const handleMarkAllAsRead = React.useCallback(async () => {
    if (markAllInFlightRef.current) return;
    markAllInFlightRef.current = true;
    setIsMarkingAllRead(true);
    try {
      await NotificationService.markAllAsRead();
      setData((prev) => ({
        ...prev,
        items: prev.items.map((item) => ({ ...item, isRead: true })),
      }));
      await fetchNotifications({ showLoading: false });
    } catch {
      // best-effort
    } finally {
      markAllInFlightRef.current = false;
      setIsMarkingAllRead(false);
    }
  }, [fetchNotifications]);

  const resetFilters = React.useCallback(() => {
    setToneFilter('all');
    setReadFilter('all');
    setQuery('');
    setPage(1);
  }, []);

  return {
    query,
    setQuery,
    toneFilter,
    setToneFilter,
    readFilter,
    setReadFilter,
    page,
    setPage,
    totalPages: data.totalPages,
    notifications: filteredItems,
    overview,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    isMarkingAllRead,
    resetFilters,
    refresh: fetchNotifications,
  };
}
