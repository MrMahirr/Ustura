import { apiRequest } from '@/services/api';

export type StaffRole = 'barber' | 'receptionist';

export interface StaffRecord {
  id: string;
  userId: string;
  salonId: string;
  displayName: string;
  role: StaffRole;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getStaffBySalon(salonId: string) {
  return apiRequest<StaffRecord[]>({
    path: `/salons/${salonId}/staff`,
  });
}
