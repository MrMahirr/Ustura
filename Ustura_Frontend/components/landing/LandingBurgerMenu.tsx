import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Button from '@/components/ui/Button';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export interface LandingBurgerMenuItem {
  href: Href;
  label: string;
  isActive: boolean;
}

interface LandingBurgerMenuProps {
  open: boolean;
  items: LandingBurgerMenuItem[];
  topOffset: number;
  viewportHeight: number;
  onClose: () => void;
  onBookingPress: () => void;
  onRegisterPress: () => void;
}

function LandingBurgerMenuLink({
  item,
  onPress,
}: {
  item: LandingBurgerMenuItem;
  onPress: () => void;
}) {
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        {
          minHeight: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 16,
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: item.isActive || hovered ? surfaceContainerLow : 'transparent',
          borderColor: item.isActive ? hexToRgba(primary, 0.28) : hexToRgba(outlineVariant, 0.18),
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              cursor: 'pointer',
              transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease',
            } as any)
          : null,
      ]}>
      {({ hovered }) => (
        <>
          <Text
            className="font-label text-[11px] font-bold uppercase tracking-[2.2px]"
            style={{ color: item.isActive || hovered ? primary : onSurface }}>
            {item.label}
          </Text>
          <MaterialIcons
            name="east"
            size={16}
            color={item.isActive || hovered ? primary : hexToRgba(onSurfaceVariant, 0.78)}
          />
        </>
      )}
    </Pressable>
  );
}

