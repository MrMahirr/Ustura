import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { SalonProfile } from '@/components/panel/super-admin/salon-profile/data';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

export default function SalonProfileHero({
  profile,
  isWide,
  onGoBack,
}: {
  profile: SalonProfile;
  isWide: boolean;
  onGoBack: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const isActive = profile.salon.status === 'Aktif';

  return (
    <View className={salonProfileClassNames.heroSection}>
      <ActionButton label="Salon Listesine Don" style={{ alignSelf: 'flex-start' }} onPress={onGoBack} />

      <View className={cn('justify-between gap-5', isWide ? 'flex-row items-end' : 'flex-col items-start')}>
        <View className="max-w-[860px] flex-1 gap-[14px]">
          <View className="flex-row flex-wrap items-center gap-3">
            <View
              className="rounded-full border px-3 py-[7px]"
              style={{
                backgroundColor: hexToRgba(isActive ? adminTheme.success : adminTheme.warning, 0.12),
                borderColor: hexToRgba(isActive ? adminTheme.success : adminTheme.warning, 0.26),
              }}>
              <Text
                className="font-label text-[10px] uppercase tracking-[2.2px]"
                style={{ color: isActive ? adminTheme.success : adminTheme.warning, fontFamily: 'Manrope-Bold' }}>
                {profile.heroStatusLabel}
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="star" size={16} color={adminTheme.primary} />
              <Text className="font-body text-[13px]" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                {profile.ratingLabel} Rating
              </Text>
            </View>
          </View>

          <Text className="font-headline text-[54px] leading-[62px] tracking-[-1.8px]" style={{ color: adminTheme.onSurface }}>
            {profile.salon.name}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2">
            <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
            <Text
              className="font-label text-[11px] uppercase tracking-[2.2px]"
              style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.88), fontFamily: 'Manrope-SemiBold' }}>
              {profile.locationLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap items-center gap-3">
          <Button title="Detaylari Duzenle" variant="outline" interactionPreset="outlineCta" icon="edit" />
          <Button title="Canli Gorunum" interactionPreset="cta" icon="visibility" />
        </View>
      </View>
    </View>
  );
}
