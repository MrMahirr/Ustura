import React from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View, type GestureResponderEvent } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';
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
      style={({ hovered }) => [
        styles.row,
        { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
        Platform.OS === 'web'
          ? [styles.webRowTransition, { cursor: onPress ? 'pointer' : 'default' } as any]
          : null,
      ]}>
      {({ hovered }) => (
        <>
          <View style={[styles.cell, styles.cellUser]}>
            <View style={styles.userInfo}>
              <View
                style={[
                  styles.avatarFrame,
                  {
                    borderColor: adminTheme.borderSubtle,
                    backgroundColor: adminTheme.cardBackgroundStrong,
                  },
                ]}>
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={[
                    styles.avatar,
                    Platform.OS === 'web' && user.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <View style={styles.userCopy}>
                <Text style={[styles.userName, { color: adminTheme.onSurface }]} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={[styles.userEmail, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.cell, styles.cellRole]}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: rolePalette.backgroundColor,
                  borderColor: rolePalette.borderColor,
                },
              ]}>
              <Text style={[styles.roleText, { color: rolePalette.color }]}>{user.role}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellSalon]}>
            <Text style={[styles.salonName, { color: adminTheme.onSurface }]} numberOfLines={1}>
              {user.salonName}
            </Text>
            <Text style={[styles.salonLocation, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]} numberOfLines={1}>
              {user.salonLocation}
            </Text>
          </View>

          <View style={[styles.cell, styles.cellStatus]}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: statusPalette.accent }]} />
              <Text style={[styles.statusText, { color: statusPalette.color }]}>{user.status}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellCapacity]}>
            {user.dailyCapacity ? (
              <View style={styles.occupancyWrap}>
                <View style={styles.occupancyHeader}>
                  <Text style={[styles.occupancyLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }]}>
                    Doluluk
                  </Text>
                  <Text style={[styles.occupancyValue, { color: adminTheme.primary }]}>
                    {formatOccupancy(user.dailyCapacity)}
                  </Text>
                </View>
                <View style={[styles.occupancyBar, { backgroundColor: adminTheme.cardBackgroundStrong }]}>
                  <View
                    style={[
                      styles.occupancyBarFill,
                      { width: `${occupancyRatio * 100}%`, backgroundColor: adminTheme.primary },
                    ]}
                  />
                </View>
              </View>
            ) : (
              <Text style={[styles.occupancyNa, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>N/A</Text>
            )}
          </View>

          <View style={[styles.cell, styles.cellActions]}>
            <View style={[styles.actionsRow, { opacity: hovered ? 1 : 0.18 }]}>
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
