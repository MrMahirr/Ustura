import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import type { UserProfileMetric } from '@/components/panel/super-admin/user-profile/data';
import { userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

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
      className="min-h-[168px] gap-3.5 border-l-2 p-6"
      style={[
        {
          width: basis as any,
          backgroundColor: hexToRgba(adminTheme.cardBackground, 0.72),
          borderLeftColor: hexToRgba(adminTheme.primary, 0.3),
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(12px)',
              boxShadow:
                adminTheme.theme === 'dark'
                  ? '0 16px 34px rgba(0, 0, 0, 0.22)'
                  : '0 16px 34px rgba(27, 27, 32, 0.06)',
              transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, opacity 180ms ease',
            } as any)
          : {
              shadowColor: '#000000',
              shadowOpacity: adminTheme.theme === 'dark' ? 0.16 : 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            },
      ]}>
      <Text className={userProfileClassNames.labelText} style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
        {metric.label}
      </Text>

      <View className="flex-row flex-wrap items-end gap-2">
        <Text className="text-[40px] leading-[44px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
          {metric.value}
        </Text>
        {metric.accentLabel ? (
          <Text className="text-[11px] uppercase tracking-ui" style={{ color: accentColor, fontFamily: 'Manrope-Bold' }}>
            {metric.accentLabel}
          </Text>
        ) : null}
      </View>

      {metric.kind === 'rating' ? (
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="star" size={18} color={adminTheme.primary} />
          <Text className={userProfileClassNames.panelSubtitle} style={{ color: adminTheme.onSurfaceVariant }}>
            {metric.note}
          </Text>
        </View>
      ) : (
        <Text className={userProfileClassNames.panelSubtitle} style={{ color: adminTheme.onSurfaceVariant }}>
          {metric.note}
        </Text>
      )}

      {typeof metric.progress === 'number' ? (
        <View className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: adminTheme.surfaceContainerHighest }}>
          <View
            className="h-full rounded-full"
            style={[
              {
                width: `${metric.progress}%`,
                backgroundColor: adminTheme.primary,
              },
              Platform.OS === 'web' ? ({ boxShadow: `0 0 10px ${hexToRgba(adminTheme.primary, 0.4)}` } as any) : null,
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}
