import type { SalonPlan, SalonStatus } from '@/components/panel/super-admin/salon-management.data';

export type UserRole = 'Yonetici' | 'Sahip' | 'Calisan';
export type UserStatus = 'Aktif' | 'Mesgul' | 'Pasif' | 'Askida';
export type UserViewMode = 'all' | 'salons';

export interface DailyCapacity {
  booked: number;
  total: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  specialties: string[];
  salonId?: string;
  salonName: string;
  salonLocation: string;
  city: string;
  status: UserStatus;
  dailyCapacity?: DailyCapacity;
  avatarUrl: string;
  mutedImage?: boolean;
  joinedAt: string;
}

export interface UserOverview {
  totalUsers: number;
  activeToday: number;
  newRegistrations: string;
  conversion: string;
}

export interface UserFilterOption {
  label: string;
  value?: string;
}

export interface GroupedSalonRecord {
  id: string;
  salonId?: string;
  salonName: string;
  salonLocation: string;
  city: string;
  plan?: SalonPlan;
  salonStatus?: SalonStatus;
  totalUsers: number;
  activeUsers: number;
  ownerCount: number;
  adminCount: number;
  employeeCount: number;
  occupancyRate?: number;
  capacityCount: number;
  users: UserRecord[];
}
