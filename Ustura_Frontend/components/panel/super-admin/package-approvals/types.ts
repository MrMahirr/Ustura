import type { PackageTier } from '@/components/panel/super-admin/packages/types';

export type PackageApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface PackageApprovalRecord {
  id: string;
  salonName: string;
  city: string;
  ownerName: string;
  ownerRole: string;
  packageName: string;
  packageTier: PackageTier;
  packageSummary: string;
  pricePerMonth: number;
  submittedAt: string;
  staffCount: number;
  monthlyReservations: number;
  businessDurationLabel: string;
  highlights: string[];
  reviewerNote: string;
  status: PackageApprovalStatus;
  heroImageUri: string;
}

export interface PackageApprovalCounts {
  pending: number;
  approved: number;
  rejected: number;
}
