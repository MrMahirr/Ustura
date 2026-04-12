import type { ReservationStatus } from '@/services/reservation.service';

export type ScheduleAppointmentStatus = 'completed' | 'upcoming' | 'cancelled';

export type ScheduleViewMode = 'day' | 'week';

export interface ScheduleStaffMember {
  id: string;
  displayName: string;
  role: 'barber' | 'receptionist';
  photoUrl: string | null;
}

export interface ScheduleAppointment {
  id: string;
  backendId: string;
  backendStatus: ReservationStatus;
  staffId: string;
  staffName: string;
  customerName: string;
  serviceLabel: string;
  durationMinutes: number;
  startHour: number;
  startMinute: number;
  status: ScheduleAppointmentStatus;
  imageUrl?: string;
}

export interface ScheduleOverview {
  totalAppointments: number;
  totalDelta: string;
  completed: number;
  completedEfficiency: string;
  cancelled: number;
  cancelledNote: string;
}

export interface ScheduleNextUp {
  time: string;
  label: string;
  minutesUntil: number;
}

export interface ScheduleDay {
  date: Date;
  label: string;
  appointments: ScheduleAppointment[];
  overview: ScheduleOverview;
  nextUp: ScheduleNextUp | null;
}

export interface ScheduleWeekDay {
  date: Date;
  dayLabel: string;
  dateLabel: string;
  isToday: boolean;
  appointments: ScheduleAppointment[];
}

export interface ScheduleWeek {
  days: ScheduleWeekDay[];
  overview: ScheduleOverview;
  nextUp: ScheduleNextUp | null;
}
