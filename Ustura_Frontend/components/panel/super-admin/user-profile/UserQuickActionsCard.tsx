import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfileQuickAction } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import { styles } from './styles';

export default function UserQuickActionsCard({
  actions,
}: {
  actions: UserProfileQuickAction[];
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
          borderTopWidth: 2,
          borderTopColor: adminTheme.borderStrong,
          ...cardShadowStyle,
        },
      ]}>
      <Text style={[styles.panelTitleSm, { color: adminTheme.onSurface }]}>Quick Actions</Text>

      <View style={styles.quickActionsList}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            onPress={() => undefined}
            style={({ hovered, pressed }) => [
              styles.quickActionButton,
              {
                backgroundColor: hovered ? adminTheme.primary : adminTheme.surfaceContainerHighest,
                borderColor: hovered ? adminTheme.primary : adminTheme.borderSubtle,
                transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
              },
            ]}>
            {({ hovered }) => (
              <>
                <Text
                  style={[
                    styles.quickActionText,
                    { color: hovered ? adminTheme.onPrimary : adminTheme.onSurface },
                  ]}>
                  {action.label}
                </Text>
                <MaterialIcons
                  name={action.icon}
                  size={18}
                  color={hovered ? adminTheme.onPrimary : adminTheme.onSurfaceVariant}
                />
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
