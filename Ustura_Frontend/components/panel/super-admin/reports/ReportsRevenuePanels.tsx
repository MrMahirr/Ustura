import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import PackageDonutChart from './charts/PackageDonutChart';
import RevenueLineChart from './charts/RevenueLineChart';
import ReportsSectionTitle from './ReportsSectionTitle';

export interface ReportsRevenuePanelsData {
  revenueSeries: { day: number; current: number; previous: number }[];
  revenueXLabels: string[];
  packageShare: { label: string; value: number; tier: string }[];
}

function sliceColorForTier(
  tier: string,
  index: number,
  primary: string,
  primaryContainer: string,
  onSurfaceVariant: string,
) {
  const t = tier.toLowerCase();
  if (t.includes('elite') || t.includes('premium') || t.includes('gold') || t.includes('pro')) {
    return primary;
  }
  if (t.includes('basic') || t.includes('stand') || t.includes('start')) {
    return primaryContainer;
  }
  const palette = [primary, primaryContainer, hexToRgba(onSurfaceVariant, 0.55)];
  return palette[index % palette.length] ?? primary;
}

interface ReportsRevenuePanelsProps extends ReportsRevenuePanelsData {
  primary: string;
  primaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerHighest: string;
  surfaceContainerLow: string;
}

export default function ReportsRevenuePanels({
  revenueSeries,
  revenueXLabels,
  packageShare,
  primary,
  primaryContainer,
  onSurface,
  onSurfaceVariant,
  surfaceContainerHighest,
  surfaceContainerLow,
}: ReportsRevenuePanelsProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  const lineData =
    revenueSeries.length > 0 ? revenueSeries : [{ day: 1, current: 0, previous: 0 }];

  const pieSlices = React.useMemo(
    () =>
      packageShare.map((row, index) => ({
        label: row.label,
        value: row.value,
        color: sliceColorForTier(row.tier, index, primary, primaryContainer, onSurfaceVariant),
      })),
    [packageShare, primary, primaryContainer, onSurfaceVariant],
  );

  const donutCenter =
    packageShare.length > 0
      ? `${Math.min(100, Math.round(packageShare.reduce((s, r) => s + r.value, 0)))}%`
      : '—';

  const legend = (
    <View className="flex-row flex-wrap gap-4">
      <View className="flex-row items-center gap-2">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: primary }} />
        <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
          Mevcut Ay
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: surfaceContainerHighest }} />
        <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
          Gecen Ay
        </Text>
      </View>
    </View>
  );

  return (
    <View className="gap-6" style={{ flexDirection: isWide ? 'row' : 'column' }}>
      <View className="min-w-0 flex-1 rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow, flex: isWide ? 2 : 1 }}>
        <ReportsSectionTitle title="Gelir Analizi" borderColor={primary} onSurface={onSurface} rightSlot={legend} />
        <RevenueLineChart
          data={lineData}
          primary={primary}
          track={surfaceContainerHighest}
          height={240}
        />
        <View className="mt-2 flex-row justify-between px-1">
          {(revenueXLabels.length ? revenueXLabels : lineData.map((_, i) => String(i + 1))).map((t, ti) => (
            <Text key={`${t}-${ti}`} className="font-label text-[10px] font-bold" style={{ color: onSurfaceVariant, opacity: 0.7 }}>
              {t}
            </Text>
          ))}
        </View>
      </View>

      <View className="min-w-0 flex-1 rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow }}>
        <ReportsSectionTitle title="Paket Bazli Gelir" borderColor={primary} onSurface={onSurface} />
        <View className="items-center">
          <PackageDonutChart
            slices={pieSlices}
            centerTitle="Dagilim"
            centerValue={donutCenter}
            titleColor={onSurfaceVariant}
            valueColor={onSurface}
            centerHoleColor={surfaceContainerLow}
            size={192}
          />
          <View className="mt-8 w-full gap-4">
            {(pieSlices.length ? pieSlices : [{ label: 'Veri yok', value: 0, color: hexToRgba(onSurfaceVariant, 0.35) }]).map((s) => (
              <View key={s.label} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View style={{ width: 8, height: 8, backgroundColor: s.color }} />
                  <Text className="font-body text-xs font-medium" style={{ color: onSurface }}>
                    {s.label}
                  </Text>
                </View>
                <Text className="font-body text-xs font-bold" style={{ color: onSurface }}>
                  {s.value}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
