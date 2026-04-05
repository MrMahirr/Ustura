import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfileActivity } from '@/components/panel/super-admin/user-profile/data';
import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function UserActivityLogCard({
  activities,
}: {
  activities: UserProfileActivity[];
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
      <Text className={userProfileClassNames.panelTitleSm} style={{ color: adminTheme.onSurface }}>
        Activity Log
      </Text>

      <View className="relative gap-[22px] pt-1">
        <View className="absolute bottom-2 left-[7px] top-2 w-[2px]" style={{ backgroundColor: hexToRgba(adminTheme.outlineVariant, 0.22) }} />

        {activities.map((item) => (
          <View key={item.id} className="relative gap-1 pl-7" style={item.subdued ? { opacity: 0.62 } : undefined}>
            <View
              className="absolute left-0 top-0.5 h-4 w-4 rounded-full border-4"
              style={[
                {
                  backgroundColor: item.highlighted ? adminTheme.primary : adminTheme.surfaceContainerHighest,
                  borderColor: adminTheme.surface,
                },
                item.highlighted && adminTheme.theme === 'dark' && Platform.OS === 'web'
                  ? ({ boxShadow: `0 0 8px ${hexToRgba(adminTheme.primary, 0.5)}` } as any)
                  : null,
              ]}
            />
            <Text className="font-body text-[13px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
              {item.title}
            </Text>
            <Text className="font-body text-[11px] leading-[18px]" style={{ color: adminTheme.onSurfaceVariant }}>
              {item.detail}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        className="mt-2 min-h-10 items-center justify-center"
        style={Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'opacity 160ms ease' } as any) : undefined}>
        <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
          View All Activities
        </Text>
      </Pressable>
    </View>
  );
}
