import React from 'react';
import { Platform, Text, View } from 'react-native';

import type { UserProfileEarningsPoint } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserEarningsSection({
  series,
}: {
  series: UserProfileEarningsPoint[];
}) {
  const adminTheme = useSuperAdminTheme();
  const cardShadowStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            adminTheme.theme === 'dark'
              ? '0 18px 40px rgba(0, 0, 0, 0.24)'
              : '0 18px 40px rgba(27, 27, 32, 0.08)',
        } as any)
      : {
          shadowColor: '#000000',
          shadowOpacity: adminTheme.theme === 'dark' ? 0.18 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        };

  return (
    <View
      style={[
        styles.panelCard,
        {
          backgroundColor: adminTheme.cardBackground,
          ...cardShadowStyle,
        },
      ]}>
      <View style={styles.panelHeaderRow}>
        <View style={styles.panelHeaderCopy}>
          <Text style={[styles.panelTitle, { color: adminTheme.onSurface }]}>Earnings Over Time</Text>
          <Text style={[styles.panelSubtitle, { color: adminTheme.onSurfaceVariant }]}>
            Revenue trends for the last 6 months
          </Text>
        </View>

        <View style={styles.earningsLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: adminTheme.primary }]} />
            <Text style={[styles.legendText, { color: adminTheme.primary }]}>Revenue</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: adminTheme.surfaceContainerHighest }]} />
            <Text style={[styles.legendText, { color: adminTheme.onSurfaceVariant }]}>Average</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartWrap}>
        {series.map((point) => (
          <View key={point.id} style={styles.chartColumn}>
            <View style={[styles.chartTrack, { backgroundColor: adminTheme.surfaceContainerHighest }]}>
              <View
                style={[
                  styles.chartAverageFill,
                  {
                    height: `${point.averageLevel}%`,
                    backgroundColor: hexToRgba(adminTheme.surfaceContainerHighest, 0.92),
                  },
                ]}
              />
              <View
                style={[
                  styles.chartRevenueFill,
                  {
                    height: `${point.revenueLevel}%`,
                    backgroundColor: hexToRgba(adminTheme.primary, 0.32),
                  },
                ]}
              />
              <View
                style={[
                  styles.chartRevenueFill,
                  {
                    height: `${Math.max(point.revenueLevel - 8, 20)}%`,
                    backgroundColor: adminTheme.primary,
                    ...(adminTheme.theme === 'dark'
                      ? ({ boxShadow: `0 0 12px ${hexToRgba(adminTheme.primary, 0.28)}` } as any)
                      : null),
                  },
                ]}
              />
            </View>
            <Text style={[styles.chartMonthText, { color: adminTheme.onSurfaceVariant }]}>{point.monthLabel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
