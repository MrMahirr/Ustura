import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Link, usePathname, useRouter, type Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

type NavbarLinkProps = {
  href: Href;
  label: string;
  isActive: boolean;
  primary: string;
  onSurfaceVariant: string;
};

type NavbarProps = {
  onRegisterPress?: () => void;
};

function NavbarLink({ href, label, isActive, primary, onSurfaceVariant }: NavbarLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.linkWrapper}>
        {({ hovered }: { hovered: boolean }) => {
          const isHighlighted = isActive || hovered;

          return (
            <View style={[styles.linkInner, isHighlighted && styles.linkInnerHovered]}>
              <Text
                style={[
                  styles.link,
                  { color: isHighlighted ? primary : onSurfaceVariant },
                ]}>
                {label}
              </Text>
              <View
                style={[
                  styles.linkUnderline,
                  { backgroundColor: primary },
                  isHighlighted && styles.linkUnderlineVisible,
                ]}
              />
            </View>
          );
        }}
      </Pressable>
    </Link>
  );
}

export default function Navbar({ onRegisterPress }: NavbarProps) {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = width >= 1200;
  const isTablet = width >= 768;

  const pathname = usePathname();
  const router = useRouter();

  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme, toggleTheme } = useAppTheme();

  const isAnasayfa = pathname === '/' || pathname === '/(public)' || pathname === '/(public)/index';
  const isKuaforler = pathname === '/kuaforler' || pathname === '/(public)/kuaforler';
  const isHizmetler = pathname === '/hizmetler' || pathname === '/(public)/hizmetler';
  const isHakkimizda = pathname === '/hakkimizda' || pathname === '/(public)/hakkimizda';
  const navbarBackground = theme === 'light' ? 'rgba(253, 251, 255, 0.86)' : 'rgba(17, 17, 24, 0.84)';

  const handleRegisterPress = () => {
    if (onRegisterPress) {
      onRegisterPress();
      return;
    }

    router.push({
      pathname: '/(public)',
      params: { scrollTo: 'register' },
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Platform.OS === 'web' ? navbarBackground : surface,
          borderBottomColor: outlineVariant,
        },
        Platform.OS === 'web'
          ? ({
              boxShadow:
                theme === 'light'
                  ? '0 14px 34px rgba(27, 27, 32, 0.07)'
                  : '0 18px 38px rgba(0, 0, 0, 0.34)',
            } as any)
          : {
              shadowColor: '#000000',
              shadowOpacity: theme === 'light' ? 0.08 : 0.24,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            },
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
              onSurfaceVariant={onSurfaceVariant}
            />
            <NavbarLink
              href="/(public)/hizmetler"
              label="HIZMETLER"
              isActive={isHizmetler}
              primary={primary}
              onSurfaceVariant={onSurfaceVariant}
            />
            <NavbarLink
              href="/(public)/kuaforler"
              label="KUAFORLER"
              isActive={isKuaforler}
              primary={primary}
              onSurfaceVariant={onSurfaceVariant}
            />
            <NavbarLink
              href="/(public)/hakkimizda"
              label="HAKKIMIZDA"
              isActive={isHakkimizda}
              primary={primary}
              onSurfaceVariant={onSurfaceVariant}
            />
          </View>
        )}

        <View style={styles.actions}>
          {isDesktop && (
            <Button
              title="Salonumu Kaydet"
              variant="outline"
              interactionPreset="outlineCta"
              onPress={handleRegisterPress}
              style={{ marginRight: 12 }}
            />
          )}
          <Button
            title="Randevu Al"
            interactionPreset="cta"
            onPress={() => router.push('/(public)/kuaforler')}
            style={{ marginRight: 12 }}
          />
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            style={({ hovered, pressed }) => [
              styles.themeToggle,
              {
                backgroundColor: hovered ? surfaceContainerLow : surface,
                borderColor: hovered ? hexToRgba(primary, 0.38) : outlineVariant,
                transform: [{ scale: pressed ? 0.96 : hovered ? 1.02 : 1 }],
              },
              Platform.OS === 'web'
                ? ({
                    boxShadow: hovered
                      ? `0 12px 24px ${hexToRgba(primary, 0.14)}`
                      : '0 6px 16px rgba(27, 27, 32, 0.08)',
                  } as any)
                : {
                    shadowColor: primary,
                    shadowOpacity: hovered ? 0.16 : 0.08,
                    shadowRadius: hovered ? 14 : 8,
                    shadowOffset: { width: 0, height: hovered ? 8 : 4 },
                    elevation: hovered ? 8 : 3,
                  },
            ]}>
            <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={20} color={primary} />
          </Pressable>
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
    borderBottomWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease',
        } as any)
      : {}),
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
    fontSize: 34,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkWrapper: {
    paddingBottom: 4,
  },
  linkInner: {
    position: 'relative',
    alignSelf: 'flex-start',
    paddingBottom: 10,
    transform: [{ scale: 1 }],
    transition: 'transform 0.18s ease',
  } as any,
  linkInnerHovered: {
    transform: [{ scale: 1.03 }],
  },
  link: {
    ...Typography.labelMd,
    fontSize: 13,
    transition: 'color 0.18s ease',
  } as any,
  linkUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    opacity: 0,
    borderRadius: 999,
    transform: [{ scaleX: 0 }],
    transformOrigin: 'center',
    transition: 'transform 0.24s ease, opacity 0.18s ease',
  } as any,
  linkUnderlineVisible: {
    opacity: 1,
    transform: [{ scaleX: 1 }],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 200ms ease',
          cursor: 'pointer',
        } as any)
      : {}),
  } as any,
});
