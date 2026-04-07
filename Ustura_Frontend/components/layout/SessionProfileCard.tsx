import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface SessionProfileCardProps {
  compact?: boolean;
  size?: 'default' | 'small';
}

export default function SessionProfileCard({ compact = false, size = 'default' }: SessionProfileCardProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const displayName = user?.fullName ?? 'Misafir';
  const detailLine = user?.email ?? user?.phone ?? 'Giris yaparak randevu ve profil durumunu yonet.';
  const statusLabel = isAuthenticated ? 'Musteri Hesabi' : 'Guest Session';
  const isSmall = size === 'small';
  const triggerHeight = compact ? (isSmall ? 42 : 48) : isSmall ? 42 : 48;
  const triggerWidth = compact ? (isSmall ? 42 : 48) : isSmall ? 168 : 188;
  const avatarSize = isSmall ? 30 : 34;
  const avatarIconSize = isSmall ? 16 : 18;
  const triggerPaddingHorizontal = compact ? (isSmall ? 8 : 10) : isSmall ? 10 : 12;
  const triggerPaddingVertical = isSmall ? 6 : 8;
  const triggerRadius = isSmall ? 14 : 16;
  const dropdownTop = isSmall ? 52 : 58;
  const dropdownWidth = compact ? (isSmall ? 248 : 272) : isSmall ? 288 : 320;
  const dropdownPadding = isSmall ? 16 : 18;

  const handleNavigate = React.useCallback(
    (pathname: '/giris' | '/kayit' | '/(public)' | '/(public)/kuaforler') => {
      setIsOpen(false);
      router.push(pathname);
    },
    [router]
  );

  const handleLogout = React.useCallback(() => {
    setIsOpen(false);
    logout();
    router.replace('/(public)');
  }, [logout, router]);

  return (
    <View style={{ position: 'relative', zIndex: 80 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((previous) => !previous)}
        style={({ hovered, pressed }) => [
          {
            minHeight: triggerHeight,
            minWidth: triggerWidth,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: triggerRadius,
            borderWidth: 1,
            paddingHorizontal: triggerPaddingHorizontal,
            paddingVertical: triggerPaddingVertical,
            backgroundColor: hovered || pressed ? surfaceContainerHigh : surfaceContainerLow,
            borderColor: hovered || pressed ? hexToRgba(primary, 0.38) : hexToRgba(outlineVariant, 0.34),
          },
          Platform.OS === 'web'
            ? ({
                transition: 'background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                boxShadow: hovered ? `0 14px 34px ${hexToRgba(primary, 0.12)}` : 'none',
                cursor: 'pointer',
              } as any)
            : null,
        ]}>
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
            backgroundColor: isAuthenticated ? primary : hexToRgba(primary, 0.12),
            borderWidth: 1,
            borderColor: hexToRgba(primary, isAuthenticated ? 0.18 : 0.22),
          }}>
          {isAuthenticated ? (
            <Text
              className="font-label font-bold uppercase tracking-[1px]"
              style={{ color: onPrimary, fontSize: isSmall ? 11 : 12 }}>
              {user?.initials}
            </Text>
          ) : (
            <MaterialIcons name="person-outline" size={avatarIconSize} color={primary} />
          )}
        </View>

        {!compact ? (
          <View style={{ flex: 1, marginLeft: isSmall ? 8 : 10 }}>
            <Text
              className="font-body font-bold"
              numberOfLines={1}
              style={{ color: onSurface, fontSize: isSmall ? 13 : 14 }}>
              {displayName}
            </Text>
            <Text
              className="font-label uppercase tracking-[1.4px]"
              numberOfLines={1}
              style={{ color: onSurfaceVariant, fontSize: isSmall ? 9 : 10 }}>
              {statusLabel}
            </Text>
          </View>
        ) : null}

        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={isSmall ? 16 : 18}
          color={compact ? primary : onSurfaceVariant}
          style={compact ? { marginLeft: isSmall ? 2 : 4 } : undefined}
        />
      </Pressable>

      {isOpen ? (
        <View
          className="absolute right-0"
          style={[
            {
              top: dropdownTop,
              width: dropdownWidth,
              borderRadius: 18,
              borderWidth: 1,
              padding: dropdownPadding,
              backgroundColor: surface,
              borderColor: hexToRgba(outlineVariant, 0.28),
            },
            Platform.OS === 'web'
              ? ({
                  backdropFilter: 'blur(18px)',
                  boxShadow: `0 22px 54px ${hexToRgba('#000000', 0.22)}`,
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 10,
                },
          ]}>
          <View style={{ gap: 12 }}>
            <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text className="font-headline text-xl font-bold" style={{ color: onSurface }}>
                  {displayName}
                </Text>
                <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                  {detailLine}
                </Text>
              </View>

              <View
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: isAuthenticated ? hexToRgba(primary, 0.14) : hexToRgba(primaryContainer, 0.2) }}>
                <Text className="font-label text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: primary }}>
                  {isAuthenticated ? 'Aktif' : 'Misafir'}
                </Text>
              </View>
            </View>

            <View className="border-t" style={{ borderTopColor: hexToRgba(outlineVariant, 0.18), paddingTop: 14, gap: 10 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    title="Kuaforleri Ac"
                    variant="outline"
                    interactionPreset="outlineCta"
                    onPress={() => handleNavigate('/(public)/kuaforler')}
                    style={{ width: '100%' }}
                  />
                  <Button title="Cikis Yap" variant="ghost" onPress={handleLogout} style={{ width: '100%' }} />
                </>
              ) : (
                <>
                  <Button
                    title="Giris Yap"
                    variant="outline"
                    interactionPreset="outlineCta"
                    onPress={() => handleNavigate('/giris')}
                    style={{ width: '100%' }}
                  />
                  <Button
                    title="Kayit Ol"
                    interactionPreset="cta"
                    onPress={() => handleNavigate('/kayit')}
                    style={{ width: '100%' }}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
