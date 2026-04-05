import React from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View, type GestureResponderEvent } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { userClassNames } from './presentation';
import UserActionIcon from './UserActionIcon';
import { formatOccupancy, getOccupancyRatio, getRolePalette, getStatusPalette, getUserActions } from './utils';

export default function UserRow({ user, onPress }: { user: UserRecord; onPress?: () => void }) {
  const adminTheme = useSuperAdminTheme();
  const rolePalette = getRolePalette(user.role, adminTheme);
  const statusPalette = getStatusPalette(user.status, adminTheme);
  const actions = getUserActions(user.role, user.status, adminTheme);
  const occupancyRatio = getOccupancyRatio(user.dailyCapacity);
  const handleActionPress = (event: GestureResponderEvent, isDetailAction: boolean) => {
    event.stopPropagation();

    if (isDetailAction) {
      onPress?.();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="min-h-24 flex-row items-center px-6"
      style={({ hovered }) => [
        { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease',
              cursor: onPress ? 'pointer' : 'default',
            } as any)
          : null,
      ]}>
      {({ hovered }) => (
        <>
          <View className={userClassNames.cell} style={{ flex: 2.55 }}>
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
          </View>

          <View className={userClassNames.cell} style={{ flex: 1.05, paddingRight: 16 }}>
            <View
              className={userClassNames.roleBadge}
              style={{ backgroundColor: rolePalette.backgroundColor, borderColor: rolePalette.borderColor }}>
              <Text className={userClassNames.roleText} style={{ color: rolePalette.color }}>
                {user.role}
              </Text>
            </View>
          </View>

          <View className={userClassNames.cell} style={{ flex: 1.65, paddingRight: 18 }}>
            <Text className={userClassNames.salonName} style={{ color: adminTheme.onSurface }} numberOfLines={1}>
              {user.salonName}
            </Text>
            <Text className={userClassNames.salonLocation} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }} numberOfLines={1}>
              {user.salonLocation}
            </Text>
          </View>

          <View className={userClassNames.cell} style={{ flex: 1, paddingRight: 16 }}>
            <View className={userClassNames.statusRow}>
              <View className={userClassNames.statusDot} style={{ backgroundColor: statusPalette.accent }} />
              <Text className={userClassNames.statusText} style={{ color: statusPalette.color }}>
                {user.status}
              </Text>
            </View>
          </View>

          <View className={userClassNames.cell} style={{ flex: 1.25, paddingRight: 16 }}>
            {user.dailyCapacity ? (
              <View className={userClassNames.occupancyWrap}>
                <View className={userClassNames.occupancyHeader}>
                  <Text className={userClassNames.occupancyLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }}>
                    Doluluk
                  </Text>
                  <Text className={userClassNames.occupancyValue} style={{ color: adminTheme.primary }}>
                    {formatOccupancy(user.dailyCapacity)}
                  </Text>
                </View>
                <View className={userClassNames.occupancyBar} style={{ backgroundColor: adminTheme.cardBackgroundStrong }}>
                  <View className={userClassNames.occupancyBarFill} style={{ width: `${occupancyRatio * 100}%`, backgroundColor: adminTheme.primary }} />
                </View>
              </View>
            ) : (
              <Text className={userClassNames.occupancyNa} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
                N/A
              </Text>
            )}
          </View>

          <View className={cn(userClassNames.cell, 'items-end')} style={{ flex: 1.05 }}>
            <View className={userClassNames.actionsRow} style={{ opacity: hovered ? 1 : 0.18 }}>
              {actions.map((action) => (
                <UserActionIcon
                  key={`${user.id}-${action.icon}`}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                  onPress={(event) => handleActionPress(event, action.icon === 'visibility')}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
