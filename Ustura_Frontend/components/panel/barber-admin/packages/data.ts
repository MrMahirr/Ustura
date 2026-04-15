import type { Package } from '@/services/package.service';

import type {
  CurrentPlanViewModel,
  FeatureCategory,
  FeatureCellValue,
  PlanCardState,
  PlanCardViewModel,
  SubscriptionDisplayStatus,
  UsageBar,
} from './types';

export interface SalonSubscriptionResponse {
  packageId: string | null;
  packageName: string | null;
  packageTier: string | null;
  pricePerMonth: number | null;
  status: 'active' | 'expired' | 'pending' | 'cancelled' | null;
  startDate: string | null;
  endDate: string | null;
  reservationCount: number;
  reservationLimit: number | null;
  staffCount: number;
  staffLimit: number | null;
  salonCount: number;
  salonLimit: number | null;
}

const TIER_SUBTITLES: Record<string, string> = {
  baslangic: 'Butik Salonlar İçin',
  profesyonel: 'Büyüyen İşletmeler',
  kurumsal: 'Çoklu Şube Yönetimi',
};

function calcPercent(used: number, limit: number | null): number {
  if (limit == null || limit <= 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
}

function formatPrice(price: number): string {
  return `₺${price.toLocaleString('tr-TR')}`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function computeDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function buildCurrentPlan(sub: SalonSubscriptionResponse): CurrentPlanViewModel {
  const bars: UsageBar[] = [];

  if (sub.reservationLimit != null) {
    const pct = calcPercent(sub.reservationCount, sub.reservationLimit);
    bars.push({ label: 'Rezervasyon', percent: pct, isCritical: pct >= 90 });
  }

  if (sub.staffLimit != null) {
    const pct = calcPercent(sub.staffCount, sub.staffLimit);
    bars.push({ label: 'Personel', percent: pct, isCritical: pct >= 90 });
  }

  if (sub.salonLimit != null) {
    const pct = calcPercent(sub.salonCount, sub.salonLimit);
    bars.push({ label: 'Salon', percent: pct, isCritical: pct >= 90 });
  }

  const hasCritical = bars.some((b) => b.isCritical);
  const daysRemaining = computeDaysRemaining(sub.endDate);

  return {
    packageName: sub.packageName ?? 'Paket Yok',
    priceLabel: sub.pricePerMonth != null ? formatPrice(sub.pricePerMonth) : '—',
    usageBars: bars,
    warningMessage: hasCritical
      ? 'Limite yaklaşıyorsunuz. Daha fazla kapasite için yükseltmeyi düşünün.'
      : null,
    daysRemaining,
    endDateLabel: sub.endDate ? formatDate(sub.endDate) : null,
    subscriptionStatus: sub.status,
  };
}

function resolveCardState(
  packageId: string,
  currentPackageId: string | null,
  subscriptionStatus: SubscriptionDisplayStatus,
): PlanCardState {
  if (packageId !== currentPackageId) return 'available';
  if (subscriptionStatus === 'pending') return 'pending';
  return 'current';
}

function resolveCtaLabel(state: PlanCardState, tier: string): string {
  if (state === 'current') return 'Geçerli Paket';
  if (state === 'pending') return 'Onay Bekliyor';
  if (tier === 'kurumsal') return 'Bize Ulaşın';
  return 'Şimdi Yükselt';
}

export function buildPlanCards(
  packages: Package[],
  currentPackageId: string | null,
  subscriptionStatus: SubscriptionDisplayStatus,
): PlanCardViewModel[] {
  return packages.map((pkg) => {
    const cardState = resolveCardState(pkg.id, currentPackageId, subscriptionStatus);

    return {
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      subtitle: TIER_SUBTITLES[pkg.tier] ?? '',
      priceLabel: formatPrice(pkg.pricePerMonth),
      priceSuffix: '/ay',
      features: pkg.features,
      isFeatured: pkg.isFeatured,
      isCurrent: cardState === 'current',
      isPending: cardState === 'pending',
      ctaLabel: resolveCtaLabel(cardState, pkg.tier),
      cardState,
    };
  });
}

export function buildFeatureCategories(packages: Package[]): FeatureCategory[] {
  const tierOrder = ['baslangic', 'profesyonel', 'kurumsal'] as const;
  const sorted = [...packages].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  );

  const featureSet = new Map<string, Map<string, boolean>>();
  for (const pkg of sorted) {
    for (const f of pkg.features) {
      if (!featureSet.has(f.label)) featureSet.set(f.label, new Map());
      featureSet.get(f.label)!.set(pkg.tier, f.included);
    }
  }

  const rows: import('./types').FeatureRow[] = [];
  for (const [label, tiers] of featureSet) {
    const values: FeatureCellValue[] = tierOrder.map((t) => {
      const included = tiers.get(t);
      if (included === true) return { kind: 'check' as const };
      if (included === false) return { kind: 'dash' as const };
      return { kind: 'dash' as const };
    });
    rows.push({ label, values });
  }

  return [{ title: 'Özellikler', rows }];
}
