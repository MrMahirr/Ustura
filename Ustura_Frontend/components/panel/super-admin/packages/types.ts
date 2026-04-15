export type PackageTier = 'baslangic' | 'profesyonel' | 'kurumsal';

export interface PackageFeature {
  label: string;
  included: boolean;
}

export interface PackageDefinition {
  id: string;
  tier: PackageTier;
  tierLabel: string;
  name: string;
  pricePerMonth: number;
  features: PackageFeature[];
  activeSalonCount: number;
  /** Active or pending subscriptions block hard delete (cancelled/expired do not). */
  linkedSubscriptionCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export type SubscriptionStatus =
  | 'Aktif'
  | 'Suresi Doldu'
  | 'Beklemede'
  | 'Iptal Edildi';

export interface SubscriptionRecord {
  id: string;
  salonName: string;
  salonInitial: string;
  packageName: string;
  packageTier: PackageTier;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
  /** True when admin may set subscription status to cancelled. */
  canCancel: boolean;
}

export interface PackageOverview {
  totalPackages: number;
  activeSubscriptions: number;
  subscriptionGrowthPercent: number;
  monthlyRevenue: number;
  pendingApprovals: number;
}
