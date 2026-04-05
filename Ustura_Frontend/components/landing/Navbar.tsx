import React from 'react';
import { View, Text, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Link, usePathname, useRouter, type Href } from 'expo-router';
import Button from '@/components/ui/Button';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { getLandingLayout } from '@/components/landing/layout';

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
      <Pressable className="pb-1">
        {({ hovered }: { hovered: boolean }) => {
          const isHighlighted = isActive || hovered;

          return (
            <View
              className="relative self-start pb-2.5"
              style={{
                transform: [{ scale: isHighlighted ? 1.03 : 1 }],
                transition: Platform.OS === 'web' ? 'transform 0.18s ease' : undefined,
              } as any}>
              <Text
                className="font-label text-[13px] uppercase tracking-[1.6px]"
                style={[
                  { color: isHighlighted ? primary : onSurfaceVariant },
                  Platform.OS === 'web' ? ({ transition: 'color 0.18s ease' } as any) : null,
                ]}>
                {label}
              </Text>
              <View
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{
                  backgroundColor: primary,
                  opacity: isHighlighted ? 1 : 0,
                  transform: [{ scaleX: isHighlighted ? 1 : 0 }],
                  transformOrigin: 'center',
                  transition: Platform.OS === 'web' ? 'transform 0.24s ease, opacity 0.18s ease' : undefined,
                } as any}
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
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

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
      className="absolute top-0 z-50 w-full border-b"
      style={[
        {
          backgroundColor: Platform.OS === 'web' ? navbarBackground : surface,
          borderBottomColor: outlineVariant,
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(20px)',
              transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease',
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
        className="w-full self-center flex-row items-center justify-between"
        style={{
          maxWidth: layout.contentMaxWidth,
          paddingHorizontal: layout.horizontalPadding,
          paddingVertical: width < 768 ? 14 : 16,
        }}>
        <Text className="font-headline text-[34px] font-bold" style={{ color: primary }} onPress={() => router.push('/(public)')}>
          Ustura
        </Text>

        {isTablet && (
          <View className="flex-row items-center" style={{ gap: width < 1280 ? 24 : 32 }}>
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

        <View className="flex-row items-center">
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
          <ThemeToggleButton />
        </View>
      </View>
    </View>
  );
}
