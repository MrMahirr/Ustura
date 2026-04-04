import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

export default function WhyUs() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1240;
  const isTablet = width >= 720;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  const advantages = [
    { icon: 'event-available' as const, title: '7/24 Rezervasyon', desc: 'Istediginiz zaman, her yerden randevu alin.' },
    { icon: 'badge' as const, title: 'Berber Secimi', desc: 'Uzmanlar arasindan size en uygun olani secin.' },
    { icon: 'dashboard-customize' as const, title: 'Kolay Yonetim', desc: 'Randevularinizi tek bir yerden takip edin.' },
    { icon: 'notifications-active' as const, title: 'Anlik Bildirim', desc: 'Hatirlaticilar ile randevunuzu asla kacirmayin.' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surface,
          paddingVertical: layout.sectionPaddingVertical,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: isWide ? 'row' : 'column',
            gap: isWide ? 64 : 40,
          },
        ]}>
        <View
          style={[
            styles.textColumn,
            {
              flex: 1,
              paddingRight: isWide ? 32 : 0,
              alignItems: layout.isCompact ? 'center' : 'flex-start',
            },
          ]}>
          <Text style={[styles.label, { color: primary, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Avantajlar
          </Text>
          <Text style={[styles.headline, { color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Neden Ustura?
          </Text>
          <Text
            style={[
              styles.description,
              { color: onSurfaceVariant, textAlign: layout.isCompact ? 'center' : 'left' },
            ]}>
            Modern erkegin bakim rituelini teknolojiyle birlestiriyoruz. Zamaninizin degerini biliyor, size daha akici bir deneyim sunuyoruz.
          </Text>

          <View
            style={[
              styles.grid,
              {
                flexDirection: isTablet ? 'row' : 'column',
                justifyContent: isTablet ? 'space-between' : 'flex-start',
              },
            ]}>
            {advantages.map((adv, index) => (
              <Pressable
                key={index}
                style={[
                  styles.advCardPressable,
                  {
                    width: isTablet ? '48%' : '100%',
                  },
                ]}>
                {({ hovered, pressed }) => (
                  <View
                    style={[
                      styles.advCard,
                      {
                        backgroundColor: surfaceContainerLowest,
                        borderColor: hovered ? hexToRgba(primary, 0.22) : outlineVariant,
                        borderBottomColor: hovered ? primary : 'transparent',
                        transform: [{ translateY: hovered ? -4 : pressed ? -1 : 0 }],
                      },
                      Platform.OS === 'web'
                        ? ({
                            boxShadow: hovered
                              ? `0 16px 32px ${hexToRgba(primary, 0.10)}`
                              : '0 8px 24px rgba(27, 27, 32, 0.05)',
                          } as any)
                        : {
                            shadowColor: '#000000',
                            shadowOpacity: hovered ? 0.10 : 0.05,
                            shadowRadius: hovered ? 16 : 10,
                            shadowOffset: { width: 0, height: hovered ? 10 : 5 },
                            elevation: hovered ? 7 : 3,
                          },
                    ]}>
                    <View
                      style={[
                        styles.advIconWrap,
                        { backgroundColor: hovered ? hexToRgba(primary, 0.14) : surfaceContainerLow },
                      ]}>
                      <MaterialIcons name={adv.icon} size={24} color={primary} />
                    </View>
                    <Text style={[styles.advTitle, { color: onSurface }]}>{adv.title}</Text>
                    <Text style={[styles.advDesc, { color: onSurfaceVariant }]}>{adv.desc}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {isWide && (
          <View style={[styles.imageContainer, { flex: 0.95 }]}>
            <View
              style={[
                styles.imageFrame,
                { backgroundColor: surfaceContainerLow, borderColor: outlineVariant },
                Platform.OS === 'web'
                  ? ({
                      boxShadow:
                        theme === 'light'
                          ? '0 24px 54px rgba(27, 27, 32, 0.10)'
                          : '0 24px 54px rgba(0, 0, 0, 0.30)',
                    } as any)
                  : {
                      shadowColor: '#000000',
                      shadowOpacity: theme === 'light' ? 0.12 : 0.22,
                      shadowRadius: 24,
                      shadowOffset: { width: 0, height: 12 },
                      elevation: 10,
                    },
              ]}>
              <Image
                source={require('../../assets/images/landing/landing_why.png')}
                style={[styles.image, { opacity: theme === 'light' ? 0.92 : 0.62 }]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={
                  theme === 'light'
                    ? ['rgba(253, 251, 255, 0)', 'rgba(253, 251, 255, 0.18)', 'rgba(253, 251, 255, 0.82)']
                    : ['rgba(17, 17, 24, 0)', 'rgba(17, 17, 24, 0.16)', 'rgba(17, 17, 24, 0.92)']
                }
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <View style={[styles.outlineBox, { borderColor: primary, opacity: 0.2 }]} />
            <View
              style={[
                styles.quoteCard,
                {
                  backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(24, 24, 30, 0.92)',
                  borderColor: outlineVariant,
                },
                Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px)' } as any) : null,
              ]}>
              <Text style={[styles.quoteText, { color: onSurface }]}>
                Ustura, kaliteyi ve kolayligi bir araya getiren tek platform.
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
  },
  textColumn: {},
  label: {
    ...Typography.labelLg,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: {
    ...Typography.displayLg,
    lineHeight: 52,
    marginBottom: 32,
  },
  description: {
    ...Typography.bodyLg,
    fontSize: 18,
    marginBottom: 48,
    maxWidth: 760,
  },
  grid: {
    flexWrap: 'wrap',
    gap: 16,
  },
  advCardPressable: {
    width: '100%',
  },
  advCard: {
    padding: 24,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 3,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease, transform 220ms ease',
        } as any)
      : {}),
  },
  advIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  advTitle: {
    ...Typography.titleMd,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  advDesc: {
    ...Typography.bodyMd,
  },
  imageContainer: {
    position: 'relative',
    minHeight: 600,
  },
  imageFrame: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outlineBox: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 256,
    height: 256,
    borderWidth: 8,
    zIndex: -1,
  },
  quoteCard: {
    position: 'absolute',
    left: 48,
    right: 48,
    bottom: 40,
    padding: 32,
    borderWidth: 1,
    borderRadius: 18,
  },
  quoteText: {
    ...Typography.headlineLg,
    fontSize: 24,
    fontStyle: 'italic',
  },
});
