import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import type { UserProfileMetric } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserMetricCard({
  metric,
  basis,
}: {
  metric: UserProfileMetric;
  basis: string;
}) {
  const adminTheme = useSuperAdminTheme();
  const accentColor = metric.accentTone === 'positive' ? adminTheme.success : adminTheme.onSurfaceVariant;

  return (
    <View
      style={[
        styles.metricCard,
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
        {
          width: basis as any,
          backgroundColor: hexToRgba(adminTheme.cardBackground, 0.72),
          borderLeftColor: hexToRgba(adminTheme.primary, 0.3),
          ...(Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(12px)',
                boxShadow:
                  adminTheme.theme === 'dark'
                    ? '0 16px 34px rgba(0, 0, 0, 0.22)'
                    : '0 16px 34px rgba(27, 27, 32, 0.06)',
              } as any)
            : {
                shadowColor: '#000000',
                shadowOpacity: adminTheme.theme === 'dark' ? 0.16 : 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              }),
        },
      ]}>
      <Text style={[styles.metricLabel, { color: adminTheme.onSurfaceVariant }]}>{metric.label}</Text>

      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: adminTheme.onSurface }]}>{metric.value}</Text>
        {metric.accentLabel ? <Text style={[styles.metricAccent, { color: accentColor }]}>{metric.accentLabel}</Text> : null}
      </View>

      {metric.kind === 'rating' ? (
        <View style={styles.metricRatingWrap}>
          <MaterialIcons name="star" size={18} color={adminTheme.primary} />
          <Text style={[styles.metricNote, { color: adminTheme.onSurfaceVariant }]}>{metric.note}</Text>
        </View>
      ) : (
        <Text style={[styles.metricNote, { color: adminTheme.onSurfaceVariant }]}>{metric.note}</Text>
      )}

      {typeof metric.progress === 'number' ? (
        <View style={[styles.metricProgressTrack, { backgroundColor: adminTheme.surfaceContainerHighest }]}>
          <View
            style={[
              styles.metricProgressBar,
              {
                width: `${metric.progress}%`,
                backgroundColor: adminTheme.primary,
                ...(Platform.OS === 'web'
                  ? ({ boxShadow: `0 0 10px ${hexToRgba(adminTheme.primary, 0.4)}` } as any)
                  : null),
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}
