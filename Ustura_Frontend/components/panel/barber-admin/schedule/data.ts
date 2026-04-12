import type {
  ReservationRecord,
  ReservationStatus,
} from '@/services/reservation.service';
import type { StaffRecord } from '@/services/staff.service';

import type {
  ScheduleAppointment,
  ScheduleAppointmentStatus,
  ScheduleDay,
  ScheduleNextUp,
  ScheduleOverview,
  ScheduleStaffMember,
} from './types';

export const SCHEDULE_START_HOUR = 9;
export const SCHEDULE_END_HOUR = 21;
export const HOUR_SLOT_HEIGHT = 100;

function mapBackendStatusToUI(
  status: ReservationStatus,
): ScheduleAppointmentStatus {
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  return 'upcoming';
}

function buildStaffLookup(
  staff: StaffRecord[],
): Map<string, StaffRecord> {
  const map = new Map<string, StaffRecord>();
  for (const s of staff) {
    map.set(s.id, s);
  }
  return map;
}

function mapReservationToAppointment(
  r: ReservationRecord,
  staffLookup: Map<string, StaffRecord>,
): ScheduleAppointment {
  const start = new Date(r.slotStart);
  const end = new Date(r.slotEnd);
  const durationMinutes = Math.round(
    (end.getTime() - start.getTime()) / 60_000,
  );

  const staffMember = staffLookup.get(r.staffId);

  return {
    id: r.id,
    backendId: r.id,
    backendStatus: r.status,
    staffId: r.staffId,
    staffName: staffMember?.displayName ?? 'Personel',
    customerName: r.notes ?? 'Müşteri',
    serviceLabel: 'Randevu',
    durationMinutes,
    startHour: start.getHours(),
    startMinute: start.getMinutes(),
    status: mapBackendStatusToUI(r.status),
  };
}

function computeOverview(appointments: ScheduleAppointment[]): ScheduleOverview {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    totalAppointments: total,
    totalDelta: `${total} randevu`,
    completed,
    completedEfficiency: `%${efficiency} verimlilik`,
    cancelled,
    cancelledNote: cancelled > 0 ? `${cancelled} iptal` : 'İptal yok',
  };
}

function computeNextUp(
  appointments: ScheduleAppointment[],
): ScheduleNextUp | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const upcoming = appointments
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => {
      const aMin = a.startHour * 60 + a.startMinute;
      const bMin = b.startHour * 60 + b.startMinute;
      return aMin - bMin;
    })
    .find((a) => {
      const startMin = a.startHour * 60 + a.startMinute;
      return startMin >= currentMinutes;
    });

  if (!upcoming) return null;

  const upcomingMinutes = upcoming.startHour * 60 + upcoming.startMinute;
  const minutesUntil = upcomingMinutes - currentMinutes;
  const time = `${String(upcoming.startHour).padStart(2, '0')}:${String(upcoming.startMinute).padStart(2, '0')}`;

  return {
    time,
    label: upcoming.serviceLabel,
    minutesUntil: Math.max(0, minutesUntil),
  };
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function mapStaffToScheduleMembers(
  staff: StaffRecord[],
): ScheduleStaffMember[] {
  return staff
    .filter((s) => s.isActive)
    .map((s) => ({
      id: s.id,
      displayName: s.displayName,
      role: s.role,
      photoUrl: s.photoUrl,
    }));
}

export function mapReservationsToScheduleDay(
  reservations: ReservationRecord[],
  targetDate: Date,
  staff: StaffRecord[],
  selectedStaffId: string | null,
): ScheduleDay {
  const staffLookup = buildStaffLookup(staff);

  const dayReservations = reservations.filter((r) =>
    isSameDay(new Date(r.slotStart), targetDate),
  );

  const filtered = selectedStaffId
    ? dayReservations.filter((r) => r.staffId === selectedStaffId)
    : dayReservations;

  const appointments = filtered.map((r) =>
    mapReservationToAppointment(r, staffLookup),
  );
  const overview = computeOverview(appointments);
  const nextUp = computeNextUp(appointments);

  const label = targetDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  return {
    date: targetDate,
    label,
    appointments,
    overview,
    nextUp,
  };
}
