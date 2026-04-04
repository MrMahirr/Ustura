import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/typography';
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
      style={[
        styles.container,
        {
          backgroundColor: surface,
          paddingHorizontal: layout.horizontalPadding,
          paddingTop: isTablet ? 120 : 104,
          paddingBottom: width < 768 ? 56 : 72,
        },
      ]}>
      <View style={[styles.glowPrimary, { backgroundColor: hexToRgba(primary, theme === 'light' ? 0.12 : 0.08) }]} />
      <View style={[styles.glowSecondary, { backgroundColor: hexToRgba(primary, theme === 'light' ? 0.06 : 0.05) }]} />

      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: isDesktop ? 48 : 40,
            alignItems: isDesktop ? 'center' : 'stretch',
          },
        ]}>
        <View
          style={[
            styles.textContent,
            {
              flex: isDesktop ? 7 : undefined,
              paddingRight: isDesktop ? 32 : 0,
              alignItems: isCompact ? 'center' : 'flex-start',
            },
          ]}>
          <Text style={[styles.eyebrow, { color: primary, textAlign: isCompact ? 'center' : 'left' }]}>
            MODERN BAKIM
          </Text>

          <Text
            style={[
              styles.headline,
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
            style={[
              styles.description,
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
            style={[
              styles.actionButtons,
              {
                flexDirection: isDesktop ? 'row' : 'column',
                alignSelf: isCompact ? 'center' : 'flex-start',
                width: isDesktop ? 'auto' : '100%',
                maxWidth: isDesktop ? undefined : 420,
              },
            ]}>
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
          style={[
            styles.imageContainer,
            {
              flex: isDesktop ? 5 : undefined,
              width: '100%',
              maxWidth: isDesktop ? undefined : 760,
              alignSelf: 'center',
            },
          ]}>
          <View
            style={[
              styles.imageWrapper,
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
              style={[styles.mainImage, { opacity: theme === 'light' ? 0.96 : 0.72 }]}
              resizeMode="cover"
            />

            <LinearGradient
              colors={
                theme === 'light'
                  ? ['rgba(253, 251, 255, 0)', 'rgba(253, 251, 255, 0.14)', 'rgba(253, 251, 255, 0.78)']
                  : ['rgba(17, 17, 24, 0)', 'rgba(17, 17, 24, 0.18)', 'rgba(17, 17, 24, 0.92)']
              }
              style={StyleSheet.absoluteFillObject}
            />

            <View
              style={[
                styles.mockupCard,
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
              <View style={styles.mockupHeader}>
                <Image
                  source={require('../../assets/images/landing/landing_avatar.png')}
                  style={styles.mockupAvatar}
                />
                <View>
                  <Text style={[styles.mockupLabel, { color: primary }]}>MASTER BARBER</Text>
                  <Text style={[styles.mockupName, { color: onSurface }]}>Murat Yilmaz</Text>
                </View>
              </View>

              <View style={styles.timeSlots}>
                <View style={[styles.timeSlot, { backgroundColor: primary }]}>
                  <Text style={[styles.timeText, { color: onPrimary, fontFamily: 'Manrope-Bold' }]}>10:30</Text>
                </View>
                <View
                  style={[
                    styles.timeSlot,
                    { backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow },
                  ]}>
                  <Text style={[styles.timeText, { color: onSurfaceVariant }]}>11:00</Text>
                </View>
                <View
                  style={[
                    styles.timeSlot,
                    { backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow },
                  ]}>
                  <Text style={[styles.timeText, { color: onSurfaceVariant }]}>11:30</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 700,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, color 360ms ease' } as any)
      : {}),
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  glowPrimary: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -120,
    right: -80,
  },
  glowSecondary: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: 80,
    left: -100,
  },
  textContent: {
    width: '100%',
    zIndex: 10,
  },
  eyebrow: {
    ...Typography.labelLg,
    letterSpacing: 4,
    marginBottom: 18,
  },
  headline: {
    ...Typography.displayLg,
    marginBottom: 32,
  },
  description: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Regular',
    marginBottom: 48,
  },
  actionButtons: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease' } as any)
      : {}),
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  mockupCard: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease' } as any)
      : {}),
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mockupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  mockupLabel: {
    ...Typography.labelSm,
  },
  mockupName: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Bold',
  },
  timeSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  timeSlot: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeText: {
    ...Typography.labelLg,
    fontSize: 12,
  },
});
