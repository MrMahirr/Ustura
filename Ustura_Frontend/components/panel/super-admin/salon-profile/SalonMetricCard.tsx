import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { SalonProfileMetric } from '@/components/panel/super-admin/salon-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

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
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
      ]}>
      <Text style={[styles.metricLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }]}>
        {metric.label}
      </Text>

      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: adminTheme.onSurface }]}>{metric.value}</Text>
        {metric.trendTone ? <MaterialIcons name={trendIcon} size={16} color={trendColor} /> : null}
      </View>

      <View style={styles.sparklineRow}>
        {metric.bars.map((bar, index) => (
          <View
            key={`${metric.id}-bar-${index}`}
            style={[
              styles.sparklineBar,
              {
                height: `${bar}%` as any,
                backgroundColor:
                  index === metric.bars.length - 1 ? accentColor : hexToRgba(accentColor, metric.accent === 'error' ? 0.24 : 0.18),
              },
            ]}
          />
        ))}
      </View>

      {metric.trendLabel ? (
        <Text style={[styles.infoValueSm, { color: trendColor, fontFamily: 'Manrope-Bold' }]}>{metric.trendLabel}</Text>
      ) : null}
    </View>
  );
}
