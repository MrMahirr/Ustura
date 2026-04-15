import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

const DEFAULT_SALON_IMAGE =
  'https://images.unsplash.com/photo-1512690459411-b0fd1c86b8e0?auto=format&fit=crop&w=400&q=80';

export interface SalonProfileHeroModel {
  name: string;
  address: string;
  city: string;
  district: string | null;
  isActive: boolean;
  photoUrl: string | null;
}

function buildLocationLabel(model: SalonProfileHeroModel): string {
  const parts = [model.address, model.district, model.city].filter(Boolean);
  return parts.join(' · ');
}

export default function SalonProfileHero({
  model,
  isWide,
  onGoBack,
}: {
  model: SalonProfileHeroModel;
  isWide: boolean;
  onGoBack: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const statusLabel = model.isActive ? 'AKTIF' : 'ASKIYA ALINDI';
  const imageUri = model.photoUrl?.trim() ? model.photoUrl : DEFAULT_SALON_IMAGE;

  return (
    <View className={salonProfileClassNames.heroSection}>
      <ActionButton label="Salon Listesine Don" style={{ alignSelf: 'flex-start' }} onPress={onGoBack} />

      <View className={cn('gap-6', isWide ? 'flex-row items-stretch' : 'flex-col')}>
        <View
          className="overflow-hidden rounded-xl border"
          style={{
            width: isWide ? 168 : '100%',
            height: isWide ? 168 : 200,
            borderColor: adminTheme.borderSubtle,
            backgroundColor: adminTheme.surfaceContainerLow,
          }}>
          <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
        </View>

        <View className={cn('min-w-0 flex-1 gap-[14px]', isWide ? 'justify-end' : undefined)}>
          <View className="flex-row flex-wrap items-center gap-3">
            <View
              className="rounded-full border px-3 py-[7px]"
              style={{
                backgroundColor: hexToRgba(model.isActive ? adminTheme.success : adminTheme.warning, 0.12),
                borderColor: hexToRgba(model.isActive ? adminTheme.success : adminTheme.warning, 0.26),
              }}>
              <Text
                className="font-label text-[10px] uppercase tracking-[2.2px]"
                style={{
                  color: model.isActive ? adminTheme.success : adminTheme.warning,
                  fontFamily: 'Manrope-Bold',
                }}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <Text
            className="font-headline text-[42px] leading-[50px] tracking-[-1.2px]"
            style={{ color: adminTheme.onSurface }}>
            {model.name}
          </Text>

          <View className="flex-row flex-wrap items-start gap-2">
            <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
            <Text
              className="max-w-[720px] font-label text-[11px] uppercase leading-5 tracking-[2.2px]"
              style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.88), fontFamily: 'Manrope-SemiBold' }}>
              {buildLocationLabel(model)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
