import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

export default function Footer() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1200;

  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const footerLinks = [
    { href: '/(public)/kullanim-kosullari' as const, label: 'Kullanim Kosullari' },
    { href: '/(public)/gizlilik-politikasi' as const, label: 'Gizlilik Politikasi' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceContainerLow,
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
            alignItems: isWide ? 'center' : 'flex-start',
          },
        ]}>
        <View
          style={[
            styles.brandSection,
            {
              alignItems: isWide ? 'center' : 'flex-start',
              flexDirection: isWide ? 'row' : 'column',
            },
          ]}>
          <Text style={[styles.logo, { color: primary }]}>Ustura</Text>
          <Text style={[styles.description, { color: onSurface }]}>
            Geleneksel berberligi dijital kolaylikla birlestiren modern bakim platformu.
          </Text>
        </View>

        <View style={[styles.linksSection, { justifyContent: isWide ? 'center' : 'flex-start' }]}>
          {footerLinks.map((linkItem) => (
            <Link key={linkItem.href} href={linkItem.href} asChild>
              <Pressable style={styles.footerLinkPressable}>
                {({ hovered }) => (
                  <Text style={[styles.link, { color: hovered ? primary : onSurfaceVariant }]}>
                    {linkItem.label}
                  </Text>
                )}
              </Pressable>
            </Link>
          ))}
        </View>

        <View style={[styles.copySection, { alignItems: isWide ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.copyright, { color: onSurfaceVariant, textAlign: isWide ? 'right' : 'left' }]}>
            (c) 2026 Ustura. Tum haklari saklidir.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 28,
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
    fontSize: 36,
    marginRight: 20,
    marginBottom: 12,
  },
  description: {
    ...Typography.bodyMd,
    maxWidth: 360,
  },
  linksSection: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  footerLinkPressable: {
    paddingVertical: 4,
  },
  link: {
    ...Typography.bodyLg,
    ...(Platform.OS === 'web'
      ? ({ cursor: 'pointer', transition: 'color 220ms ease' } as any)
      : {}),
  },
  copySection: {
    flex: 1,
  },
  copyright: {
    ...Typography.labelMd,
  },
});
