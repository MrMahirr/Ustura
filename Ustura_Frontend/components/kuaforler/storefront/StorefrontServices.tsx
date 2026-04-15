import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

import type { StorefrontServiceItem } from './presentation';
import StorefrontSection from './StorefrontSection';

interface StorefrontServicesProps {
  services: StorefrontServiceItem[];
  isDesktop: boolean;
}

export default function StorefrontServices({
  services,
  isDesktop,
}: StorefrontServicesProps) {
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <StorefrontSection
      eyebrow="Hizmet kurgusu"
      title="Salonun sundugu hizmetler"
      description="Bu bolum salon panelinde tanimlanan aktif hizmetleri gosterir. Hizmet adi, sure, fiyat ve aciklama ayni katalog kaydindan beslenir.">
      <View
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: 14,
        }}>
        {services.map((service) => (
          <View
            key={service.id}
            className="rounded-[26px] border p-5"
            style={[
              {
                backgroundColor: surfaceContainerLow,
                borderColor: hexToRgba(primary, 0.16),
                width: isDesktop ? '48%' : '100%',
              },
              Platform.OS === 'web'
                ? ({
                    transition:
                      'background-color 360ms ease, border-color 360ms ease, transform 180ms ease',
                  } as any)
                : null,
            ]}>
            <View className="flex-row items-start justify-between gap-4">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: hexToRgba(primary, 0.14) }}>
                <MaterialIcons name={service.icon} size={22} color={primary} />
              </View>
              <View
                className="rounded-full border px-3 py-1"
                style={{ borderColor: hexToRgba(primary, 0.18) }}>
                <Text
                  className="font-label text-[10px] uppercase tracking-[1.8px]"
                  style={{ color: onSurfaceVariant }}>
                  {service.accent}
                </Text>
              </View>
            </View>

            <Text
              className="mt-5 font-headline text-[24px] font-bold"
              style={{ color: onSurface }}>
              {service.label}
            </Text>
            <Text
              className="mt-2 text-sm uppercase tracking-[1.8px]"
              style={{ color: primary }}>
              {service.duration}
            </Text>
            <Text
              className="mt-2 text-sm uppercase tracking-[1.8px]"
              style={{ color: onSurfaceVariant }}>
              {service.priceLabel}
            </Text>
            <Text
              className="mt-4 text-base leading-7"
              style={{ color: onSurfaceVariant }}>
              {service.description}
            </Text>
          </View>
        ))}
      </View>
    </StorefrontSection>
  );
}
