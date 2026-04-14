import React from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View, type GestureResponderEvent } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { userClassNames } from './presentation';
import UserActionIcon from './UserActionIcon';
import type { UserActionIconName } from './utils';
import { formatOccupancy, getRolePalette, getStatusPalette, getUserActions } from './utils';

export default function UserMobileCard({
  user,
  onPress,
  onActionPress,
}: {
  user: UserRecord;
  onPress?: () => void;
  onActionPress?: (icon: UserActionIconName) => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const rolePalette = getRolePalette(user.role, adminTheme);
  const statusPalette = getStatusPalette(user.status, adminTheme);
  const actions = getUserActions(user.role, user.status, adminTheme);
  const handleActionPress = (event: GestureResponderEvent, icon: UserActionIconName) => {
    event.stopPropagation();

    if (onActionPress) {
      onActionPress(icon);
      return;
    }

    if (icon === 'visibility') {
      onPress?.();
    }
  };

  return (
    <View
      className={userClassNames.mobileCard}
      style={[
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
        Platform.OS === 'web' ? ({ overflow: 'hidden' } as const) : null,
      ]}>
      <Pressable
        onPress={onPress}
        style={Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as any) : null}>
        <View className={userClassNames.mobileCardTop}>
          <View className={userClassNames.userInfo}>
            <View
              className={userClassNames.avatarFrame}
              style={{ borderColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundStrong }}>
              <Image
                source={{ uri: user.avatarUrl }}
                style={[
                  { width: '100%', height: '100%' },
                  Platform.OS === 'web' && user.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
                ]}
                contentFit="cover"
              />
            </View>
            <View className={userClassNames.userCopy}>
              <Text className={userClassNames.userName} style={{ color: adminTheme.onSurface }} numberOfLines={1}>
                {user.name}
              </Text>
              <Text className={userClassNames.userEmail} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>

          <View className={userClassNames.statusRow}>
            <View className={userClassNames.statusDot} style={{ backgroundColor: statusPalette.accent }} />
            <Text className={userClassNames.statusText} style={{ color: statusPalette.color }}>
              {user.status}
            </Text>
          </View>
        </View>

        <View className={userClassNames.mobileMetaGrid}>
          <View className={userClassNames.mobileMetaItem}>
            <Text className={userClassNames.mobileMetaLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
              Rol
            </Text>
            <View
              className={userClassNames.roleBadge}
              style={{ backgroundColor: rolePalette.backgroundColor, borderColor: rolePalette.borderColor }}>
              <Text className={userClassNames.roleText} style={{ color: rolePalette.color }}>
                {user.role}
              </Text>
            </View>
          </View>

          <View className={userClassNames.mobileMetaItem}>
            <Text className={userClassNames.mobileMetaLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
              Bagli Salon
            </Text>
            <Text className={userClassNames.mobileMetaValue} style={{ color: adminTheme.onSurface }}>
              {user.salonName}
            </Text>
            <Text className={userClassNames.mobileMetaSubValue} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
              {user.salonLocation}
            </Text>
          </View>

          <View className={userClassNames.mobileMetaItem}>
            <Text className={userClassNames.mobileMetaLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
              Gunluk Randevu
            </Text>
            <Text className={userClassNames.mobileMetaValue} style={{ color: user.dailyCapacity ? adminTheme.primary : adminTheme.onSurfaceVariant }}>
              {formatOccupancy(user.dailyCapacity)}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className={userClassNames.mobileActions} style={Platform.OS === 'web' ? ({ zIndex: 2 } as const) : null}>
        {actions.map((action) => (
          <UserActionIcon
            key={`${user.id}-${action.icon}`}
            icon={action.icon}
            label={action.label}
            color={action.color}
            onPress={(event) => handleActionPress(event, action.icon)}
          />
        ))}
      </View>
    </View>
  );
}
