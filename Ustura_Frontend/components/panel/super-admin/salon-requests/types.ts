export type ApplicationStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export interface SalonRequestListItem {
  id: string;
  salonName: string;
  salonSlug: string;
  salonInitials: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  city: string;
  district: string | null;
  appliedAtLabel: string;
  status: 'pending' | 'approved' | 'rejected';
  salonPhotoUrl: string | null;
  salonAddress: string;
  notes: string | null;
}

export interface SalonRequestStats {
  total: number;
  pending: number;
  todayCount: number;
  approvedThisWeek: number;
  rejected: number;
}

export type DrawerTab = 'general' | 'documents' | 'notes' | 'history';

export type SaveOwnerApplicationResult =
  | { ok: true }
  | { ok: false; message: string };
