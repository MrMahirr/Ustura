import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { PackageOverview } from './types';

interface StatCardProps {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
}

function StatCard({ label, value, badge, badgeColor, accentColor }: StatCardProps) {
  const adminTheme = useSuperAdminTheme();
  const borderColor = accentColor
    ? hexToRgba(accentColor, 0.3)
    : hexToRgba(adminTheme.primary, 0.2);

  return (
    <View
      className="min-h-[90px] justify-center rounded-[7px] border-l-2 p-5"
      style={{
        backgroundColor: adminTheme.cardBackground,
        borderLeftColor: borderColor,
      }}>
      <Text
        className="mb-2 font-label text-[10px] uppercase tracking-widest"
        style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.65), fontFamily: 'Manrope-Bold' }}>
        {label}
      </Text>
      <View className="flex-row items-baseline gap-2">
        <Text
          className="font-headline text-[28px] tracking-[-0.6px]"
          style={{ color: accentColor ?? adminTheme.onSurface }}>
          {value}
        </Text>
        {badge ? (
          <Text
            className="font-label text-[10px] uppercase"
            style={{ color: badgeColor ?? adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            {badge}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function PackageStatsRow({ overview }: { overview: PackageOverview }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();

  const basis =
    width >= 1200 ? '23.5%' : width >= 768 ? '48%' : '100%';

  return (
    <View className="flex-row flex-wrap gap-4">
      <View style={{ width: basis as any, minWidth: 200 }}>
        <StatCard
          label="Toplam Paket"
          value={String(overview.totalPackages)}
          badge="AKTIF"
        />
      </View>
      <View style={{ width: basis as any, minWidth: 200 }}>
        <StatCard
          label="Aktif Abonelik"
          value={String(overview.activeSubscriptions)}
          badge={`+${overview.subscriptionGrowthPercent}% BU AY`}
          badgeColor={adminTheme.success}
        />
      </View>
      <View style={{ width: basis as any, minWidth: 200 }}>
        <StatCard
          label="Bu Ay Gelir"
          value={`₺${new Intl.NumberFormat('tr-TR').format(overview.monthlyRevenue)}`}
        />
      </View>
      <View style={{ width: basis as any, minWidth: 200 }}>
        <StatCard
          label="Bekleyen Onay"
          value={String(overview.pendingApprovals)}
          badge="ISLEM BEKLIYOR"
          badgeColor={adminTheme.error}
          accentColor={adminTheme.error}
        />
      </View>
    </View>
  );
}
