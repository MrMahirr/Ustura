import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { BarberDashboardMetric } from './data';
import {
  getBarberPanelShadow,
  getMetricToneColor,
} from './presentation';
import { useBarberAdminTheme } from './theme';

export default function BarberMetricCard({
  metric,
}: {
  metric: BarberDashboardMetric;
}) {
  const theme = useBarberAdminTheme();
  const deltaColor = getMetricToneColor(metric.tone, theme);

  return (
    <View
      className="min-h-[166px] flex-1 overflow-hidden rounded-xl border px-6 py-6"
      style={{
        backgroundColor: theme.panelBackground,
        borderColor: theme.borderSubtle,
        ...getBarberPanelShadow(theme),
      }}>
      <View
        pointerEvents="none"
        className="absolute right-4 top-4"
        style={{ opacity: 0.12 }}>
        <MaterialIcons name={metric.icon} size={52} color={theme.onSurfaceVariant} />
      </View>

      <Text
        className="mb-4 max-w-[160px] font-body text-[10px] uppercase tracking-[2.3px]"
        style={{ color: hexToRgba(theme.onSurfaceVariant, 0.8), fontFamily: 'Manrope-SemiBold' }}>
        {metric.label}
      </Text>

      <View className="flex-row items-end gap-3">
        <Text
          className="font-headline text-[38px]"
          style={{ color: theme.onSurface, fontFamily: 'NotoSerif-Bold' }}>
          {metric.value}
        </Text>
        <View className="mb-1 flex-row items-center gap-1">
          {metric.tone !== 'neutral' ? (
            <MaterialIcons
              name={metric.tone === 'positive' ? 'trending-up' : 'priority-high'}
              size={14}
              color={deltaColor}
            />
          ) : null}
          <Text
            className="font-body text-[11px]"
            style={{ color: deltaColor, fontFamily: 'Manrope-Bold' }}>
            {metric.deltaLabel}
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.18),
          }}
        />
      ) : null}
    </View>
  );
}
