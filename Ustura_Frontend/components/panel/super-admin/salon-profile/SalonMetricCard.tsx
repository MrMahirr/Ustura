import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { SalonProfileMetric } from '@/components/panel/super-admin/salon-profile/data';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function SalonMetricCard({ metric }: { metric: SalonProfileMetric }) {
  const adminTheme = useSuperAdminTheme();

  const accentColor =
    metric.accent === 'success' ? adminTheme.success : metric.accent === 'error' ? adminTheme.error : adminTheme.primary;

  const trendColor =
    metric.trendTone === 'positive'
      ? adminTheme.success
      : metric.trendTone === 'negative'
        ? adminTheme.error
        : adminTheme.onSurfaceVariant;

  const trendIcon =
    metric.trendTone === 'positive'
      ? 'trending-up'
      : metric.trendTone === 'negative'
        ? 'trending-down'
        : 'trending-flat';

  return (
    <View className="gap-3 rounded-xl border p-[18px]" style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
        {metric.label}
      </Text>

      <View className="flex-row items-center gap-2">
        <Text className="font-headline text-[28px] tracking-[-0.6px]" style={{ color: adminTheme.onSurface }}>
          {metric.value}
        </Text>
        {metric.trendTone ? <MaterialIcons name={trendIcon} size={16} color={trendColor} /> : null}
      </View>

      <View className="h-[34px] flex-row items-end gap-1">
        {metric.bars.map((bar, index) => (
          <View
            key={`${metric.id}-bar-${index}`}
            className="min-h-2 flex-1 rounded-full"
            style={{
              height: `${bar}%` as any,
              backgroundColor:
                index === metric.bars.length - 1 ? accentColor : hexToRgba(accentColor, metric.accent === 'error' ? 0.24 : 0.18),
            }}
          />
        ))}
      </View>

      {metric.trendLabel ? (
        <Text className={salonProfileClassNames.infoValueSm} style={{ color: trendColor, fontFamily: 'Manrope-Bold' }}>
          {metric.trendLabel}
        </Text>
      ) : null}
    </View>
  );
}
