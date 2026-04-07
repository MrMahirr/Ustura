import React from 'react';
import { Platform, Text, View } from 'react-native';

import type { UserProfileEarningsPoint } from '@/components/panel/super-admin/user-profile/data';
import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function UserEarningsSection({
  series,
}: {
  series: UserProfileEarningsPoint[];
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={userProfileClassNames.panelCard}
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
        },
        getUserProfilePanelShadow(adminTheme.theme),
      ]}>
      <View className="flex-row flex-wrap items-end justify-between gap-4">
        <View className={userProfileClassNames.panelHeaderCopy}>
          <Text className={userProfileClassNames.panelTitle} style={{ color: adminTheme.onSurface }}>
            Earnings Over Time
          </Text>
          <Text className={userProfileClassNames.panelSubtitle} style={{ color: adminTheme.onSurfaceVariant }}>
            Revenue trends for the last 6 months
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: adminTheme.primary }} />
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              Revenue
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: adminTheme.surfaceContainerHighest }} />
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
              Average
            </Text>
          </View>
        </View>
      </View>

      <View className="h-[260px] flex-row items-end justify-between gap-2 pt-3">
        {series.map((point) => (
          <View key={point.id} className="flex-1 items-center gap-3">
            <View className="relative h-[200px] w-full justify-end overflow-hidden" style={{ backgroundColor: adminTheme.surfaceContainerHighest }}>
              <View
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${point.averageLevel}%`,
                  backgroundColor: hexToRgba(adminTheme.surfaceContainerHighest, 0.92),
                }}
              />
              <View
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${point.revenueLevel}%`,
                  backgroundColor: hexToRgba(adminTheme.primary, 0.32),
                }}
              />
              <View
                className="absolute bottom-0 left-0 right-0"
                style={[
                  {
                    height: `${Math.max(point.revenueLevel - 8, 20)}%`,
                    backgroundColor: adminTheme.primary,
                  },
                  adminTheme.theme === 'dark' && Platform.OS === 'web'
                    ? ({ boxShadow: `0 0 12px ${hexToRgba(adminTheme.primary, 0.28)}` } as any)
                    : null,
                ]}
              />
            </View>
            <Text className="font-label text-[10px] uppercase tracking-[1.8px]" style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
              {point.monthLabel}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
