import type {
  UserFilterOption,
  UserOverview,
  UserRecord,
  UserRole,
  UserStatus,
} from '@/components/panel/super-admin/user-management.data';
import type {
  AdminApiPackageTier,
  AdminApiStaffRole,
  AdminApiUserRole,
  AdminApiUserStatus,
  AdminUserRecord,
  AdminUsersFilterOptionResponse,
  AdminUsersOverviewResponse,
} from '@/services/user.service';

function formatAvatarUrl(user: Pick<AdminUserRecord, 'avatarUrl' | 'id' | 'name'>) {
  if (user.avatarUrl) {
    return user.avatarUrl;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1b1b20&color=e6c364&size=256`;
}

function mapRole(role: AdminApiUserRole): UserRole {
  switch (role) {
    case 'manager':
      return 'Yonetici';
    case 'owner':
      return 'Sahip';
    case 'employee':
    default:
      return 'Calisan';
  }
}

function mapStatus(status: AdminApiUserStatus): UserStatus {
  switch (status) {
    case 'busy':
      return 'Mesgul';
    case 'inactive':
      return 'Pasif';
    case 'suspended':
      return 'Askida';
    case 'active':
    default:
      return 'Aktif';
  }
}

function mapTitle(role: AdminApiUserRole, staffRole: AdminApiStaffRole) {
  if (role === 'manager') {
    return 'Platform Yoneticisi';
  }

  if (role === 'owner') {
    return 'Salon Sahibi';
  }

  if (staffRole === 'receptionist') {
    return 'Resepsiyon Uzmani';
  }

  return 'Berber Uzmani';
}

function createSpecialties(
  record: Pick<AdminUserRecord, 'role' | 'staffRole' | 'staffBio' | 'salonName' | 'city'>,
) {
  const fromBio = record.staffBio
    ?.split(/[,.]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2)
    .slice(0, 2);

  if (fromBio && fromBio.length > 0) {
    return fromBio;
  }

  if (record.role === 'manager') {
    return ['Operasyon', 'Platform Yonetimi'];
  }

  if (record.role === 'owner') {
    return ['Salon Yonetimi', record.city];
  }

  if (record.staffRole === 'receptionist') {
    return ['Randevu Akisi', 'Musteri Karsilama'];
  }

  return ['Sac Kesimi', record.salonName];
}

function mapDailyCapacity(record: Pick<AdminUserRecord, 'role' | 'staffRole' | 'todayReservationCount'>) {
  if (record.role !== 'employee' || record.staffRole !== 'barber') {
    return undefined;
  }

  return {
    booked: record.todayReservationCount,
    total: 12,
  };
}

function mapSalonPlan(tier: AdminApiPackageTier) {
  if (tier === 'kurumsal') {
    return 'Ozel' as const;
  }

  if (tier === 'profesyonel') {
    return 'Gelismis' as const;
  }

  if (tier === 'baslangic') {
    return 'Temel' as const;
  }

  return undefined;
}

function mapSalonStatus(isActive: boolean | null) {
  if (isActive == null) {
    return undefined;
  }

  return isActive ? ('Aktif' as const) : ('Askiya Alindi' as const);
}

export function mapAdminUserRecord(record: AdminUserRecord): UserRecord {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: mapRole(record.role),
    title: mapTitle(record.role, record.staffRole),
    specialties: createSpecialties(record),
    salonId: record.salonId ?? undefined,
    salonName: record.salonName,
    salonLocation: record.salonLocation,
    city: record.city,
    status: mapStatus(record.status),
    dailyCapacity: mapDailyCapacity(record),
    avatarUrl: formatAvatarUrl(record),
    mutedImage: record.status === 'inactive' || record.status === 'suspended',
    joinedAt: record.createdAt,
  };
}

export function mapOverview(
  overview: AdminUsersOverviewResponse | null | undefined,
): UserOverview {
  const totalUsers = overview?.totalUsers ?? 0;
  const activeToday = overview?.activeToday ?? 0;
  const newLast30Days = overview?.newLast30Days ?? 0;
  const activeRate = overview?.activeRate ?? 0;

  return {
    totalUsers,
    activeToday,
    newRegistrations: `${newLast30Days >= 0 ? '+' : ''}${newLast30Days}`,
    conversion: `${activeRate.toFixed(1)}%`,
  };
}

export function createRoleOptions(): UserFilterOption[] {
  return [
    { label: 'Tum Roller' },
    { label: 'Yonetici', value: 'manager' },
    { label: 'Sahip', value: 'owner' },
    { label: 'Calisan', value: 'employee' },
  ];
}

export function createStatusOptions(): UserFilterOption[] {
  return [
    { label: 'Tum Durumlar' },
    { label: 'Aktif', value: 'active' },
    { label: 'Mesgul', value: 'busy' },
    { label: 'Pasif', value: 'inactive' },
    { label: 'Askida', value: 'suspended' },
  ];
}

export function createSalonOptions(
  salons: AdminUsersFilterOptionResponse[] | undefined,
): UserFilterOption[] {
  return [
    { label: 'Tum Salonlar' },
    ...(salons ?? []).map((salon) => ({
      label: salon.name,
      value: salon.id,
    })),
  ];
}

export function createCityOptions(cities: string[] | undefined): UserFilterOption[] {
  return [
    { label: 'Tum Sehirler' },
    ...(cities ?? []).map((city) => ({
      label: city,
      value: city,
    })),
  ];
}

export function mapSalonMetadata(record: AdminUserRecord) {
  return {
    plan: mapSalonPlan(record.packageTier),
    salonStatus: mapSalonStatus(record.salonIsActive),
  };
}
