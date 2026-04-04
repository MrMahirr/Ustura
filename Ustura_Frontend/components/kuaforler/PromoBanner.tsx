import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';
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
        styles.section,
        {
          backgroundColor: surface,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View style={[styles.container, { backgroundColor: surfaceContainerLow, borderColor: outlineVariant }]}>
        <View style={[styles.blurBlob, { backgroundColor: primary }]} />

        <View style={[styles.content, { maxWidth: layout.contentMaxWidth }]}>
          <View style={styles.header}>
            <Text style={[styles.headline, { color: onSurface }]}>Neden Ustura Kullanmalisin?</Text>
            <Text style={[styles.description, { color: onSurfaceVariant }]}>
              Bakimli olmanin en modern ve hizli yoluyla tanisin.
            </Text>
          </View>

          <View style={[styles.grid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {features.map((feat, index) => (
              <View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    flex: isDesktop ? 1 : undefined,
                    borderColor: outlineVariant,
                    backgroundColor: surface,
                  },
                ]}>
                <View style={[styles.iconWrapper, { backgroundColor: hexToRgba(primary, 0.08) }]}>
                  <MaterialIcons name={feat.icon} size={32} color={primary} />
                </View>
                <Text style={[styles.featTitle, { color: onSurface }]}>{feat.title}</Text>
                <Text style={[styles.featDesc, { color: onSurfaceVariant }]}>{feat.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    ...(Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : {}),
  },
  container: {
    position: 'relative',
    paddingVertical: 80,
    paddingHorizontal: 32,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, border-color 360ms ease' } as any)
      : {}),
  },
  blurBlob: {
    position: 'absolute',
    top: -128,
    right: -128,
    width: 256,
    height: 256,
    borderRadius: 128,
    opacity: 0.05,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  headline: {
    ...Typography.displayMd,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...Typography.bodyLg,
    textAlign: 'center',
  },
  grid: {
    gap: 48,
  },
  featureCard: {
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featTitle: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  featDesc: {
    ...Typography.bodyMd,
    textAlign: 'center',
    lineHeight: 22,
  },
});