function LandingBurgerMenuAccount({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');

  const handleNavigate = (pathname: '/giris' | '/kayit' | '/(public)') => {
    onClose();
    router.push(pathname);
  };

  const handleLogout = () => {
    onClose();
    logout();
    router.replace('/(public)');
  };

  return (
    <View
      className="rounded-[18px] border p-4"
      style={{
        gap: 12,
        backgroundColor: surfaceContainerLow,
        borderColor: hexToRgba(outlineVariant, 0.24),
      }}>
      <View style={{ gap: 4 }}>
        <Text className="font-label text-[10px] font-bold uppercase tracking-[2.4px]" style={{ color: primary }}>
          Hesap
        </Text>
        <Text className="font-body text-base font-bold" style={{ color: onSurface }}>
          {user?.fullName ?? 'Misafir'}
        </Text>
        <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
          {user?.email ?? user?.phone ?? 'Giris yaparak musteri hesabini ve randevularini yonet.'}
        </Text>
      </View>

      {isAuthenticated ? (
        <Button title="Cikis Yap" variant="ghost" onPress={handleLogout} style={{ width: '100%' }} />
      ) : (
        <View style={{ gap: 10 }}>
          <Button
            title="Giris Yap"
            variant="outline"
            interactionPreset="outlineCta"
            onPress={() => handleNavigate('/giris')}
            style={{ width: '100%' }}
          />
          <Button title="Kayit Ol" interactionPreset="cta" onPress={() => handleNavigate('/kayit')} style={{ width: '100%' }} />
        </View>
      )}
    </View>
  );
}

export default function LandingBurgerMenu({
  open,
  items,
  topOffset,
  viewportHeight,
  onClose,
  onBookingPress,
  onRegisterPress,
}: LandingBurgerMenuProps) {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const router = useRouter();
  const [rendered, setRendered] = React.useState(open);
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const progress = React.useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    if (open) {
      setRendered(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    if (!rendered) {
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 240,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setRendered(false);
      }
    });
  }, [open, progress, rendered]);

  if (!rendered) {
    return null;
  }

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const panelTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Math.max(width, 320), 0],
  });

  const panelContentOpacity = progress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0, 0.24, 1],
  });

  return (
    <View
      pointerEvents="box-none"
      style={
        Platform.OS === 'web'
          ? ({
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 72,
            } as any)
          : {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: viewportHeight,
              zIndex: 72,
            }
      }>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: theme === 'light' ? 'rgba(27, 27, 32, 0.08)' : 'rgba(5, 5, 8, 0.42)',
          },
          { opacity: overlayOpacity },
        ]}
      />

      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={
          Platform.OS === 'web'
            ? ({
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              } as any)
            : {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: viewportHeight,
              }
        }
      />

      <Animated.View
        className="absolute right-0 top-0 overflow-hidden border-l"
        style={[
          {
            width,
            height: viewportHeight,
            backgroundColor: surface,
            borderLeftColor: hexToRgba(outlineVariant, theme === 'light' ? 0.4 : 0.2),
          },
          Platform.OS === 'web'
            ? ({
                boxShadow:
                  theme === 'light'
                    ? '0 26px 54px rgba(27, 27, 32, 0.12)'
                    : '0 26px 54px rgba(0, 0, 0, 0.34)',
              } as any)
            : {
                shadowColor: '#000000',
                shadowOpacity: theme === 'light' ? 0.12 : 0.26,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 14 },
                elevation: 12,
              },
          { transform: [{ translateX: panelTranslateX }] },
        ]}>
        <View
          pointerEvents="none"
          className="absolute right-[-120px] top-[-80px] rounded-full"
          style={{
            width: 280,
            height: 280,
            backgroundColor: hexToRgba(primary, theme === 'light' ? 0.12 : 0.08),
            ...(Platform.OS === 'web' ? ({ filter: 'blur(110px)' } as any) : {}),
          }}
        />
        <View
          pointerEvents="none"
          className="absolute bottom-[-80px] left-[-40px] rounded-full"
          style={{
            width: 220,
            height: 220,
            backgroundColor: hexToRgba(primaryContainer, theme === 'light' ? 0.16 : 0.1),
            ...(Platform.OS === 'web' ? ({ filter: 'blur(96px)' } as any) : {}),
          }}
        />

        <Animated.View style={{ flex: 1, opacity: panelContentOpacity }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: topOffset,
              paddingBottom: 28,
              gap: 22,
            }}
            showsVerticalScrollIndicator={false}>
            <View
              className="rounded-[26px] border px-5 py-5"
              style={{
                gap: 16,
                backgroundColor: hexToRgba(surfaceContainerLow, theme === 'light' ? 0.82 : 0.78),
                borderColor: hexToRgba(outlineVariant, 0.18),
              }}>
              <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text className="font-headline text-[34px] font-bold italic" style={{ color: primary }}>
                    Menu
                  </Text>
                  <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                    Kucuk ekranlarda navigasyon ve hesap aksiyonlari tam ekran bir drawer icinde sunulur.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={onClose}
                  style={({ hovered, pressed }) => [
                    {
                      width: 42,
                      height: 42,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 14,
                      backgroundColor: hovered || pressed ? hexToRgba(primary, 0.12) : 'transparent',
                    },
                    Platform.OS === 'web'
                      ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
                      : null,
                  ]}>
                  <MaterialIcons name="close" size={20} color={primary} />
                </Pressable>
              </View>

              <View
                className="rounded-[18px] border px-4 py-4"
                style={{
                  gap: 4,
                  backgroundColor: hexToRgba(primary, theme === 'light' ? 0.08 : 0.06),
                  borderColor: hexToRgba(primary, theme === 'light' ? 0.16 : 0.14),
                }}>
                <Text className="font-label text-[10px] font-bold uppercase tracking-[2.4px]" style={{ color: primary }}>
                  Hizli Erisim
                </Text>
                <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                  Kuaforleri ac, kayit formuna git veya hesabini yonet.
                </Text>
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {items.map((item) => (
                <LandingBurgerMenuLink
                  key={item.label}
                  item={item}
                  onPress={() => {
                    onClose();
                    router.push(item.href);
                  }}
                />
              ))}
            </View>

            <View
              className="rounded-[22px] border p-4"
              style={{
                gap: 12,
                backgroundColor: hexToRgba(surfaceContainerLow, theme === 'light' ? 0.9 : 0.82),
                borderColor: hexToRgba(outlineVariant, 0.18),
              }}>
              <Button title="Randevu Al" interactionPreset="cta" onPress={onBookingPress} style={{ width: '100%' }} />
              <Button
                title="Salonumu Kaydet"
                variant="outline"
                interactionPreset="outlineCta"
                onPress={onRegisterPress}
                style={{ width: '100%' }}
              />
            </View>

            <LandingBurgerMenuAccount onClose={onClose} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
