import { Role } from '../../../shared/auth/role.enum';
import type { PackageTier } from '../../package/interfaces/package.types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string | null;
  firebaseUid: string | null;
  role: Role;
  isActive: boolean;
  /** Personnel: true until user sets a new password (e.g. auto-provisioned staff). */
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfile = Omit<User, 'passwordHash' | 'firebaseUid'>;

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
  allowPasswordless?: boolean;
  allowEmptyPhone?: boolean;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role.BARBER | Role.RECEPTIONIST;
  /** When true, user must change password before other authenticated actions. */
  mustChangePassword?: boolean;
}

export interface CreateOwnerInput {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}

export interface CreateUserRecordInput {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
  allowPasswordless?: boolean;
  allowEmptyPhone?: boolean;
  role: Role;
  mustChangePassword?: boolean;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
}

export type AdminUserRole = 'manager' | 'owner' | 'employee';
export type AdminUserStatus = 'active' | 'busy' | 'inactive' | 'suspended';

export interface AdminUserDailyCapacity {
  booked: number;
  total: number;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  staffRole: Role.BARBER | Role.RECEPTIONIST | null;
  status: AdminUserStatus;
  staffBio: string | null;
  avatarUrl: string | null;
  salonId: string | null;
  salonName: string;
  salonLocation: string;
  city: string;
  salonIsActive: boolean | null;
  packageTier: PackageTier | null;
  todayReservationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserOverview {
  totalUsers: number;
  activeToday: number;
  newLast30Days: number;
  activeRate: number;
}

export interface AdminUserFilterOption {
  id: string;
  name: string;
}

export interface AdminUserFilterOptions {
  salons: AdminUserFilterOption[];
  cities: string[];
}

export interface AdminUserListResult {
  items: AdminUserSummary[];
  overview: AdminUserOverview;
  filters: AdminUserFilterOptions;
}

export interface FindAdminUsersFilters {
  search?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
  salonId?: string;
  city?: string;
}
