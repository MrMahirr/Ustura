import React from 'react';
import { View, Text, useWindowDimensions, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, usePathname, useRouter, type Href } from 'expo-router';
import Button from '@/components/ui/Button';
import LandingBurgerMenu, { type LandingBurgerMenuItem } from '@/components/landing/LandingBurgerMenu';
import SessionProfileCard from '@/components/layout/SessionProfileCard';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
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
      <Pressable
        className="justify-center"
        style={{
          minHeight: 34,
        }}>
        {({ hovered }: { hovered: boolean }) => {
          const isHighlighted = isActive || hovered;

          return (
            <View
              className="relative self-start justify-center"
              style={{
                minHeight: 26,
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
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1200;
  const showInlineNav = width >= 1024;
  const navbarHorizontalPadding = width < 768 ? 8 : width < 1200 ? 12 : 16;
  const menuTopOffset = width < 768 ? 72 : 78;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  const isAnasayfa = pathname === '/' || pathname === '/(public)' || pathname === '/(public)/index';
  const isKuaforler = pathname === '/kuaforler' || pathname === '/(public)/kuaforler';
  const isHizmetler = pathname === '/hizmetler' || pathname === '/(public)/hizmetler';
  const isHakkimizda = pathname === '/hakkimizda' || pathname === '/(public)/hakkimizda';
  const isRandevularim = pathname === '/randevularim' || pathname === '/(public)/randevularim';
  const navbarBackground = theme === 'light' ? 'rgba(253, 251, 255, 0.86)' : 'rgba(17, 17, 24, 0.84)';
  const burgerMenuItems = React.useMemo<LandingBurgerMenuItem[]>(
    () => [
      { href: '/(public)', label: 'ANASAYFA', isActive: isAnasayfa },
      { href: '/(public)/hizmetler', label: 'HIZMETLER', isActive: isHizmetler },
      { href: '/(public)/kuaforler', label: 'KUAFORLER', isActive: isKuaforler },
      { href: '/(public)/hakkimizda', label: 'HAKKIMIZDA', isActive: isHakkimizda },
      ...(isAuthenticated
        ? [{ href: '/(public)/randevularim' as const, label: 'RANDEVULARIM', isActive: isRandevularim }]
        : []),
    ],
    [isAnasayfa, isAuthenticated, isHakkimizda, isHizmetler, isKuaforler, isRandevularim]
  );

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (showInlineNav && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen, showInlineNav]);

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

  const handleBookingPress = () => {
    router.push('/(public)/kuaforler');
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
          maxWidth: '100%',
          paddingHorizontal: navbarHorizontalPadding,
          paddingVertical: width < 768 ? 14 : 16,
        }}>
        <Text className="font-headline text-[34px] font-bold" style={{ color: primary }} onPress={() => router.push('/(public)')}>
          Ustura
        </Text>

        {showInlineNav && (
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
            {isAuthenticated ? (
              <NavbarLink
                href="/(public)/randevularim"
                label="RANDEVULARIM"
                isActive={isRandevularim}
                primary={primary}
                onSurfaceVariant={onSurfaceVariant}
              />
            ) : null}
          </View>
        )}

        <View className="flex-row items-center">
          {showInlineNav && isDesktop && (
            <View
              style={[
                {
                  marginRight: 12,
                  padding: 1,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme === 'light' ? hexToRgba(primary, 0.2) : hexToRgba(primary, 0.16),
                  backgroundColor:
                    theme === 'light'
                      ? 'rgba(255, 255, 255, 0.62)'
                      : 'rgba(255, 255, 255, 0.02)',
                },
                Platform.OS === 'web'
                  ? ({
                      boxShadow:
                        theme === 'light'
                          ? '0 10px 22px rgba(27, 27, 32, 0.06)'
                          : `0 12px 28px ${hexToRgba(primary, 0.08)}`,
                    } as any)
                  : {
                      shadowColor: theme === 'light' ? '#1B1B20' : primary,
                      shadowOpacity: theme === 'light' ? 0.06 : 0.08,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 3,
                    },
              ]}>
              <Button
                title="Salonumu Kaydet"
                variant="outline"
                interactionPreset="outlineCta"
                onPress={handleRegisterPress}
              />
            </View>
          )}
          {showInlineNav ? (
            <Button
              title="Randevu Al"
              interactionPreset="cta"
              onPress={handleBookingPress}
              style={{ marginRight: 12 }}
            />
          ) : null}
          <ThemeToggleButton />
          {showInlineNav ? (
            <View style={{ marginLeft: 12 }}>
              <SessionProfileCard compact={!isDesktop} size="small" />
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isMenuOpen ? 'Menuyu kapat' : 'Menuyu ac'}
              accessibilityState={{ expanded: isMenuOpen }}
              onPress={() => setIsMenuOpen((previous) => !previous)}
              style={({ hovered, pressed }) => [
                {
                  width: 42,
                  height: 42,
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  borderWidth: 1,
                  backgroundColor: hovered || pressed || isMenuOpen ? hexToRgba(primary, 0.12) : 'transparent',
                  borderColor: isMenuOpen ? hexToRgba(primary, 0.28) : hexToRgba(outlineVariant, 0.24),
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
                Platform.OS === 'web'
                  ? ({
                      cursor: 'pointer',
                      transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease',
                    } as any)
                  : null,
              ]}>
              <MaterialIcons name={isMenuOpen ? 'close' : 'menu'} size={20} color={primary} />
            </Pressable>
          )}
        </View>
      </View>

      {!showInlineNav ? (
        <LandingBurgerMenu
          open={isMenuOpen}
          items={burgerMenuItems}
          topOffset={menuTopOffset}
          viewportHeight={height}
          onClose={() => setIsMenuOpen(false)}
          onBookingPress={() => {
            setIsMenuOpen(false);
            handleBookingPress();
          }}
          onRegisterPress={() => {
            setIsMenuOpen(false);
            handleRegisterPress();
          }}
        />
      ) : null}
    </View>
  );
}
