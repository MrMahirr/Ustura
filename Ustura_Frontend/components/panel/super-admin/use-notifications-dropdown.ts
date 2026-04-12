import { useCallback, useEffect, useRef, useState } from 'react';

import {
  NotificationService,
  type NotificationRecord,
} from '@/services/notification.service';

const DROPDOWN_PAGE_SIZE = 8;
const POLL_INTERVAL_MS = 60_000;

export interface NotificationsDropdownStats {
  unread: number;
  critical: number;
  today: number;
}

export interface NotificationsDropdownState {
  items: NotificationRecord[];
  stats: NotificationsDropdownStats;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'simdi';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'simdi';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk once`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat once`;

  const days = Math.floor(hours / 24);
  return `${days} gun once`;
}

function deriveStats(items: NotificationRecord[]): NotificationsDropdownStats {
  let unread = 0;
  let critical = 0;
  let today = 0;

  for (const item of items) {
    if (!item.isRead) unread++;
    if (item.tone === 'error') critical++;
    if (isToday(item.createdAt)) today++;
  }

  return { unread, critical, today };
}

export function useNotificationsDropdown(
  isOpen: boolean,
): NotificationsDropdownState {
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await NotificationService.list({
        page: 1,
        pageSize: DROPDOWN_PAGE_SIZE,
      });
      setItems(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bildirimler yuklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (isOpen) {
      refresh();

      pollRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isOpen, refresh]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await NotificationService.markAsRead(id);
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      } catch {
        await refresh();
      }
    },
    [refresh],
  );

  const stats = deriveStats(items);

  return { items, stats, loading, error, refresh, markAsRead };
}
