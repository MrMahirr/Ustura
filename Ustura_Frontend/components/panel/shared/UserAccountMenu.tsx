import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { authRoleLabel } from '@/components/panel/shared/auth-role-label';
import { authRoutes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { hexToRgba } from '@/utils/color';
import { showInfoFlash } from '@/utils/flash';

export interface UserAccountMenuPalette {
  theme: 'light' | 'dark';
  cardBackground: string;
  cardBackgroundMuted: string;
  borderSubtle: string;
  onSurface: string;
  onSurfaceVariant: string;
  primary: string;
  error: string;
}

export interface UserAccountMenuProps {
  palette: UserAccountMenuPalette;
  profileHref: Href;
}

function showMessage(title: string, message: string) {
  showInfoFlash(title, message);
}

type MenuIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface MenuAction {
  id: string;
  label: string;
  icon: MenuIconName;
  danger?: boolean;
  onSelect: () => void | Promise<void>;
}

export default function UserAccountMenu({ palette, profileHref }: UserAccountMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const displayName = user?.fullName?.trim() || 'Kullanici';
  const subtitle = authRoleLabel(user?.role ?? null);
  const initials = (user?.initials ?? '?').slice(0, 2).toLocaleUpperCase('tr-TR');

  const close = React.useCallback(() => setOpen(false), []);

  const handleLogout = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace(authRoutes.giris);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message.trim()
          ? err.message
          : 'Cikis tamamlanamadi. Baglantiyi kontrol edip tekrar deneyin.';
      showMessage('Cikis', message);
    } finally {
      setIsLoggingOut(false);
      close();
    }
  }, [close, logout, router]);

  const items = React.useMemo<MenuAction[]>(
    () => [
      {
        id: 'profile',
        label: 'Profil ve ayarlar',
        icon: 'person-outline',
        onSelect: () => {
          router.push(profileHref);
          close();
        },
      },
      {
        id: 'logout',
        label: 'Cikis yap',
        icon: 'logout',
        danger: true,
        onSelect: () => handleLogout(),
      },
    ],
    [close, handleLogout, profileHref, router],
  );

  const menuShadow =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            palette.theme === 'light'
              ? '0 18px 48px rgba(27, 27, 32, 0.12)'
              : '0 18px 48px rgba(0, 0, 0, 0.35)',
        } as const)
      : {
          shadowColor: '#000000',
          shadowOpacity: palette.theme === 'light' ? 0.12 : 0.28,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        };

  return (
    <View className="relative z-[120]">
      {open && Platform.OS === 'web' ? (
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={
            {
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 110,
              backgroundColor: 'transparent',
            } as any
          }
          onPress={close}
        />
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hesap menusu"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        className="relative z-[130] flex-row items-center gap-2 rounded-md px-1.5 py-1"
        style={({ hovered, pressed }) => [
          {
            backgroundColor:
              open || hovered ? hexToRgba(palette.onSurface, 0.05) : 'transparent',
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          Platform.OS === 'web'
            ? ({
                cursor: 'pointer',
                transition: 'background-color 160ms ease, transform 120ms ease',
              } as any)
            : null,
        ]}>
        <View className="items-end">
          <Text
            numberOfLines={1}
            className="max-w-[140px] font-body text-xs font-bold"
            style={{ color: palette.onSurface }}>
            {displayName}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-0.5 max-w-[140px] font-label text-[10px]"
            style={{ color: hexToRgba(palette.onSurfaceVariant, 0.85) }}>
            {subtitle}
          </Text>
        </View>
        <MaterialIcons
          name={open ? 'expand-less' : 'expand-more'}
          size={20}
          color={hexToRgba(palette.onSurfaceVariant, 0.75)}
        />
        <View
          className="h-9 w-9 items-center justify-center rounded-sm border"
          style={{
            borderColor: hexToRgba(palette.primary, 0.22),
            backgroundColor: hexToRgba(palette.primary, 0.1),
          }}>
          <Text
            className="font-label text-[11px]"
            style={{ color: palette.primary, fontFamily: 'Manrope-Bold' }}>
            {initials}
          </Text>
        </View>
      </Pressable>

      {open ? (
        <View
          className="absolute right-0 top-[48px] z-[130] min-w-[200px] overflow-hidden rounded-lg border"
          style={{
            backgroundColor: palette.cardBackground,
            borderColor: palette.borderSubtle,
            ...menuShadow,
          }}>
          <View className="border-b px-3 py-2.5" style={{ borderBottomColor: palette.borderSubtle }}>
            <Text numberOfLines={1} className="font-body text-sm font-semibold" style={{ color: palette.onSurface }}>
              {displayName}
            </Text>
            {user?.email ? (
              <Text numberOfLines={1} className="mt-0.5 font-body text-[11px]" style={{ color: palette.onSurfaceVariant }}>
                {user.email}
              </Text>
            ) : null}
          </View>

          {items.map((item) => (
            <Pressable
              key={item.id}
              disabled={item.id === 'logout' && isLoggingOut}
              onPress={() => {
                void Promise.resolve(item.onSelect()).catch(() => {});
              }}
              className="flex-row items-center gap-2.5 px-3 py-2.5"
              style={({ hovered, pressed }) => [
                {
                  backgroundColor:
                    item.danger && hovered
                      ? hexToRgba(palette.error, 0.08)
                      : hovered
                        ? palette.cardBackgroundMuted
                        : 'transparent',
                  opacity: item.id === 'logout' && isLoggingOut ? 0.55 : 1,
                },
                Platform.OS === 'web'
                  ? ({
                      cursor: item.id === 'logout' && isLoggingOut ? 'default' : 'pointer',
                      transition: 'background-color 150ms ease',
                    } as any)
                  : null,
                pressed && !(item.id === 'logout' && isLoggingOut)
                  ? { backgroundColor: palette.cardBackgroundMuted }
                  : null,
              ]}>
              {item.id === 'logout' && isLoggingOut ? (
                <ActivityIndicator size="small" color={palette.error} />
              ) : (
                <MaterialIcons
                  name={item.icon}
                  size={18}
                  color={item.danger ? palette.error : hexToRgba(palette.onSurfaceVariant, 0.9)}
                />
              )}
              <Text
                className="font-body text-sm"
                style={{
                  color: item.danger ? palette.error : palette.onSurface,
                  fontFamily: 'Manrope-Medium',
                }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
