import React from 'react';
import { Image, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

import type { StorefrontTeamItem } from './presentation';

interface StorefrontTeamCardProps {
  member: StorefrontTeamItem;
  isDesktop: boolean;
}

export default function StorefrontTeamCard({
  member,
  isDesktop,
}: StorefrontTeamCardProps) {
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  const isPlaceholder = member.roleKey === 'placeholder';
  const badgeBackground =
    member.roleKey === 'barber'
      ? hexToRgba(primary, 0.14)
      : member.roleKey === 'receptionist'
        ? hexToRgba(onSurface, 0.08)
        : hexToRgba(primary, 0.08);
  const badgeTextColor =
    member.roleKey === 'barber' ? primary : isPlaceholder ? onSurfaceVariant : onSurface;

  return (
    <View
      className="rounded-[26px] border p-5"
      style={{
        backgroundColor: surfaceContainerLow,
        borderColor: hexToRgba(primary, 0.16),
        width: isDesktop ? '48%' : '100%',
      }}>
      <View className="flex-row items-center gap-4">
        {member.photoUrl ? (
          <Image
            source={{ uri: member.photoUrl }}
            resizeMode="cover"
            style={{ width: 72, height: 72, borderRadius: 22 }}
          />
        ) : (
          <View
            className="h-[72px] w-[72px] items-center justify-center rounded-[22px]"
            style={{ backgroundColor: hexToRgba(primary, 0.14) }}>
            <Text
              className="font-headline text-xl font-bold"
              style={{ color: primary }}>
              {member.initials}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <View
            className="self-start rounded-full px-3 py-1"
            style={{ backgroundColor: badgeBackground }}>
            <Text
              className="font-label text-[11px] uppercase tracking-[1.4px]"
              style={{ color: badgeTextColor }}>
              {member.roleLabel}
            </Text>
          </View>

          <Text
            className="mt-3 font-headline text-[22px] font-bold"
            style={{ color: onSurface }}>
            {member.name}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-base leading-7" style={{ color: onSurfaceVariant }}>
        {member.bio}
      </Text>
    </View>
  );
}
