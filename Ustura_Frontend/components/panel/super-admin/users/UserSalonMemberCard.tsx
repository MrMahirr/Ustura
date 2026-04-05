import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { salonGroupedStyles as styles } from './salon-grouped.styles';
import { getStatusPalette } from './utils';

export default function UserSalonMemberCard({
  user,
  basis,
  onPress,
}: {
  user: UserRecord;
  basis: string;
  onPress?: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(user.status, adminTheme);
  const isMuted = user.status === 'Pasif' || user.status === 'Askida';

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }) => [
        styles.memberCard,
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
        {
          width: basis as any,
          opacity: user.status === 'Aktif' ? 1 : user.status === 'Mesgul' ? 0.92 : 0.74,
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          ...(Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as any) : null),
          ...(Platform.OS === 'web'
            ? ({
                boxShadow: hovered
                  ? `0 18px 34px ${hexToRgba('#000000', 0.18)}`
                  : `0 10px 24px ${hexToRgba('#000000', 0.12)}`,
              } as any)
            : null),
        },
      ]}>
      {({ hovered }) => (
        <>
          <View style={styles.memberCardTop}>
            <View style={styles.memberAvatarWrap}>
              <View
                style={[
                  styles.memberAvatarFrame,
                  {
                    borderColor: adminTheme.borderSubtle,
                    backgroundColor: adminTheme.cardBackgroundStrong,
                  },
                ]}>
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={[
                    styles.memberAvatar,
                    Platform.OS === 'web' && (user.mutedImage || isMuted)
                      ? ({ filter: hovered ? 'grayscale(0.2)' : 'grayscale(1)' } as any)
                      : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <View
                style={[
                  styles.memberStatusDot,
                  {
                    backgroundColor: statusPalette.accent,
                    borderColor: adminTheme.cardBackground,
                  },
                ]}
              />
            </View>

            <Pressable
              onPress={(event) => event.stopPropagation()}
              accessibilityRole="button"
              accessibilityLabel={`${user.name} diger islemler`}
              style={({ pressed }) => [
                styles.memberMenuButton,
                {
                  backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                },
              ]}>
              <MaterialIcons
                name="more-vert"
                size={20}
                color={hovered ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.38)}
              />
            </Pressable>
          </View>

          <View style={styles.memberCopy}>
            <Text style={[styles.memberName, { color: hovered ? adminTheme.primary : adminTheme.onSurface }]} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={[styles.memberTitle, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }]} numberOfLines={1}>
              {user.title}
            </Text>
          </View>

          <View style={[styles.memberSpecialtiesWrap, { borderTopColor: adminTheme.borderSubtle }]}>
            {user.specialties.map((specialty) => (
              <View
                key={`${user.id}-${specialty}`}
                style={[
                  styles.memberSpecialtyPill,
                  { backgroundColor: adminTheme.cardBackgroundStrong },
                ]}>
                <Text style={[styles.memberSpecialtyText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.9) }]}>
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
