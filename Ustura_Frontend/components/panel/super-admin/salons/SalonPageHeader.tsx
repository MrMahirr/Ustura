import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

function HeaderCtaButton() {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      className="rounded-md"
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
        style={{ minHeight: 54, borderRadius: 8, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <MaterialIcons name="add-business" size={18} color={adminTheme.onPrimary} />
        <Text className="font-label text-xs uppercase tracking-widest" style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
          Yeni Salon Ekle
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function SalonPageHeader({ isWide }: { isWide: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={cn(salonClassNames.headerSection, isWide ? 'flex-row items-end' : 'flex-col items-start')}>
      <View className={salonClassNames.headerCopy}>
        <Text className={salonClassNames.eyebrow} style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          Yonetim Paneli
        </Text>
        <Text className={salonClassNames.title} style={{ color: adminTheme.onSurface }}>
          Salon Yonetimi
        </Text>
        <Text className={salonClassNames.description} style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
          Aktif salonlar, onay bekleyen basvurular ve paket segmentleri tek content yapisinda toplandi.
        </Text>
      </View>
      <HeaderCtaButton />
    </View>
  );
}
