import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Link, usePathname, useRouter, type Href } from 'expo-router';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

type NavbarLinkProps = {
  href: Href;
  label: string;
  isActive: boolean;
  primary: string;
  onSurface: string;
};

function NavbarLink({ href, label, isActive, primary, onSurface }: NavbarLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.linkWrapper}>
        {({ hovered }: { hovered: boolean }) => {
          const showUnderline = isActive || hovered;

          return (
            <View style={[styles.linkInner, hovered && styles.linkInnerHovered]}>
              <Text
                style={[
                  styles.link,
                  { color: showUnderline ? primary : onSurface },
                ]}>
                {label}
              </Text>
              <View
                style={[
                  styles.linkUnderline,
                  { backgroundColor: primary },
                  showUnderline && styles.linkUnderlineVisible,
                ]}
              />
            </View>
          );
        }}
      </Pressable>
    </Link>
  );
}

export default function Navbar() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = width >= 1200;
  const isTablet = width >= 768;

  const pathname = usePathname();
  const router = useRouter();

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const surface = useThemeColor({}, 'surface');

  const isAnasayfa = pathname === '/' || pathname === '/(public)' || pathname === '/(public)/index';
  const isKuaforler = pathname === '/kuaforler' || pathname === '/(public)/kuaforler';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Platform.OS === 'web' ? 'rgba(19, 19, 24, 0.8)' : surface },
      ]}>
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            paddingHorizontal: layout.horizontalPadding,
            paddingVertical: width < 768 ? 14 : 16,
          },
        ]}>
        <Text style={[styles.logo, { color: primary }]} onPress={() => router.push('/(public)')}>
          Ustura
        </Text>

        {isTablet && (
          <View style={[styles.links, { gap: width < 1280 ? 24 : 32 }]}>
            <NavbarLink
              href="/(public)"
              label="ANASAYFA"
              isActive={isAnasayfa}
              primary={primary}
              onSurface={onSurface}
            />
            <NavbarLink
              href="/(public)/kuaforler"
              label="KUAFORLER"
              isActive={isKuaforler}
              primary={primary}
              onSurface={onSurface}
            />
            <NavbarLink
              href="/"
              label="HAKKIMIZDA"
              isActive={false}
              primary={primary}
              onSurface={onSurface}
            />
          </View>
        )}

        <View style={styles.actions}>
          {isDesktop && (
            <Button
              title="Salonumu Kaydet"
              variant="outline"
              interactionPreset="outlineCta"
              style={{ marginRight: 16 }}
            />
          )}
          <Button title="Randevu Al" interactionPreset="cta" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 50,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)' } as any),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    ...Typography.headlineLg,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  linkWrapper: {
    paddingBottom: 4,
  },
  linkInner: {
    position: 'relative',
    alignSelf: 'flex-start',
    paddingBottom: 8,
    transform: [{ scale: 1 }],
    transition: 'transform 0.18s ease',
  } as any,
  linkInnerHovered: {
    transform: [{ scale: 1.04 }],
  },
  link: {
    ...Typography.labelLg,
    transition: 'color 0.18s ease',
  } as any,
  linkUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1.5,
    opacity: 0,
    borderRadius: 999,
    transform: [{ scaleX: 0 }],
    transformOrigin: 'center',
    transition: 'transform 0.22s ease, opacity 0.18s ease',
  } as any,
  linkUnderlineVisible: {
    opacity: 1,
    transform: [{ scaleX: 1 }],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
