import React from 'react';
import { View, Text, Image, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

type HeroSectionProps = {
  onRegisterPress?: () => void;
};

export default function HeroSection({ onRegisterPress }: HeroSectionProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = layout.isDesktop;
  const isCompact = layout.isCompact;
  const isTablet = layout.isTablet;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  return (
    <View
      className="relative min-h-[700px] justify-center overflow-hidden"
      style={[
        {
          backgroundColor: surface,
          paddingHorizontal: layout.horizontalPadding,
          paddingTop: isTablet ? 120 : 104,
          paddingBottom: width < 768 ? 56 : 72,
        },
        Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease, color 360ms ease' } as any) : null,
      ]}>
      <View
        className="absolute right-[-80px] top-[-120px] h-[420px] w-[420px] rounded-full"
        style={{ backgroundColor: hexToRgba(primary, theme === 'light' ? 0.12 : 0.08) }}
      />
      <View
        className="absolute bottom-20 left-[-100px] h-[260px] w-[260px] rounded-full"
        style={{ backgroundColor: hexToRgba(primary, theme === 'light' ? 0.06 : 0.05) }}
      />

      <View
        className="w-full self-center"
        style={{
          maxWidth: layout.contentMaxWidth,
          flexDirection: isDesktop ? 'row' : 'column',
          gap: isDesktop ? 48 : 40,
          alignItems: isDesktop ? 'center' : 'stretch',
        }}>
        <View
          className="z-10 w-full"
          style={{
            flex: isDesktop ? 7 : undefined,
            paddingRight: isDesktop ? 32 : 0,
            alignItems: isCompact ? 'center' : 'flex-start',
          }}>
          <Text
            className="mb-[18px] font-label text-base uppercase tracking-[4px]"
            style={{ color: primary, textAlign: isCompact ? 'center' : 'left' }}>
            MODERN BAKIM
          </Text>

          <Text
            className="mb-8 font-headline font-bold tracking-tighterest"
            style={[
              {
                color: onSurface,
                textAlign: isCompact ? 'center' : 'left',
                fontSize: width < 768 ? 48 : width < 1280 ? 64 : 76,
                lineHeight: width < 768 ? 56 : width < 1280 ? 72 : 84,
                maxWidth: isCompact ? 820 : 640,
              },
            ]}>
            Erkek Kuaforunde{'\n'}
            <Text style={{ color: primary }}>Randevu, Artik Kolayca.</Text>
          </Text>

          <Text
            className="mb-12 font-body"
            style={[
              {
                color: onSurfaceVariant,
                textAlign: isCompact ? 'center' : 'left',
                maxWidth: isCompact ? 760 : 600,
                fontSize: width < 768 ? 18 : 20,
                lineHeight: width < 768 ? 30 : 34,
              },
            ]}>
            Ustura ile en iyi berberleri kesfedin ve saniyeler icinde randevunuzu olusturun. Modern bakimin dijital adresi.
          </Text>

          <View
            className="w-full"
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              alignSelf: isCompact ? 'center' : 'flex-start',
              width: isDesktop ? 'auto' : '100%',
              maxWidth: isDesktop ? undefined : 420,
            }}>
            <Button
              title="Randevu Al"
              icon="calendar-month"
              interactionPreset="cta"
              onPress={() => router.push('/(public)/kuaforler')}
              style={isDesktop ? { marginRight: 16 } : { marginBottom: 16 }}
            />
            <Button
              title="Salonunu Kaydet"
              variant="outline"
              interactionPreset="outlineCta"
              onPress={onRegisterPress}
            />
          </View>
        </View>

        <View
          className="relative"
          style={{
            flex: isDesktop ? 5 : undefined,
            width: '100%',
            maxWidth: isDesktop ? undefined : 760,
            alignSelf: 'center',
          }}>
          <View
            style={[
              {
                width: '100%',
                aspectRatio: 1,
                borderRadius: 20,
                overflow: 'hidden',
                position: 'relative',
                borderWidth: 1,
              },
              {
                backgroundColor: surfaceContainerLow,
                borderColor: outlineVariant,
              },
              Platform.OS === 'web'
                ? ({
                    boxShadow:
                      theme === 'light'
                        ? '0 26px 60px rgba(27, 27, 32, 0.10)'
                        : '0 26px 60px rgba(0, 0, 0, 0.34)',
                  } as any)
                : {
                    shadowColor: '#000000',
                    shadowOpacity: theme === 'light' ? 0.12 : 0.24,
                    shadowRadius: 28,
                    shadowOffset: { width: 0, height: 12 },
                    elevation: 12,
                  },
            ]}>
            <Image
              source={require('../../assets/images/landing/hero-barber.png')}
              className="h-full w-full"
              style={{ opacity: theme === 'light' ? 0.96 : 0.72 }}
              resizeMode="cover"
            />

            <LinearGradient
              colors={
                theme === 'light'
                  ? ['rgba(253, 251, 255, 0)', 'rgba(253, 251, 255, 0.14)', 'rgba(253, 251, 255, 0.78)']
                  : ['rgba(17, 17, 24, 0)', 'rgba(17, 17, 24, 0.18)', 'rgba(17, 17, 24, 0.92)']
              }
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />

            <View
              style={[
                {
                  position: 'absolute',
                  borderRadius: 16,
                  borderWidth: 1,
                },
                {
                  backgroundColor:
                    theme === 'light'
                      ? 'rgba(255, 255, 255, 0.92)'
                      : Platform.OS === 'web'
                        ? 'rgba(53, 52, 58, 0.9)'
                        : surfaceContainerHighest,
                  borderColor: hexToRgba(primary, theme === 'light' ? 0.18 : 0.24),
                  left: width < 768 ? 20 : 32,
                  right: width < 768 ? 20 : 32,
                  bottom: width < 768 ? 20 : 32,
                  padding: width < 768 ? 20 : 24,
                },
                Platform.OS === 'web'
                  ? ({
                      boxShadow:
                        theme === 'light'
                          ? '0 18px 44px rgba(27, 27, 32, 0.14)'
                          : '0 18px 44px rgba(0, 0, 0, 0.26)',
                      backdropFilter: 'blur(18px)',
                    } as any)
                  : {
                      shadowColor: '#000000',
                      shadowOpacity: theme === 'light' ? 0.16 : 0.24,
                      shadowRadius: 22,
                      shadowOffset: { width: 0, height: 10 },
                      elevation: 10,
                    },
              ]}>
              <View className="mb-4 flex-row items-center">
                <Image
                  source={require('../../assets/images/landing/landing_avatar.png')}
                  style={{
                    width: width < 768 ? 36 : 40,
                    height: width < 768 ? 36 : 40,
                    marginRight: width < 768 ? 12 : 14,
                    borderRadius: 999,
                  }}
                />
                <View>
                  <Text className="font-label text-xs uppercase tracking-[1.2px]" style={{ color: primary }}>
                    USTA BERBER
                  </Text>
                  <Text className="font-body text-lg font-bold" style={{ color: onSurface }}>
                    Murat Yilmaz
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between gap-2">
                <View className="flex-1 items-center rounded-md py-2" style={{ backgroundColor: primary }}>
                  <Text className="font-label text-xs uppercase tracking-[1.2px]" style={{ color: onPrimary, fontFamily: 'Manrope-Bold' }}>
                    10:30
                  </Text>
                </View>
                <View
                  className="flex-1 items-center rounded-md py-2"
                  style={{ backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow }}>
                  <Text className="font-label text-xs uppercase tracking-[1.2px]" style={{ color: onSurfaceVariant }}>
                    11:00
                  </Text>
                </View>
                <View
                  className="flex-1 items-center rounded-md py-2"
                  style={{ backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow }}>
                  <Text className="font-label text-xs uppercase tracking-[1.2px]" style={{ color: onSurfaceVariant }}>
                    11:30
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
