import React from 'react';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export default function PromoBanner() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const layout = getLandingLayout(width);

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const features = [
    {
      icon: 'schedule' as const,
      title: 'Zaman Kaybetme',
      desc: 'Sira beklemeden, diledigin saatte randevunu saniyeler icinde olustur.',
    },
    {
      icon: 'content-cut' as const,
      title: 'Berberini Sec',
      desc: 'Uzman kadroyu incele, yorumlari oku ve sana en uygun ustayi sec.',
    },
    {
      icon: 'verified' as const,
      title: 'Aninda Onayla',
      desc: 'Telefon trafigine girmeden onayli randevunun keyfini cikar.',
    },
  ];

  return (
    <View
      style={[
        { backgroundColor: surface, paddingHorizontal: layout.horizontalPadding },
        Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
      ]}>
      <View
        className="relative overflow-hidden border-y px-8 py-20"
        style={[
          { backgroundColor: surfaceContainerLow, borderColor: outlineVariant },
          Platform.OS === 'web'
            ? ({ transition: 'background-color 360ms ease, border-color 360ms ease' } as any)
            : null,
        ]}>
        <View className="absolute right-[-128px] top-[-128px] h-64 w-64 rounded-full opacity-5" style={{ backgroundColor: primary }} />

        <View className="relative z-10 w-full self-center" style={{ maxWidth: layout.contentMaxWidth }}>
          <View className="mb-16 items-center">
            <Text className="mb-4 text-center font-headline text-5xl font-bold" style={{ color: onSurface }}>
              Neden Ustura Kullanmalisin?
            </Text>
            <Text className="text-center font-body text-lg" style={{ color: onSurfaceVariant }}>
              Bakimli olmanin en modern ve hizli yoluyla tanisin.
            </Text>
          </View>

          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 48 }}>
            {features.map((feature) => (
              <View
                key={feature.title}
                className="items-center rounded-xl border p-6"
                style={{
                  flex: isDesktop ? 1 : undefined,
                  borderColor: outlineVariant,
                  backgroundColor: surface,
                }}>
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-xl" style={{ backgroundColor: hexToRgba(primary, 0.08) }}>
                  <MaterialIcons name={feature.icon} size={32} color={primary} />
                </View>
                <Text className="mb-4 text-center font-body text-2xl font-bold" style={{ color: onSurface }}>
                  {feature.title}
                </Text>
                <Text className="text-center font-body text-base" style={{ color: onSurfaceVariant, lineHeight: 22 }}>
                  {feature.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
