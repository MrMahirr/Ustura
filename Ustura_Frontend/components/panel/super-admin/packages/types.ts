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
  isFeatured: boolean;
}

export type SubscriptionStatus = 'Aktif' | 'Suresi Doldu' | 'Beklemede';

export interface SubscriptionRecord {
  id: string;
  salonName: string;
  salonInitial: string;
  packageName: string;
  packageTier: PackageTier;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
}

export interface PackageOverview {
  totalPackages: number;
  activeSubscriptions: number;
  subscriptionGrowthPercent: number;
  monthlyRevenue: number;
  pendingApprovals: number;
}
