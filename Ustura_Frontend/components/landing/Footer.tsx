import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

export default function Footer() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1200;

  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surface,
          borderTopColor: outlineVariant,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: isWide ? 'row' : 'column',
            alignItems: 'center',
          },
        ]}>
        <View style={[styles.brandSection, { alignItems: isWide ? 'flex-start' : 'center' }]}>
          <Text style={[styles.logo, { color: primary }]}>Ustura</Text>
          <Text
            style={[
              styles.description,
              {
                color: onSurfaceVariant,
                textAlign: isWide ? 'left' : 'center',
              },
            ]}>
            Geleneksel berberligi dijital kolaylikla birlestiren modern bakim platformu.
          </Text>
        </View>

        <View style={styles.linksSection}>
          <Text style={[styles.link, { color: onSurfaceVariant }]}>Kullanim Kosullari</Text>
          <Text style={[styles.link, { color: onSurfaceVariant }]}>Gizlilik Politikasi</Text>
          <Text style={[styles.link, { color: onSurfaceVariant }]}>Iletisim</Text>
          <Text style={[styles.link, { color: onSurfaceVariant }]}>Sikca Sorulan Sorular</Text>
        </View>

        <View style={[styles.copySection, { alignItems: isWide ? 'flex-end' : 'center' }]}>
          <Text style={[styles.copyright, { color: onSurfaceVariant, textAlign: isWide ? 'right' : 'center' }]}>
            (c) 2024 USTURA. TUM HAKLARI SAKLIDIR.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 64,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  brandSection: {
    flex: 1,
  },
  logo: {
    ...Typography.headlineLg,
    marginBottom: 16,
  },
  description: {
    ...Typography.bodyMd,
    maxWidth: 320,
  },
  linksSection: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  link: {
    ...Typography.bodyLg,
    ...(Platform.OS === 'web' && { cursor: 'pointer' } as any),
  },
  copySection: {
    flex: 1,
  },
  copyright: {
    ...Typography.labelMd,
  },
});
