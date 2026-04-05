import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

function HeaderCtaButton() {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ hovered, pressed }) => [
        styles.ctaWrap,
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
        style={styles.cta}>
        <MaterialIcons name="person-add" size={18} color={adminTheme.onPrimary} />
        <Text style={[styles.ctaText, { color: adminTheme.onPrimary }]}>Yeni Kullanici Ekle</Text>
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
      style={[
        styles.headerSection,
        {
          flexDirection: isWide ? 'row' : 'column',
          alignItems: isWide ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View style={styles.headerCopy}>
        <Text style={[styles.title, { color: adminTheme.onSurface }]}>Kullanicilar</Text>
        <Text style={[styles.description, { color: adminTheme.onSurfaceVariant }]}>{description}</Text>
      </View>
      <HeaderCtaButton />
    </View>
  );
}
