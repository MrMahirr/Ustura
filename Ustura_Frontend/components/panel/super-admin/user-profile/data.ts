import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import type {
  AdminUserActivityResponse,
  AdminUserDetailResponse,
  AdminUserReservationResponse,
  AdminUserStatsResponse,
  AdminUserWorkingDayResponse,
} from '@/services/user.service';

export interface UserProfileMetric {
  id: string;
  label: string;
  value: string;
  note: string;
  accentLabel?: string;
  accentTone?: 'positive' | 'neutral';
  kind: 'progress' | 'rating' | 'summary';
  progress?: number;
}

export interface UserProfileScheduleItem {
  id: string;
  label: string;
  hoursLabel: string;
  tone: 'primary' | 'error' | 'muted';
}

export interface UserProfileAppointment {
  id: string;
  customerName: string;
  serviceName: string;
  dateTimeLabel: string;
  statusLabel: string;
  statusTone: 'primary' | 'success';
}

export interface UserProfileEarningsPoint {
  id: string;
  monthLabel: string;
  revenueLevel: number;
  averageLevel: number;
}

export interface UserProfileActivity {
  id: string;
  title: string;
  detail: string;
  highlighted?: boolean;
  subdued?: boolean;
}

export interface UserProfileQuickAction {
  id: string;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}

export interface UserProfile {
  user: UserRecord;
  phoneNumber: string;
  assignedSalonLabel: string;
  locationLabel: string;
  metrics: UserProfileMetric[];
  weeklySchedule: UserProfileScheduleItem[];
  recentAppointments: UserProfileAppointment[];
  earningsSeries: UserProfileEarningsPoint[];
  expertise: string[];
  activities: UserProfileActivity[];
  quickActions: UserProfileQuickAction[];
}

function formatTurkishDate(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    if (isToday) return `Bugun, ${time}`;
    if (isYesterday) return `Dun, ${time}`;

    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} gun once, ${time}`;

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${time}`;
  } catch {
    return iso;
  }
}

function mapReservationStatus(status: string): { label: string; tone: 'primary' | 'success' } {
  switch (status) {
    case 'completed':
      return { label: 'Tamamlandi', tone: 'success' };
    case 'confirmed':
      return { label: 'Onaylandi', tone: 'success' };
    case 'pending':
      return { label: 'Bekliyor', tone: 'primary' };
    case 'cancelled':
      return { label: 'Iptal', tone: 'primary' };
    case 'no_show':
      return { label: 'Gelmedi', tone: 'primary' };
    default:
      return { label: status, tone: 'primary' };
  }
}

function mapAuditActionTitle(action: string): string {
  switch (action) {
    case 'auth.logged_in':
      return 'Sisteme giris yapildi';
    case 'auth.logged_out':
      return 'Oturum kapatildi';
    case 'auth.registered':
      return 'Hesap olusturuldu';
    case 'auth.refreshed':
      return 'Oturum yenilendi';
    case 'staff.created':
      return 'Personel olarak atandi';
    case 'staff.updated':
      return 'Personel bilgileri guncellendi';
    case 'staff.deactivated':
      return 'Personel devre disi';
    case 'reservation.created':
      return 'Randevu olusturuldu';
    case 'reservation.cancelled':
      return 'Randevu iptal edildi';
    case 'reservation.status_updated':
      return 'Randevu durumu guncellendi';
    default:
      return action.replace(/\./g, ' ');
  }
}

