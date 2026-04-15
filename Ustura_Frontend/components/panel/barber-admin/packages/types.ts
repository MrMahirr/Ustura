import type { PackageFeature, PackageTier } from '@/services/package.service';

export interface UsageBar {
  label: string;
  percent: number;
  isCritical: boolean;
}

export type SubscriptionDisplayStatus = 'active' | 'expired' | 'pending' | 'cancelled' | null;

export interface CurrentPlanViewModel {
  packageName: string;
  priceLabel: string;
  usageBars: UsageBar[];
  warningMessage: string | null;
  daysRemaining: number | null;
  endDateLabel: string | null;
  subscriptionStatus: SubscriptionDisplayStatus;
}

export type PlanCardState = 'available' | 'current' | 'pending';

export interface PlanCardViewModel {
  id: string;
  name: string;
  tier: PackageTier;
  subtitle: string;
  priceLabel: string;
  priceSuffix: string;
  features: PackageFeature[];
  isFeatured: boolean;
  isCurrent: boolean;
  isPending: boolean;
  ctaLabel: string;
  cardState: PlanCardState;
}

export interface FeatureCategory {
  title: string;
  rows: FeatureRow[];
}

export interface FeatureRow {
  label: string;
  values: FeatureCellValue[];
}

export type FeatureCellValue =
  | { kind: 'text'; text: string; highlighted?: boolean }
  | { kind: 'check' }
  | { kind: 'dash' };

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
