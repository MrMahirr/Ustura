import type { ReservationRecord } from '@/services/reservation.service';
import type { StaffRecord } from '@/services/staff.service';

export type BarberMetricTone = 'positive' | 'neutral' | 'attention';

export interface BarberDashboardMetric {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  tone: BarberMetricTone;
  icon: 'event-available' | 'calendar-view-week' | 'groups' | 'pending-actions';
}

export type BarberAppointmentStatus = 'approved' | 'pending' | 'cancelled';

export interface BarberAppointmentRecord {
  id: string;
  backendId: string;
  time: string;
  durationLabel: string;
  customerName: string;
  serviceLabel: string;
  serviceIcon: 'content-cut' | 'face' | 'brush';
  barberName: string;
  status: BarberAppointmentStatus;
  imageUrl: string;
  isDimmed?: boolean;
}

export type BarberStaffState = 'available' | 'busy' | 'break';

export interface BarberStaffRecord {
  id: string;
  backendId: string;
  name: string;
  title: string;
  state: BarberStaffState;
  photoUrl: string | null;
  imageUrl: string;
  nextAppointmentLabel?: string;
}

export interface BarberDashboardSnapshot {
  heroLabel: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  metrics: BarberDashboardMetric[];
  appointments: BarberAppointmentRecord[];
  staff: BarberStaffRecord[];
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isInCurrentWeek(date: Date, now: Date): boolean {
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return date >= weekStart && date < weekEnd;
}

function mapReservationStatus(
  status: ReservationRecord['status'],
): BarberAppointmentStatus {
  if (status === 'confirmed' || status === 'completed') return 'approved';
  if (status === 'cancelled' || status === 'no_show') return 'cancelled';
  return 'pending';
}

function computeDurationLabel(slotStart: string, slotEnd: string): string {
  const ms = new Date(slotEnd).getTime() - new Date(slotStart).getTime();
  const minutes = Math.round(ms / 60_000);
  return `${minutes} DK`;
}

function getServiceIcon(
  _index: number,
): 'content-cut' | 'face' | 'brush' {
  const icons: ('content-cut' | 'face' | 'brush')[] = [
    'content-cut',
    'face',
    'brush',
  ];
  return icons[_index % icons.length];
}

export function buildDashboardMetrics(
  reservations: ReservationRecord[],
  staff: StaffRecord[],
): BarberDashboardMetric[] {
  const now = new Date();

  const todayReservations = reservations.filter((r) =>
    isSameDay(new Date(r.slotStart), now),
  );
  const weekReservations = reservations.filter((r) =>
    isInCurrentWeek(new Date(r.slotStart), now),
  );
  const pendingCount = todayReservations.filter(
    (r) => r.status === 'pending',
  ).length;
  const activeStaff = staff.filter((s) => s.isActive).length;

  return [
    {
      id: 'appointments-today',
      label: 'Bugünün Randevuları',
      value: String(todayReservations.length).padStart(2, '0'),
      deltaLabel:
        todayReservations.length > 0
          ? `${todayReservations.length} randevu`
          : 'Randevu yok',
      tone: todayReservations.length > 0 ? 'positive' : 'neutral',
      icon: 'event-available',
    },
    {
      id: 'appointments-week',
      label: 'Bu Haftaki Randevular',
      value: String(weekReservations.length).padStart(2, '0'),
      deltaLabel: `${weekReservations.length} randevu`,
      tone: weekReservations.length > 0 ? 'positive' : 'neutral',
      icon: 'calendar-view-week',
    },
    {
      id: 'staff-total',
      label: 'Toplam Personel',
      value: String(activeStaff).padStart(2, '0'),
      deltaLabel: 'Aktif',
      tone: 'neutral',
      icon: 'groups',
    },
    {
      id: 'approvals',
      label: 'Bekleyen Onaylar',
      value: String(pendingCount).padStart(2, '0'),
      deltaLabel: pendingCount > 0 ? 'Acil' : 'Yok',
      tone: pendingCount > 0 ? 'attention' : 'neutral',
      icon: 'pending-actions',
    },
  ];
}

export function buildTodayAppointments(
  reservations: ReservationRecord[],
  staffLookup: Map<string, StaffRecord>,
): BarberAppointmentRecord[] {
  const now = new Date();

  return reservations
    .filter((r) => isSameDay(new Date(r.slotStart), now))
    .sort(
      (a, b) =>
        new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime(),
    )
    .map((r, index) => {
      const start = new Date(r.slotStart);
      const staff = staffLookup.get(r.staffId);
      const uiStatus = mapReservationStatus(r.status);

      return {
        id: r.id,
        backendId: r.id,
        time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        durationLabel: computeDurationLabel(r.slotStart, r.slotEnd),
        customerName: r.notes ?? 'Müşteri',
        serviceLabel: 'Randevu',
        serviceIcon: getServiceIcon(index),
        barberName: staff?.displayName ?? 'Personel',
        status: uiStatus,
        imageUrl: staff?.photoUrl ?? '',
        isDimmed: uiStatus === 'cancelled',
      };
    });
}

export function buildStaffStatus(
  staff: StaffRecord[],
  reservations: ReservationRecord[],
): BarberStaffRecord[] {
  const now = new Date();
  const currentTime = now.getTime();

  return staff
    .filter((s) => s.isActive)
    .map((s) => {
      const staffReservations = reservations
        .filter(
          (r) =>
            r.staffId === s.id &&
            isSameDay(new Date(r.slotStart), now) &&
            r.status !== 'cancelled',
        )
        .sort(
          (a, b) =>
            new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime(),
        );

      const activeNow = staffReservations.find((r) => {
        const start = new Date(r.slotStart).getTime();
        const end = new Date(r.slotEnd).getTime();
        return start <= currentTime && currentTime < end;
      });

      const nextUp = staffReservations.find(
        (r) => new Date(r.slotStart).getTime() > currentTime,
      );

      let state: BarberStaffState = 'available';
      if (activeNow) state = 'busy';

      let nextAppointmentLabel: string | undefined;
      if (nextUp) {
        const start = new Date(nextUp.slotStart);
        nextAppointmentLabel = `${pad(start.getHours())}:${pad(start.getMinutes())} - ${nextUp.notes ?? 'Müşteri'}`;
      }

      const roleTitle =
        s.role === 'barber' ? 'Berber' : 'Resepsiyonist';

      return {
        id: s.id,
        backendId: s.id,
        name: s.displayName,
        title: activeNow ? 'Meşgul' : roleTitle,
        state,
        photoUrl: s.photoUrl,
        imageUrl: s.photoUrl ?? '',
        nextAppointmentLabel,
      };
    });
}

export function buildDateLabel(): string {
  const now = new Date();
  return now
    .toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    })
    .toUpperCase();
}

export function buildDashboardSnapshot(
  userName: string,
  reservations: ReservationRecord[],
  staff: StaffRecord[],
): BarberDashboardSnapshot {
  const staffLookup = new Map<string, StaffRecord>();
  for (const s of staff) {
    staffLookup.set(s.id, s);
  }

  const firstName = userName.split(' ')[0] || userName;

  return {
    heroLabel: 'Yönetim Paneli',
    title: `Hoş Geldiniz, ${firstName}.`,
    subtitle:
      'Günlük randevu akışlarını, aktif personel durumunu ve acil operasyon sinyallerini tek panelde yönetin.',
    dateLabel: buildDateLabel(),
    metrics: buildDashboardMetrics(reservations, staff),
    appointments: buildTodayAppointments(reservations, staffLookup),
    staff: buildStaffStatus(staff, reservations),
  };
}
