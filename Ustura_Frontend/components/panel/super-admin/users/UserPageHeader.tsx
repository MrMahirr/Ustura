import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { userClassNames } from './presentation';

function HeaderCtaButton() {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      className={userClassNames.ctaWrap}
      style={({ hovered, pressed }) => [
        { transform: [{ scale: pressed ? 0.985 : hovered ? 1.015 : 1 }] },
        Platform.OS === 'web'
          ? ({
              transition: 'transform 180ms ease, box-shadow 220ms ease',
              boxShadow: hovered
                ? `0 18px 36px ${hexToRgba(adminTheme.primary, 0.22)}`
                : `0 10px 24px ${hexToRgba(adminTheme.primary, 0.14)}`,
            } as any)
          : null,
      ]}>
      <LinearGradient
        colors={adminTheme.goldGradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={userClassNames.cta}>
        <MaterialIcons name="person-add" size={18} color={adminTheme.onPrimary} />
        <Text className={userClassNames.ctaText} style={{ color: adminTheme.onPrimary }}>
          Yeni Kullanici Ekle
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function UserPageHeader({
  isWide,
  selectedViewMode,
}: {
  isWide: boolean;
  selectedViewMode: UserViewMode;
}) {
  const adminTheme = useSuperAdminTheme();
  const description =
    selectedViewMode === 'salons'
      ? 'Salonlar bazinda personel dagilimini, uzmanlik alanlarini ve gercek zamanli doluluk durumlarini yonetin.'
      : 'Platform genelindeki tum yonetici, calisan ve salon sahiplerini tek akista yonetin.';

  return (
    <View
      className={cn(userClassNames.headerSection, isWide ? 'flex-row items-end' : 'flex-col items-start')}>
      <View className={userClassNames.headerCopy}>
        <Text className={userClassNames.title} style={{ color: adminTheme.onSurface }}>
          Kullanicilar
        </Text>
        <Text className={userClassNames.description} style={{ color: adminTheme.onSurfaceVariant }}>
          {description}
        </Text>
      </View>
      <HeaderCtaButton />
    </View>
  );
}
