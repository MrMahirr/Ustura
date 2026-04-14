import { apiRequest } from './api';

export type AdminApiUserRole = 'manager' | 'owner' | 'employee';
export type AdminApiUserStatus = 'active' | 'busy' | 'inactive' | 'suspended';
export type AdminApiStaffRole = 'barber' | 'receptionist' | null;
export type AdminApiPackageTier = 'baslangic' | 'profesyonel' | 'kurumsal' | null;

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminApiUserRole;
  staffRole: AdminApiStaffRole;
  status: AdminApiUserStatus;
  staffBio: string | null;
  avatarUrl: string | null;
  salonId: string | null;
  salonName: string;
  salonLocation: string;
  city: string;
  salonIsActive: boolean | null;
  packageTier: AdminApiPackageTier;
  todayReservationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersOverviewResponse {
  totalUsers: number;
  activeToday: number;
  newLast30Days: number;
  activeRate: number;
}

export interface AdminUsersFilterOptionResponse {
  id: string;
  name: string;
}

export interface AdminUsersListResponse {
  items: AdminUserRecord[];
  overview: AdminUsersOverviewResponse;
  filters: {
    salons: AdminUsersFilterOptionResponse[];
    cities: string[];
  };
}

export interface AdminUsersQuery extends Record<string, string | undefined> {
  search?: string;
  role?: AdminApiUserRole;
  status?: AdminApiUserStatus;
  salonId?: string;
  city?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getMyProfile() {
  return apiRequest<UserProfile>({
    path: '/users/me',
    auth: true,
  });
}

export class UserService {
  static async getAdminUsers(query: AdminUsersQuery = {}): Promise<AdminUsersListResponse> {
    return apiRequest<AdminUsersListResponse>({
      path: '/users/admin',
      method: 'GET',
      query,
      auth: true,
    });
  }

  static async getAdminUserById(userId: string): Promise<AdminUserRecord> {
    return apiRequest<AdminUserRecord>({
      path: `/users/admin/${userId}`,
      method: 'GET',
      auth: true,
    });
  }

  static async patchAdminUserStatus(userId: string, isActive: boolean): Promise<AdminUserRecord> {
    return apiRequest<AdminUserRecord>({
      path: `/users/admin/${userId}/status`,
      method: 'PATCH',
      body: { isActive },
      auth: true,
    });
  }
}
