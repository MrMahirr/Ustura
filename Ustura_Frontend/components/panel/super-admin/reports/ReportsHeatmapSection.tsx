import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import ReportsSectionTitle from './ReportsSectionTitle';

const HEAT_LEVELS = 5;

function cellColor(level: number, primary: string, surfaceContainerHighest: string) {
  const opacityMap = [0, 0.2, 0.4, 0.7, 1] as const;
  const o = opacityMap[Math.min(HEAT_LEVELS - 1, Math.max(0, level))] ?? 0;
  if (level <= 0) return surfaceContainerHighest;
  return hexToRgba(primary, o);
}

interface ReportsHeatmapSectionProps {
  heatmapLevels: number[][];
  hourly: { hour: string; h: number }[];
  primary: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerHighest: string;
  surfaceContainerLow: string;
}

export default function ReportsHeatmapSection({
  heatmapLevels,
  hourly,
  primary,
  onSurface,
  onSurfaceVariant,
  surfaceContainerHighest,
  surfaceContainerLow,
}: ReportsHeatmapSectionProps) {
  const hourlyBars =
    hourly.length > 0
      ? hourly
      : Array.from({ length: 11 }, (_, i) => ({
          hour: `${String(9 + i).padStart(2, '0')}:00`,
          h: 0,
        }));

  const heatmapGrid =
    heatmapLevels.length > 0 && (heatmapLevels[0]?.length ?? 0) > 0
      ? heatmapLevels
      : Array.from({ length: 7 }, () => Array.from({ length: 53 }, () => 0));

  const legend = (
    <View className="flex-row items-center gap-2">
      <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
        Az
      </Text>
      <View className="flex-row gap-1">
        {[0, 1, 2, 3, 4].map((lvl) => (
          <View
            key={lvl}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: cellColor(lvl, primary, surfaceContainerHighest),
            }}
          />
        ))}
      </View>
      <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
        Cok
      </Text>
    </View>
  );

  return (
    <View className="rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow }}>
      <ReportsSectionTitle
        title="Yillik Rezervasyon Yogunlugu"
        borderColor={primary}
        onSurface={onSurface}
        rightSlot={legend}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
        <View className="gap-1" style={{ flexDirection: 'column' }}>
          {heatmapGrid.map((row, ri) => (
            <View key={ri} className="flex-row gap-1">
              {row.map((lvl, ci) => (
                <View
                  key={ci}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: cellColor(lvl, primary, surfaceContainerHighest),
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="mt-10">
        <Text className="font-label mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
          Gunluk Saatlik Dagilim (Ortalama)
        </Text>
        <View className="h-20 flex-row items-end gap-1">
          {hourlyBars.map((b) => (
            <View key={b.hour} className="min-w-0 flex-1" style={{ height: '100%', justifyContent: 'flex-end' }}>
              <View style={{ height: `${b.h * 100}%`, minHeight: 2, backgroundColor: hexToRgba(primary, 0.25 + b.h * 0.75) }} />
            </View>
          ))}
        </View>
        <View className="mt-2 flex-row justify-between px-0.5">
          {hourlyBars
            .filter((_, i, arr) => arr.length <= 6 || i % Math.ceil(arr.length / 6) === 0)
            .map((b) => (
              <Text key={b.hour} className="font-label text-[10px] font-bold" style={{ color: onSurfaceVariant, opacity: 0.65 }}>
                {b.hour}
              </Text>
            ))}
        </View>
      </View>
    </View>
  );
}
