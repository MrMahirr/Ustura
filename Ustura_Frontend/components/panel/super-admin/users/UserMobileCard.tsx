import React from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View, type GestureResponderEvent } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';
import UserActionIcon from './UserActionIcon';
import { formatOccupancy, getRolePalette, getStatusPalette, getUserActions } from './utils';

export default function UserMobileCard({ user, onPress }: { user: UserRecord; onPress?: () => void }) {
  const adminTheme = useSuperAdminTheme();
  const rolePalette = getRolePalette(user.role, adminTheme);
  const statusPalette = getStatusPalette(user.status, adminTheme);
  const actions = getUserActions(user.role, user.status, adminTheme);
  const handleActionPress = (event: GestureResponderEvent, isDetailAction: boolean) => {
    event.stopPropagation();

    if (isDetailAction) {
      onPress?.();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.mobileCard,
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
        Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as any) : null,
      ]}>
      <View style={styles.mobileCardTop}>
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

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusPalette.accent }]} />
          <Text style={[styles.statusText, { color: statusPalette.color }]}>{user.status}</Text>
        </View>
      </View>

      <View style={styles.mobileMetaGrid}>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Rol</Text>
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

        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Bagli Salon</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.onSurface }]}>{user.salonName}</Text>
          <Text style={[styles.mobileMetaSubValue, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>
            {user.salonLocation}
          </Text>
        </View>

        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
            Gunluk Randevu
          </Text>
          <Text style={[styles.mobileMetaValue, { color: user.dailyCapacity ? adminTheme.primary : adminTheme.onSurfaceVariant }]}>
            {formatOccupancy(user.dailyCapacity)}
          </Text>
        </View>
      </View>

      <View style={styles.mobileActions}>
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
    </Pressable>
  );
}