function formatCompactCurrency(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} Bin TL`;
  }
  return `${value} TL`;
}

function buildMetrics(stats: AdminUserStatsResponse): UserProfileMetric[] {
  const completionRate =
    stats.totalReservations > 0
      ? Math.round((stats.completedReservations / stats.totalReservations) * 100)
      : 0;

  return [
    {
      id: 'appointments',
      label: 'Toplam Randevu',
      value: new Intl.NumberFormat('tr-TR').format(stats.totalReservations),
      note: 'Tum zamanlar',
      accentLabel: stats.last30DaysReservations > 0 ? `+${stats.last30DaysReservations}` : undefined,
      accentTone: 'positive',
      kind: 'progress',
      progress: completionRate,
    },
    {
      id: 'completed',
      label: 'Tamamlanan',
      value: new Intl.NumberFormat('tr-TR').format(stats.completedReservations),
      note: `%${completionRate} tamamlanma orani`,
      kind: 'summary',
    },
    {
      id: 'last30',
      label: 'Son 30 Gun',
      value: new Intl.NumberFormat('tr-TR').format(stats.last30DaysReservations),
      note: `Gunluk ort. ${stats.averagePerDay.toFixed(1)}`,
      accentLabel: 'Canli',
      accentTone: 'positive',
      kind: 'summary',
    },
    {
      id: 'cancelled',
      label: 'Iptal Edilen',
      value: new Intl.NumberFormat('tr-TR').format(stats.cancelledReservations),
      note: stats.totalReservations > 0
        ? `%${Math.round((stats.cancelledReservations / stats.totalReservations) * 100)} iptal orani`
        : 'Veri yok',
      kind: 'summary',
    },
  ];
}

function buildSchedule(workingHours: AdminUserWorkingDayResponse[]): UserProfileScheduleItem[] {
  if (workingHours.length === 0) {
    return [
      { id: 'no-schedule', label: 'Calisma saati bilgisi yok', hoursLabel: '-', tone: 'muted' },
    ];
  }

  return workingHours.map((wh) => ({
    id: wh.day.toLowerCase(),
    label: wh.day,
    hoursLabel: wh.open && wh.close ? `${wh.open} - ${wh.close}` : 'Kapali',
    tone: (wh.open && wh.close ? 'primary' : 'error') as 'primary' | 'error',
  }));
}

function buildAppointments(reservations: AdminUserReservationResponse[]): UserProfileAppointment[] {
  if (reservations.length === 0) {
    return [];
  }

  return reservations.map((r) => {
    const statusInfo = mapReservationStatus(r.status);
    return {
      id: r.id,
      customerName: r.customerName,
      serviceName: r.notes?.trim() || 'Randevu',
      dateTimeLabel: formatTurkishDate(r.slotStart),
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
    };
  });
}

function buildEarningsSeries(): UserProfileEarningsPoint[] {
  return [];
}

function buildExpertise(user: UserRecord): string[] {
  const expertise = [...user.specialties];
  if (expertise.length === 0) {
    if (user.role === 'Yonetici') {
      expertise.push('Operasyon', 'Platform Yonetimi');
    } else if (user.role === 'Sahip') {
      expertise.push('Salon Yonetimi', user.city);
    } else {
      expertise.push('Sac Kesimi', 'Bakim');
    }
  }
  return expertise;
}

function buildActivities(entries: AdminUserActivityResponse[]): UserProfileActivity[] {
  if (entries.length === 0) {
    return [
      { id: 'no-activity', title: 'Henuz aktivite yok', detail: 'Bu kullanici icin kayitli islem bulunamadi.' },
    ];
  }

  return entries.map((entry, index) => ({
    id: entry.id,
    title: mapAuditActionTitle(entry.action),
    detail: entry.detail
      ? `${entry.detail} - ${formatTurkishDate(entry.createdAt)}`
      : formatTurkishDate(entry.createdAt),
    highlighted: index === 0,
    subdued: entry.action.startsWith('auth.'),
  }));
}

function buildQuickActions(): UserProfileQuickAction[] {
  return [
    { id: 'reassign', label: 'Baska Salona Ata', icon: 'arrow-forward' },
    { id: 'reset-password', label: 'Sifre Sifirla', icon: 'lock-reset' },
    { id: 'change-role', label: 'Rol Degistir', icon: 'manage-accounts' },
  ];
}

function extractDistrict(location: string) {
  const [, district] = location.split(',');
  return district?.trim() ?? location;
}

export function buildUserProfile(
  user: UserRecord,
  detail: AdminUserDetailResponse,
): UserProfile {
  const district = extractDistrict(user.salonLocation);

  return {
    user,
    phoneNumber: detail.user.phone || '-',
    assignedSalonLabel: `${user.salonName} - ${district}`,
    locationLabel: user.city,
    metrics: buildMetrics(detail.stats),
    weeklySchedule: buildSchedule(detail.workingHours),
    recentAppointments: buildAppointments(detail.recentReservations),
    earningsSeries: buildEarningsSeries(),
    expertise: buildExpertise(user),
    activities: buildActivities(detail.recentActivity),
    quickActions: buildQuickActions(),
  };
}
