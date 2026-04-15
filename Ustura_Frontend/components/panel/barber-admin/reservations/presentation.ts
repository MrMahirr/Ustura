import type { ReservationStatus } from '@/services/reservation.service';

import type { ReservationFilterTab } from './types';

export const reservationClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1400px] self-center gap-6',
  tableShell: 'overflow-hidden rounded-[10px] border',
  headerText: 'font-label text-[10px] uppercase tracking-[1.6px]',
  emptyTitle: 'text-center font-body text-base',
  emptyDescription: 'text-center font-body text-sm leading-5',
} as const;

export const RESERVATION_FILTER_TABS: ReservationFilterTab[] = [
  { id: 'all', label: 'Tümü', icon: 'list-alt' },
  { id: 'pending', label: 'Bekleyen', icon: 'hourglass-empty' },
  { id: 'confirmed', label: 'Onaylanan', icon: 'check-circle' },
  { id: 'completed', label: 'Tamamlanan', icon: 'done-all' },
  { id: 'cancelled', label: 'İptal', icon: 'cancel' },
  { id: 'no_show', label: 'Gelmedi', icon: 'person-off' },
];

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  no_show: 'Gelmedi',
};

export function getReservationStatusColor(
  status: ReservationStatus,
  theme: { success: string; warning: string; error: string; primary: string; onSurfaceVariant: string },
) {
  switch (status) {
    case 'pending':
      return { color: theme.warning, bg: theme.warning + '18', border: theme.warning + '30' };
    case 'confirmed':
      return { color: theme.primary, bg: theme.primary + '18', border: theme.primary + '30' };
    case 'completed':
      return { color: theme.success, bg: theme.success + '18', border: theme.success + '30' };
    case 'cancelled':
      return { color: theme.error, bg: theme.error + '18', border: theme.error + '30' };
    case 'no_show':
      return { color: theme.onSurfaceVariant, bg: theme.onSurfaceVariant + '18', border: theme.onSurfaceVariant + '30' };
  }
}

export function getReservationPanelShadow(themeMode: 'light' | 'dark') {
  if (themeMode === 'dark') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  };
}
