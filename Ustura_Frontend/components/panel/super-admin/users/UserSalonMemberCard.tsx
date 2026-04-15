import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { userClassNames } from './presentation';
import { getStatusPalette } from './utils';

export default function UserSalonMemberCard({
  user,
  basis,
  onPress,
  onMenuPress,
}: {
  user: UserRecord;
  basis: string;
  onPress?: () => void;
  onMenuPress?: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(user.status, adminTheme);
  const isMuted = user.status === 'Pasif' || user.status === 'Askida';

  return (
    <Pressable
      onPress={onPress}
      className={userClassNames.memberCard}
      style={({ hovered }) => [
        {
          width: basis as any,
          opacity: user.status === 'Aktif' ? 1 : user.status === 'Mesgul' ? 0.92 : 0.74,
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          ...(Platform.OS === 'web'
            ? ({
                boxShadow: hovered
                  ? `0 18px 34px ${hexToRgba('#000000', 0.18)}`
                  : `0 10px 24px ${hexToRgba('#000000', 0.12)}`,
                transition: 'transform 220ms ease, background-color 220ms ease, border-color 220ms ease, opacity 220ms ease, box-shadow 220ms ease',
                cursor: onPress ? 'pointer' : 'default',
              } as any)
            : null),
        },
      ]}>
      {({ hovered }) => (
        <>
          <View className={userClassNames.memberCardTop}>
            <View className={userClassNames.memberAvatarWrap}>
              <View
                className={userClassNames.memberAvatarFrame}
                style={{ borderColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundStrong }}>
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={[
                    { width: '100%', height: '100%' },
                    Platform.OS === 'web' && (user.mutedImage || isMuted)
                      ? ({ filter: hovered ? 'grayscale(0.2)' : 'grayscale(1)' } as any)
                      : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <View
                className={userClassNames.memberStatusDot}
                style={{ backgroundColor: statusPalette.accent, borderColor: adminTheme.cardBackground }}
              />
            </View>

            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onMenuPress?.();
              }}
              accessibilityRole="button"
              accessibilityLabel={`${user.name} diger islemler`}
              className={userClassNames.memberMenuButton}
              style={({ pressed }) => [
                {
                  backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                },
                Platform.OS === 'web'
                  ? ({
                      transition: 'background-color 160ms ease, transform 160ms ease',
                      cursor: 'pointer',
                    } as any)
                  : null,
              ]}>
              <MaterialIcons
                name="more-vert"
                size={20}
                color={hovered ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.38)}
              />
            </Pressable>
          </View>

          <View className={userClassNames.memberCopy}>
            <Text className={userClassNames.memberName} style={{ color: hovered ? adminTheme.primary : adminTheme.onSurface }} numberOfLines={1}>
              {user.name}
            </Text>
            <Text className={userClassNames.memberTitle} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }} numberOfLines={1}>
              {user.title}
            </Text>
          </View>

          <View className={userClassNames.memberSpecialtiesWrap} style={{ borderTopColor: adminTheme.borderSubtle }}>
            {user.specialties.map((specialty) => (
              <View
                key={`${user.id}-${specialty}`}
                className={userClassNames.memberSpecialtyPill}
                style={{ backgroundColor: adminTheme.cardBackgroundStrong }}>
                <Text className={userClassNames.memberSpecialtyText} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.9) }}>
                  {specialty}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </Pressable>
  );
}
