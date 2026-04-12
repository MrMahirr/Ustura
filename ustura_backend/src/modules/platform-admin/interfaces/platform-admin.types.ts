import type { WorkingHours } from '../../salon/interfaces/salon.types';
import { OwnerApplicationStatus } from '../enums/owner-application-status.enum';

export interface OwnerApplicationRecord {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  passwordHash: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonDistrict: string | null;
  salonPhotoUrl: string | null;
  salonWorkingHours: WorkingHours;
  status: OwnerApplicationStatus;
  notes: string | null;
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
  rejectionReason: string | null;
  approvedOwnerUserId: string | null;
  approvedSalonId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OwnerApplication = Omit<OwnerApplicationRecord, 'passwordHash'>;

export interface CreateOwnerApplicationInput {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  passwordHash: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonDistrict?: string | null;
  salonPhotoUrl?: string | null;
  salonWorkingHours: WorkingHours;
  notes?: string | null;
}

export interface ApproveOwnerApplicationInput {
  reviewedByUserId: string;
  approvedOwnerUserId: string;
  approvedSalonId: string;
}
