import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

import type { PackageProfileData } from './use-package-profile';

export default function PackageProfileHero({
  profile,
  isWide,
  onGoBack,
}: {
  profile: PackageProfileData;
  isWide: boolean;
  onGoBack: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={cn('mb-8 flex-row justify-between gap-6', isWide ? 'items-end' : 'flex-col items-start')}>
      <View className="flex-1">
        <Pressable
          onPress={onGoBack}
          className="mb-8 flex-row items-center gap-2 self-start"
          style={({ hovered }) => [
            { opacity: hovered ? 0.8 : 1 },
            Platform.OS === 'web' ? ({ transition: 'opacity 150ms ease', cursor: 'pointer' } as any) : null,
          ]}>
          <MaterialIcons name="arrow-back" size={18} color={adminTheme.primary} />
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Paket Listesine Don
          </Text>
        </Pressable>

        <View className="gap-2.5">
          <View className="flex-row items-center gap-3">
            <Text className="font-label text-xs uppercase tracking-[4px]" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              PAKET YONETIMI
            </Text>
            {profile.isFeatured && (
              <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.1) }}>
                 <Text className="font-label text-[9px] uppercase tracking-widest" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                   VITRIN PAKETI
                 </Text>
              </View>
            )}
          </View>
          <Text className="font-headline text-[38px] tracking-[-0.8px]" style={{ color: adminTheme.onSurface }}>
            {profile.name} Profili
          </Text>
          <Text className="max-w-[480px] font-body text-base leading-relaxed" style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
            Bu sayfada paketin ozelliklerini ve fiyatlandirmasini duzenleyebilir, aktif abonelik durumlarini inceleyebilirsiniz.
          </Text>
        </View>
      </View>
    </View>
  );
}
