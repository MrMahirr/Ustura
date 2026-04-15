import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { ReportPeriodId } from './types';
import { REPORT_PERIOD_LABELS } from './fixtures';

const PERIODS: ReportPeriodId[] = ['today', 'week', 'month', 'year', 'custom'];

interface ReportsAppBarProps {
  period: ReportPeriodId;
  onPeriodChange: (id: ReportPeriodId) => void;
  primary: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerLowest: string;
  surfaceContainerHighest: string;
  topBarBackground: string;
  borderSubtle: string;
}

export default function ReportsAppBar({
  period,
  onPeriodChange,
  primary,
  onSurface,
  onSurfaceVariant,
  surfaceContainerLowest,
  surfaceContainerHighest,
  topBarBackground,
  borderSubtle,
}: ReportsAppBarProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 900;

  const headerChrome = [
    {
      backgroundColor: Platform.OS === 'web' ? topBarBackground : surfaceContainerLowest,
      borderBottomColor: borderSubtle,
    },
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any)
      : null,
  ];

  return (
    <View className="z-40 flex-col gap-4 border-b px-6 py-4" style={headerChrome}>
      <View className={`flex-row flex-wrap items-center justify-between gap-4 ${isCompact ? '' : ''}`}>
        <Text
          className="font-headline text-2xl font-bold tracking-tight"
          style={{ color: primary }}>
          Analytics Dashboard
        </Text>

        {!isCompact ? (
          <Pressable
            className="flex-row items-center gap-2 rounded-sm border px-4 py-2"
            style={{ borderColor: hexToRgba(primary, 0.35) }}
            onPress={() => {}}>
            <MaterialIcons name="download" size={16} color={primary} />
            <Text className="font-label text-[11px] font-bold uppercase tracking-widest" style={{ color: primary }}>
              Rapor Indir
            </Text>
          </Pressable>
        ) : (
          <Pressable className="flex-row items-center gap-1 p-2" onPress={() => {}}>
            <MaterialIcons name="download" size={20} color={primary} />
          </Pressable>
        )}
      </View>

      <View className="flex-row flex-wrap items-center gap-2" style={{ backgroundColor: surfaceContainerLowest, padding: 4, borderRadius: 4 }}>
        {PERIODS.map((id) => {
          const active = period === id;
          return (
            <Pressable
              key={id}
              onPress={() => onPeriodChange(id)}
              className="rounded-sm px-3 py-1.5"
              style={{
                backgroundColor: active ? surfaceContainerHighest : 'transparent',
              }}>
              <Text
                className="font-label text-[11px] font-bold uppercase tracking-wide"
                style={{ color: active ? primary : onSurfaceVariant }}>
                {REPORT_PERIOD_LABELS[id]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
