import { apiRequest } from '@/services/api';

export type StaffRole = 'barber' | 'receptionist';

export interface CreateEmployeeAccountPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface StaffRecord {
  id: string;
  userId: string;
  salonId: string;
  displayName: string;
  email: string;
  phone: string;
  role: StaffRole;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  userId?: string;
  employee?: CreateEmployeeAccountPayload;
  role: StaffRole;
  bio?: string;
  photoUrl?: string;
}

export interface UpdateStaffPayload {
  account?: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };
  role?: StaffRole;
  bio?: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
}

export async function getStaffBySalon(salonId: string) {
  return apiRequest<StaffRecord[]>({
    path: `/salons/${salonId}/staff`,
  });
}

export async function getMyStaffAssignments() {
  return apiRequest<StaffRecord[]>({
    path: '/staff/me',
    auth: true,
  });
}

export async function createStaffMember(salonId: string, body: CreateStaffPayload) {
  return apiRequest<StaffRecord, CreateStaffPayload>({
    path: `/salons/${salonId}/staff`,
    method: 'POST',
    auth: true,
    body,
  });
}

export async function updateStaffMember(
  salonId: string,
  staffId: string,
  body: UpdateStaffPayload,
) {
  return apiRequest<StaffRecord, UpdateStaffPayload>({
    path: `/salons/${salonId}/staff/${staffId}`,
    method: 'PATCH',
    auth: true,
    body,
  });
}

export async function deleteStaffMember(salonId: string, staffId: string) {
  return apiRequest<StaffRecord>({
    path: `/salons/${salonId}/staff/${staffId}`,
    method: 'DELETE',
    auth: true,
  });
}

export async function uploadStaffMemberPhoto(
  salonId: string,
  staffId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<StaffRecord, FormData>({
    path: `/salons/${salonId}/staff/${staffId}/photo`,
    method: 'POST',
    auth: true,
    body: formData,
  });
}

export async function removeStaffMemberPhoto(salonId: string, staffId: string) {
  return apiRequest<StaffRecord>({
    path: `/salons/${salonId}/staff/${staffId}/photo`,
    method: 'DELETE',
    auth: true,
  });
}

export async function uploadMyStaffPhoto(staffId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<StaffRecord, FormData>({
    path: `/staff/me/${staffId}/photo`,
    method: 'POST',
    auth: true,
    body: formData,
  });
}

export async function removeMyStaffPhoto(staffId: string) {
  return apiRequest<StaffRecord>({
    path: `/staff/me/${staffId}/photo`,
    method: 'DELETE',
    auth: true,
  });
}
