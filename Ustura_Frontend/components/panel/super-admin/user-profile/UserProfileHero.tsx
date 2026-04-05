import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfile } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { getRolePalette, getStatusPalette } from '@/components/panel/super-admin/users/utils';
import { hexToRgba } from '@/utils/color';

import UserProfileActionButton from './UserProfileActionButton';
import { styles } from './styles';

export default function UserProfileHero({
  profile,
  isWide,
  onOpenSalon,
}: {
  profile: UserProfile;
  isWide: boolean;
  onOpenSalon?: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const rolePalette = getRolePalette(profile.user.role, adminTheme);
  const statusPalette = getStatusPalette(profile.user.status, adminTheme);

  return (
    <View
      style={[
        styles.heroSection,
        {
          flexDirection: isWide ? 'row' : 'column',
          alignItems: isWide ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View style={styles.heroMain}>
        <View style={styles.heroAvatarWrap}>
          <View
            style={[
              styles.heroAvatarFrame,
              {
                borderColor: adminTheme.surfaceContainerHigh,
                backgroundColor: adminTheme.cardBackgroundStrong,
              },
            ]}>
            <Image
              source={{ uri: profile.user.avatarUrl }}
              style={[
                styles.heroAvatar,
                Platform.OS === 'web' && profile.user.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
              ]}
              contentFit="cover"
            />
          </View>
          <View
            style={[
              styles.heroStatusDot,
              {
                backgroundColor: statusPalette.accent,
                borderColor: adminTheme.surface,
              },
            ]}
          />
        </View>

        <View style={styles.heroCopy}>
          <View style={styles.heroMetaRow}>
            <View
              style={[
                styles.heroRoleBadge,
                {
                  backgroundColor: rolePalette.backgroundColor,
                  borderColor: rolePalette.borderColor,
                },
              ]}>
              <Text style={[styles.heroRoleText, { color: rolePalette.color }]}>{profile.user.role}</Text>
            </View>

            <View style={styles.heroLocationRow}>
              <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
              <Text style={[styles.heroLocationText, { color: adminTheme.onSurfaceVariant }]}>{profile.locationLabel}</Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: adminTheme.onSurface }]}>{profile.user.name}</Text>

          <Pressable
            accessibilityRole="button"
            disabled={!onOpenSalon}
            onPress={onOpenSalon}
            style={({ hovered, pressed }) => [
              styles.heroSalonLink,
              {
                opacity: onOpenSalon ? 1 : 0.56,
                transform: [{ scale: pressed ? 0.99 : hovered ? 1.01 : 1 }],
              },
            ]}>
            <Text style={[styles.heroSalonText, { color: adminTheme.primary }]}>{profile.user.salonName}</Text>
            <MaterialIcons name="open-in-new" size={16} color={adminTheme.primary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.heroActions}>
        <UserProfileActionButton icon="edit" label="Edit" onPress={() => undefined} />
        <UserProfileActionButton icon="block" label="Disable" onPress={() => undefined} />
        <UserProfileActionButton icon="delete" label="Delete" variant="danger" onPress={() => undefined} />
      </View>
    </View>
  );
}
