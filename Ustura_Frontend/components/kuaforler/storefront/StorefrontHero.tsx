import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import Button from '@/components/ui/Button';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

import type { SalonStorefrontViewModel } from './presentation';

interface StorefrontHeroProps {
  viewModel: SalonStorefrontViewModel;
  isDesktop: boolean;
  isTablet: boolean;
  onBackPress: () => void;
  onBookPress: () => void;
}

export default function StorefrontHero({
  viewModel,
  isDesktop,
  isTablet,
  onBackPress,
  onBookPress,
}: StorefrontHeroProps) {
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const primary = useThemeColor({}, 'primary');
  const { theme } = useAppTheme();

  const imageTiles = viewModel.gallery.slice(1);

  return (
    <View
      className="mb-8 overflow-hidden rounded-[34px] border"
      style={[
        {
          backgroundColor: surfaceContainerLow,
          borderColor: outlineVariant,
        },
        Platform.OS === 'web'
          ? ({
              boxShadow:
                theme === 'light'
                  ? `0 24px 64px ${hexToRgba(primary, 0.12)}`
                  : `0 24px 64px ${hexToRgba('#000000', 0.28)}`,
              transition:
                'background-color 360ms ease, border-color 360ms ease, box-shadow 240ms ease',
            } as any)
          : {
              shadowColor: primary,
              shadowOpacity: 0.12,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 8,
            },
      ]}>
      <LinearGradient
        colors={
          theme === 'light'
            ? [hexToRgba(primary, 0.18), hexToRgba('#FFFFFF', 0.04)]
            : [hexToRgba(primary, 0.2), hexToRgba('#0E0E13', 0.16)]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: isDesktop ? 28 : 20 }}>
        <View
          className="absolute"
          style={{
            top: -90,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: 999,
            backgroundColor: hexToRgba(primary, theme === 'light' ? 0.16 : 0.14),
          }}
        />

          <View
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: 'flex-start',
              gap: isDesktop ? 24 : 18,
            }}>
            <View style={{ flex: isDesktop ? 1.05 : undefined, width: isDesktop ? undefined : '100%' }}>
              <Pressable
                accessibilityRole="button"
                onPress={onBackPress}
                className="mb-1 self-start rounded-full border px-4 py-2"
                style={{
                  backgroundColor: hexToRgba(surfaceContainerHighest, 0.52),
                  borderColor: hexToRgba(primary, 0.22),
                }}>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="arrow-back-ios-new" size={14} color={onSurface} />
                  <Text
                    className="font-label text-[11px] uppercase tracking-[2px]"
                    style={{ color: onSurface }}>
                    Kuafor listesine don
                  </Text>
                </View>
              </Pressable>

              <View className="mb-4 flex-row flex-wrap gap-2">
                <View
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    backgroundColor: hexToRgba(primary, 0.14),
                    borderColor: hexToRgba(primary, 0.24),
                  }}>
                  <Text
                    className="font-label text-[11px] uppercase tracking-[2px]"
                    style={{ color: onSurface }}>
                    {viewModel.heroEyebrow}
                  </Text>
                </View>
                <View
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    backgroundColor: hexToRgba(surfaceContainerHighest, 0.72),
                    borderColor: hexToRgba(primary, 0.16),
                  }}>
                  <Text
                    className="font-label text-[11px] uppercase tracking-[2px]"
                    style={{ color: onSurfaceVariant }}>
                    {viewModel.location}
                  </Text>
                </View>
              </View>

              <Text
                className="font-headline text-[40px] font-bold leading-[46px]"
                style={{ color: onSurface }}>
                {viewModel.heroTitle}
              </Text>
              <Text
                className="mt-4 max-w-[680px] text-base leading-7"
                style={{ color: hexToRgba(onSurfaceVariant, 0.96) }}>
                {viewModel.heroDescription}
              </Text>

              <View
                className="mt-6 flex-row flex-wrap gap-3"
                style={{ maxWidth: isDesktop ? 680 : undefined }}>
                {viewModel.metrics.map((metric) => (
                  <View
                    key={metric.label}
                    className="min-w-[150px] flex-1 rounded-[24px] border px-4 py-4"
                    style={{
                      backgroundColor: hexToRgba(surfaceContainerHighest, 0.72),
                      borderColor: hexToRgba(primary, 0.16),
                    }}>
                    <Text
                      className="font-label text-[11px] uppercase tracking-[2px]"
                      style={{ color: onSurfaceVariant }}>
                      {metric.label}
                    </Text>
                    <Text
                      className="mt-2 font-headline text-[28px] font-bold"
                      style={{ color: onSurface }}>
                      {metric.value}
                    </Text>
                    <Text className="mt-1 text-sm leading-5" style={{ color: onSurfaceVariant }}>
                      {metric.helper}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="mt-6 flex-row flex-wrap gap-2">
                {viewModel.ambianceTags.map((tag) => (
                  <View
                    key={tag}
                    className="rounded-full border px-3 py-2"
                    style={{
                      backgroundColor: hexToRgba(surfaceContainerHighest, 0.58),
                      borderColor: hexToRgba(primary, 0.14),
                    }}>
                    <Text className="text-xs uppercase tracking-[1.4px]" style={{ color: onSurfaceVariant }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                className="mt-8"
                style={{
                  flexDirection: isTablet || isDesktop ? 'row' : 'column',
                  alignItems: isTablet || isDesktop ? 'center' : 'stretch',
                  gap: 12,
                }}>
                <Button
                  title="Bu salon icin randevu al"
                  interactionPreset="cta"
                  onPress={onBookPress}
                  style={{ minWidth: isDesktop ? 250 : undefined }}
                />
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="location-on" size={18} color={primary} />
                  <Text
                    className="text-sm leading-6"
                    style={{ color: onSurfaceVariant }}>
                    {viewModel.address}
                  </Text>
                </View>
              </View>

              <View className="mt-6">
                <Text
                  className="mb-4 font-label text-[11px] uppercase tracking-[2px]"
                  style={{ color: onSurfaceVariant }}>
                  Diger vitrin fotograflari
                </Text>

                <View
                  style={{
                    flexDirection: isDesktop ? 'row' : 'row',
                    gap: 12,
                  }}>
                  <View
                    className="overflow-hidden rounded-[24px]"
                    style={{ flex: 1, aspectRatio: isDesktop ? 1.18 : 0.95 }}>
                    <Image
                      source={{ uri: imageTiles[0]?.imageUrl }}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14 }}>
                      <Text className="font-label text-[11px] uppercase tracking-[1.6px]" style={{ color: '#F5F1E8' }}>
                        {imageTiles[0]?.title}
                      </Text>
                      <Text className="mt-1 text-xs leading-5" style={{ color: '#F5F1E8' }}>
                        {imageTiles[0]?.subtitle}
                      </Text>
                    </LinearGradient>
                  </View>

                  <View
                    className="overflow-hidden rounded-[24px]"
                    style={{ flex: 1, aspectRatio: isDesktop ? 1.18 : 0.95 }}>
                    <Image
                      source={{ uri: imageTiles[1]?.imageUrl }}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14 }}>
                      <Text className="font-label text-[11px] uppercase tracking-[1.6px]" style={{ color: '#F5F1E8' }}>
                        {imageTiles[1]?.title}
                      </Text>
                      <Text className="mt-1 text-xs leading-5" style={{ color: '#F5F1E8' }}>
                        {imageTiles[1]?.subtitle}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: isDesktop ? 0.95 : undefined,
                width: isDesktop ? undefined : '100%',
              }}>
              <Text
                className="mb-4 font-label text-[11px] uppercase tracking-[2px]"
                style={{ color: onSurfaceVariant }}>
                Kapak fotografi
              </Text>
              <View className="overflow-hidden rounded-[28px]" style={{ aspectRatio: isDesktop ? 0.9 : 1.45 }}>
                <Image
                  source={{ uri: viewModel.gallery[0]?.imageUrl }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%' }}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.56)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18 }}>
                  <Text className="font-label text-xs uppercase tracking-[2px]" style={{ color: '#F5F1E8' }}>
                    {viewModel.gallery[0]?.title}
                  </Text>
                  <Text className="mt-2 text-sm leading-5" style={{ color: '#F5F1E8' }}>
                    {viewModel.gallery[0]?.subtitle}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>
      </LinearGradient>
    </View>
  );
}
