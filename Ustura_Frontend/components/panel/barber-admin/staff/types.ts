import type { StaffRole } from '@/services/staff.service';

export type StaffRoleFilter = 'all' | StaffRole;
export type StaffEditorMode = 'create' | 'edit';

export interface StaffDirectoryItem {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  phone: string;
  role: StaffRole;
  roleLabel: string;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  initials: string;
  permissionHighlights: string[];
}

export interface StaffOverview {
  total: number;
  barberCount: number;
  receptionistCount: number;
  recentlyAdded: number;
}

export interface StaffRoleInsight {
  role: StaffRole;
  label: string;
  description: string;
  actionLabel: string;
  count: number;
  highlights: string[];
}

export interface StaffEditorValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: StaffRole;
  bio: string;
  photoUrl: string | null;
  photoFile: File | null;
  photoFileName: string | null;
  removePhoto: boolean;
}
