import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfile } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { getRolePalette, getStatusPalette } from '@/components/panel/super-admin/users/utils';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

import UserProfileActionButton from './UserProfileActionButton';

export default function UserProfileHero({
  profile,
  isWide,
  isDisabled,
  onOpenSalon,
  onEdit,
  onDisable,
  onDelete,
}: {
  profile: UserProfile;
  isWide: boolean;
  isDisabled?: boolean;
  onOpenSalon?: () => void;
  onEdit?: () => void;
  onDisable?: () => void;
  onDelete?: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const rolePalette = getRolePalette(profile.user.role, adminTheme);
  const statusPalette = getStatusPalette(profile.user.status, adminTheme);

  return (
    <View className={cn('justify-between gap-6', isWide ? 'flex-row items-end' : 'flex-col items-start')}>
      <View className="flex-row flex-wrap items-center gap-6">
        <View className="relative h-44 w-44 shrink-0">
          <View
            className="h-full w-full overflow-hidden rounded-full border-4"
            style={{
              borderColor: adminTheme.surfaceContainerHigh,
              backgroundColor: adminTheme.cardBackgroundStrong,
            }}>
            <Image
              source={{ uri: profile.user.avatarUrl }}
              style={[
                { width: '100%', height: '100%' },
                Platform.OS === 'web' && profile.user.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
              ]}
              contentFit="cover"
            />
          </View>
          <View
            className="absolute bottom-3 right-3 h-6 w-6 rounded-full border-4"
            style={{
              backgroundColor: statusPalette.accent,
              borderColor: adminTheme.surface,
            }}
          />
        </View>

        <View className="min-w-[260px] flex-1 gap-2.5">
          <View className="flex-row flex-wrap items-center gap-3">
            <View
              className="min-h-[30px] items-center justify-center rounded-sm border px-3 py-1.5"
              style={{
                backgroundColor: rolePalette.backgroundColor,
                borderColor: rolePalette.borderColor,
              }}>
              <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: rolePalette.color, fontFamily: 'Manrope-Bold' }}>
                {profile.user.role}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
              <Text className="font-body text-[13px]" style={{ color: adminTheme.onSurfaceVariant }}>
                {profile.locationLabel}
              </Text>
            </View>
          </View>

          <Text className="font-headline text-[54px] leading-[60px] tracking-tighterest" style={{ color: adminTheme.onSurface }}>
            {profile.user.name}
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={!onOpenSalon}
            onPress={onOpenSalon}
            className="self-start flex-row items-center gap-2"
            style={({ hovered, pressed }) => [
              Platform.OS === 'web'
                ? ({
                    cursor: 'pointer',
                    transition: 'opacity 160ms ease, transform 180ms ease',
                  } as any)
                : null,
              {
                opacity: onOpenSalon ? 1 : 0.56,
                transform: [{ scale: pressed ? 0.99 : hovered ? 1.01 : 1 }],
              },
            ]}>
            <Text className="text-xl" style={{ color: adminTheme.primary, fontFamily: 'Manrope-SemiBold' }}>
              {profile.user.salonName}
            </Text>
            <MaterialIcons name="open-in-new" size={16} color={adminTheme.primary} />
          </Pressable>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-3">
        <UserProfileActionButton icon="edit" label="Duzenle" onPress={onEdit} />
        <UserProfileActionButton
          icon={isDisabled ? 'check-circle' : 'block'}
          label={isDisabled ? 'Aktif Et' : 'Durdur'}
          onPress={onDisable}
        />
        <UserProfileActionButton icon="delete" label="Sil" variant="danger" onPress={onDelete} />
      </View>
    </View>
  );
}
