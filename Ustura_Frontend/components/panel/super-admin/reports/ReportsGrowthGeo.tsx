import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import SalonGrowthBarChart from './charts/SalonGrowthBarChart';
import ReportsSectionTitle from './ReportsSectionTitle';

export interface ReportsGrowthGeoData {
  salonGrowth: { month: number; monthLabel: string; basvuru: number; onay: number }[];
  cities: { city: string; salons: number; share: number }[];
}

interface ReportsGrowthGeoProps extends ReportsGrowthGeoData {
  primary: string;
  primaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerHighest: string;
  surfaceContainerLow: string;
}

export default function ReportsGrowthGeo({
  salonGrowth,
  cities,
  primary,
  primaryContainer,
  onSurface,
  onSurfaceVariant,
  surfaceContainerHighest,
  surfaceContainerLow,
}: ReportsGrowthGeoProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  return (
    <View className="gap-6" style={{ flexDirection: isWide ? 'row' : 'column' }}>
      <View className="min-w-0 flex-1 rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow }}>
        <ReportsSectionTitle title="Salon Buyumesi" borderColor={primary} onSurface={onSurface} />
        <SalonGrowthBarChart
          data={salonGrowth.length ? salonGrowth : [{ month: 0, monthLabel: '—', basvuru: 0, onay: 0 }]}
          primary={primary}
          primaryContainer={primaryContainer}
          height={220}
        />
        <View
          className="mt-6 flex-row flex-wrap justify-center gap-6 border-t pt-6"
          style={{ borderTopColor: hexToRgba(onSurface, 0.08) }}>
          <View className="flex-row items-center gap-2">
            <View className="h-3 w-3" style={{ backgroundColor: primaryContainer }} />
            <Text className="font-label text-xs font-bold uppercase" style={{ color: onSurfaceVariant }}>
              Yeni Basvuru
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-3 w-3" style={{ backgroundColor: primary }} />
            <Text className="font-label text-xs font-bold uppercase" style={{ color: onSurfaceVariant }}>
              Onaylanan
            </Text>
          </View>
        </View>
      </View>

      <View className="min-w-0 flex-1 rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow }}>
        <ReportsSectionTitle title="Sehir Bazli Dagilim" borderColor={primary} onSurface={onSurface} />
        <View className="gap-5">
          {(cities.length ? cities : []).map((row, idx) => (
            <View key={row.city} className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="font-label text-xs font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
                  {row.city}
                </Text>
                <Text className="font-label text-xs font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
                  {row.salons} Salon
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: surfaceContainerHighest }}>
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(row.share * 100)}%`,
                    backgroundColor: idx === 0 ? primary : primaryContainer,
                  }}
                />
              </View>
            </View>
          ))}
          {cities.length === 0 ? (
            <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
              Sehir dagilimi icin yeterli veri yok.
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
