import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { UserProfileQuickAction } from '@/components/panel/super-admin/user-profile/data';
import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function UserQuickActionsCard({
  actions,
}: {
  actions: UserProfileQuickAction[];
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={userProfileClassNames.panelCard}
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderTopWidth: 2,
          borderTopColor: adminTheme.borderStrong,
        },
        getUserProfilePanelShadow(adminTheme.theme),
      ]}>
      <Text className={userProfileClassNames.panelTitleSm} style={{ color: adminTheme.onSurface }}>
        Quick Actions
      </Text>

      <View className="gap-2.5">
        {actions.map((action) => (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            onPress={() => undefined}
            className="min-h-12 flex-row items-center justify-between gap-3 border px-4"
            style={({ hovered, pressed }) => [
              {
                backgroundColor: hovered ? adminTheme.primary : adminTheme.surfaceContainerHighest,
                borderColor: hovered ? adminTheme.primary : adminTheme.borderSubtle,
                transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
              },
            ]}>
            {({ hovered }) => (
              <>
                <Text className="font-label text-[10px] uppercase tracking-[2.1px]" style={{ color: hovered ? adminTheme.onPrimary : adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                  {action.label}
                </Text>
                <MaterialIcons name={action.icon} size={18} color={hovered ? adminTheme.onPrimary : adminTheme.onSurfaceVariant} />
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
