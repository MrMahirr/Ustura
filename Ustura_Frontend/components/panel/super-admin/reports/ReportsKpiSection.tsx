import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { ReportKpi } from './types';

const BLUE = '#60a5fa';

interface ReportsKpiSectionProps {
  items: ReportKpi[];
  onSurface: string;
  onSurfaceVariant: string;
  primary: string;
  primaryContainer: string;
  outline: string;
  surfaceContainerLow: string;
}

function accentColor(
  accent: ReportKpi['accent'],
  primary: string,
  primaryContainer: string,
  outline: string,
) {
  switch (accent) {
    case 'blue':
      return BLUE;
    case 'primaryContainer':
      return primaryContainer;
    case 'outline':
      return outline;
    default:
      return primary;
  }
}

export default function ReportsKpiSection({
  items,
  onSurface,
  onSurfaceVariant,
  primary,
  primaryContainer,
  outline,
  surfaceContainerLow,
}: ReportsKpiSectionProps) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {items.map((kpi) => {
        const accent = accentColor(kpi.accent, primary, primaryContainer, outline);
        return (
          <View
            key={kpi.id}
            className="min-w-[140px] flex-1 rounded-sm p-5"
            style={{
              backgroundColor: surfaceContainerLow,
              borderBottomWidth: 2,
              borderBottomColor: hexToRgba(accent, 0.5),
            }}>
            <Text className="font-label mb-2 text-[11px] uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
              {kpi.label}
            </Text>
            <View className="flex-row flex-wrap items-baseline gap-2">
              <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                {kpi.value}
              </Text>
              <View className="flex-row items-center gap-0.5">
                <Text
                  className="font-label text-xs font-bold"
                  style={{ color: kpi.deltaPositive ? '#22c55e' : '#ef4444' }}>
                  {kpi.deltaLabel}
                </Text>
                <MaterialIcons
                  name={kpi.deltaLabel.startsWith('+') && !kpi.deltaLabel.includes('%') ? 'add' : 'trending-up'}
                  size={14}
                  color={kpi.deltaPositive ? '#22c55e' : '#ef4444'}
                />
              </View>
            </View>
            <View className="mt-4 h-2 justify-end">
              <View className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: hexToRgba(accent, 0.12) }}>
                <View
                  className="h-full rounded-full"
                  style={[
                    {
                      width: `${Math.round(kpi.progress * 100)}%`,
                      backgroundColor: accent,
                    },
                    Platform.OS === 'web'
                      ? ({ boxShadow: `0 0 8px ${hexToRgba(accent, 0.35)}` } as any)
                      : null,
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
