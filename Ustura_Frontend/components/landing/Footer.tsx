import React from 'react';
import { View, Text, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';
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
      className="border-t py-7"
      style={{
        marginTop: 'auto',
        backgroundColor: surfaceContainerLow,
        borderTopColor: outlineVariant,
        paddingHorizontal: layout.horizontalPadding,
      }}>
      <View
        className="w-full self-center justify-between gap-10"
        style={{
          maxWidth: layout.contentMaxWidth,
          flexDirection: isWide ? 'row' : 'column',
          alignItems: isWide ? 'center' : 'flex-start',
        }}>
        <View
          className="flex-1"
          style={{
            alignItems: isWide ? 'center' : 'flex-start',
            flexDirection: isWide ? 'row' : 'column',
          }}>
          <Text className="mb-3 mr-5 font-headline text-4xl" style={{ color: primary }}>
            Ustura
          </Text>
          <Text className="max-w-[360px] font-body text-base" style={{ color: onSurface }}>
            Geleneksel berberligi dijital kolaylikla birlestiren modern bakim platformu.
          </Text>
        </View>

        <View
          className="flex-2 flex-row flex-wrap gap-6"
          style={{ justifyContent: isWide ? 'center' : 'flex-start' }}>
          {footerLinks.map((linkItem) => (
            <Link key={linkItem.href} href={linkItem.href} asChild>
              <Pressable className="py-1">
                {({ hovered }) => (
                  <Text
                    className="font-body text-lg"
                    style={[
                      { color: hovered ? primary : onSurfaceVariant },
                      Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'color 220ms ease' } as any) : null,
                    ]}>
                    {linkItem.label}
                  </Text>
                )}
              </Pressable>
            </Link>
          ))}
        </View>

        <View className="flex-1" style={{ alignItems: isWide ? 'flex-end' : 'flex-start' }}>
          <Text
            className="font-label text-sm uppercase tracking-[1.2px]"
            style={{ color: onSurfaceVariant, textAlign: isWide ? 'right' : 'left' }}>
            (c) 2026 Ustura. Tum haklari saklidir.
          </Text>
        </View>
      </View>
    </View>
  );
}
