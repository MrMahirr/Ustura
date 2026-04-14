import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

import type { ReservationStatus } from '@/services/reservation.service';

export type ReservationFilterStatus = ReservationStatus | 'all';

export interface ReservationFilterTab {
  id: ReservationFilterStatus;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}

export interface ReservationListItem {
  id: string;
  customerName: string;
  staffName: string;
  staffId: string;
  date: string;
  time: string;
  endTime: string;
  durationMinutes: number;
  status: ReservationStatus;
  statusLabel: string;
  notes: string | null;
  createdAtLabel: string;
}

export interface ReservationOverview {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}
