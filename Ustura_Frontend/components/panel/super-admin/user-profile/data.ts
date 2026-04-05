import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { salonRecords } from '@/components/panel/super-admin/salon-management.data';
import { userRecords, type UserRecord } from '@/components/panel/super-admin/user-management.data';

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

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const customerNames = ['Caner Yildiz', 'Arda Turan', 'Murat Ozdemir', 'Baris Koc', 'Eren Kaya'];
const expertisePool = ['Cilt Bakimi', 'Modern Fade', 'Hot Towel Shave', 'Styling', 'Klasik Kesim', 'Bakim'];

function hashValue(input: string) {
  return input.split('').reduce((total, char, index) => total + char.charCodeAt(0) * (index + 5), 0);
}

function formatCompactCurrency(value: number) {
  return `TRY ${(value / 1000).toFixed(1)}K`;
}

function buildPhoneNumber(hash: number) {
  const chunk = String(1000 + (hash % 9000));
  const middle = String(100 + (Math.floor(hash / 10) % 900));
  return `+90 (5${20 + (hash % 70)}) ${middle} ${chunk.slice(0, 2)} ${chunk.slice(2)}`;
}

function extractDistrict(location: string) {
  const [, district] = location.split(',');
  return district?.trim() ?? location;
}

function createMetrics(user: UserRecord, hash: number): UserProfileMetric[] {
  const totalAppointments = 960 + (hash % 620);
  const averageRating = (4.7 + ((hash % 3) * 0.1)).toFixed(1);
  const monthlyEarnings = 10800 + (hash % 4200);
  const completedServices = Math.round(totalAppointments * 0.63);

  return [
    {
      id: 'appointments',
      label: 'Toplam Randevu',
      value: new Intl.NumberFormat('tr-TR').format(totalAppointments),
      note: 'Son 12 ay ozeti',
      accentLabel: `+${8 + (hash % 9)}%`,
      accentTone: 'positive',
      kind: 'progress',
      progress: 68 + (hash % 22),
    },
    {
      id: 'rating',
      label: 'Ortalama Puan',
      value: averageRating,
      note: `${640 + (hash % 280)} degerlendirme`,
      kind: 'rating',
    },
    {
      id: 'earnings',
      label: 'Aylik Kazanc',
      value: formatCompactCurrency(monthlyEarnings),
      note: 'Cari ay tahmini',
      accentLabel: 'Canli',
      accentTone: 'positive',
      kind: 'summary',
    },
    {
      id: 'services',
      label: 'Tamamlanan Hizmetler',
      value: new Intl.NumberFormat('tr-TR').format(completedServices),
      note: 'Mali yil toplami',
      kind: 'summary',
    },
  ];
}

function createSchedule(hash: number): UserProfileScheduleItem[] {
  const weekdayEnd = 18 + (hash % 2);
  const saturdayEnd = 20 + (hash % 2);

  return [
    {
      id: 'weekday',
      label: 'Pazartesi - Cuma',
      hoursLabel: `09:00 - ${weekdayEnd}:00`,
      tone: 'primary',
    },
    {
      id: 'saturday',
      label: 'Cumartesi',
      hoursLabel: `10:00 - ${saturdayEnd}:00`,
      tone: 'primary',
    },
    {
      id: 'sunday',
      label: 'Pazar',
      hoursLabel: 'OFF',
      tone: 'error',
    },
  ];
}

function createAppointments(user: UserRecord, hash: number): UserProfileAppointment[] {
  const services = [
    `${user.specialties[0] ?? 'Sac Kesimi'} & ${user.specialties[1] ?? 'Bakim'}`,
    user.specialties[1] ?? 'Cilt Bakimi',
    user.specialties[0] ?? 'Klasik Kesim',
  ];
  const dates = ['Bugun, 14:30', 'Bugun, 11:00', 'Dun, 17:00'];

  return services.map((serviceName, index) => ({
    id: `${user.id}-appointment-${index + 1}`,
    customerName: customerNames[(hash + index * 2) % customerNames.length],
    serviceName,
    dateTimeLabel: dates[index],
    statusLabel: index === 0 ? 'Aktif' : 'Tamamlandi',
    statusTone: index === 0 ? 'primary' : 'success',
  }));
}

function createEarningsSeries(hash: number): UserProfileEarningsPoint[] {
  return monthLabels.map((monthLabel, index) => {
    const averageLevel = 34 + ((hash + index * 9) % 22);
    const revenueLevel = Math.min(100, averageLevel + 10 + ((hash + index * 13) % 28));

    return {
      id: `${monthLabel.toLowerCase()}-${hash}`,
      monthLabel,
      revenueLevel,
      averageLevel,
    };
  });
}

function createExpertise(user: UserRecord, hash: number) {
  const nextExpertise = expertisePool.filter((item) => !user.specialties.includes(item));
  const expertise = [...user.specialties];

  while (expertise.length < 5 && nextExpertise.length > 0) {
    const nextIndex = (hash + expertise.length * 3) % nextExpertise.length;
    expertise.push(nextExpertise.splice(nextIndex, 1)[0]);
  }

  return expertise;
}

function createActivities(user: UserRecord): UserProfileActivity[] {
  return [
    {
      id: `${user.id}-activity-1`,
      title: 'Randevu tamamlandi',
      detail: `Musteri: ${user.name.split(' ')[0]} ile planlanan son seans kapatildi - Bugun, 11:45`,
      highlighted: true,
    },
    {
      id: `${user.id}-activity-2`,
      title: 'Profil guncellendi',
      detail: 'Iletisim telefonu ve calisma saatleri duzenlendi - Dun, 09:20',
    },
    {
      id: `${user.id}-activity-3`,
      title: 'Yeni sertifika eklendi',
      detail: `${user.title} uzmanlik etiketi sisteme tanimlandi - 2 gun once`,
    },
    {
      id: `${user.id}-activity-4`,
      title: 'Sisteme giris yapildi',
      detail: `${user.city} konumundan web panel oturumu acildi - 3 gun once`,
      subdued: true,
    },
  ];
}

function createQuickActions(): UserProfileQuickAction[] {
  return [
    { id: 'reassign', label: 'Baska Salona Ata', icon: 'arrow-forward' },
    { id: 'reset-password', label: 'Sifre Sifirla', icon: 'lock-reset' },
    { id: 'change-role', label: 'Rol Degistir', icon: 'manage-accounts' },
  ];
}

function buildProfile(user: UserRecord): UserProfile {
  const hash = hashValue(user.id);
  const salon = user.salonId ? salonRecords.find((record) => record.id === user.salonId) : undefined;
  const district = extractDistrict(salon?.location ?? user.salonLocation);

  return {
    user,
    phoneNumber: buildPhoneNumber(hash),
    assignedSalonLabel: `${salon?.name ?? user.salonName} - ${district}`,
    locationLabel: user.city,
    metrics: createMetrics(user, hash),
    weeklySchedule: createSchedule(hash),
    recentAppointments: createAppointments(user, hash),
    earningsSeries: createEarningsSeries(hash),
    expertise: createExpertise(user, hash),
    activities: createActivities(user),
    quickActions: createQuickActions(),
  };
}

export function getUserProfileById(userId?: string) {
  if (!userId) {
    return null;
  }

  const user = userRecords.find((record) => record.id === userId);
  if (!user) {
    return null;
  }

  return buildProfile(user);
}
