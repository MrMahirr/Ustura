import React from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type View as ViewType,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

import { getNextUpcomingBooking } from '@/components/customer-bookings/presentation';
import SessionProfileMenuAction from '@/components/layout/session-profile/SessionProfileMenuAction';
import SessionProfileNextBookingCard from '@/components/layout/session-profile/SessionProfileNextBookingCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { useMyBookings } from '@/hooks/use-my-bookings';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface SessionProfileCardProps {
  compact?: boolean;
  size?: 'default' | 'small';
}

interface TriggerFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getDropdownPosition({
  frame,
  dropdownWidth,
  viewportWidth,
}: {
  frame: TriggerFrame;
  dropdownWidth: number;
  viewportWidth: number;
}) {
  const defaultRightInset = 8;
  const left = Math.max(
    12,
    Math.min(frame.x + frame.width - dropdownWidth, viewportWidth - dropdownWidth - defaultRightInset)
  );

  return {
    left,
    top: frame.y + frame.height + 10,
  };
}

export default function SessionProfileCard({
  compact = false,
  size = 'default',
}: SessionProfileCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width: viewportWidth } = useWindowDimensions();
  const { user, isAuthenticated, logout } = useAuth();
  const { bookings } = useMyBookings();
  const [isOpen, setIsOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const [triggerFrame, setTriggerFrame] = React.useState<TriggerFrame | null>(null);
  const triggerRef = React.useRef<ViewType | null>(null);
  const progress = React.useRef(new Animated.Value(0)).current;

  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const displayName = user?.fullName ?? 'Misafir';
  const detailLine = user?.email ?? user?.phone ?? 'Giris yaparak randevu ve profil durumunu yonet.';
  const statusLabel = isAuthenticated ? 'Musteri Hesabi' : 'Guest Session';
  const nextBooking = React.useMemo(
    () => (isAuthenticated ? getNextUpcomingBooking(bookings) : null),
    [bookings, isAuthenticated]
  );

  const isSmall = size === 'small';
  const triggerHeight = isSmall ? 42 : 48;
  const triggerWidth = compact ? (isSmall ? 42 : 48) : isSmall ? 170 : 194;
  const avatarSize = isSmall ? 30 : 34;
  const avatarIconSize = isSmall ? 16 : 18;
  const triggerPaddingHorizontal = compact ? (isSmall ? 8 : 10) : isSmall ? 10 : 12;
  const triggerPaddingVertical = isSmall ? 6 : 8;
  const triggerRadius = isSmall ? 14 : 16;
  const dropdownWidth = compact ? (isSmall ? 286 : 304) : isSmall ? 320 : 352;
  const dropdownPadding = isSmall ? 16 : 18;

  const measureTrigger = React.useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerFrame({ x, y, width, height });
    });
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    measureTrigger();
  }, [isOpen, measureTrigger, viewportWidth]);

  React.useEffect(() => {
    if (isOpen) {
      setRendered(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
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
      duration: 180,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setRendered(false);
      }
    });
  }, [isOpen, progress, rendered]);

  const handleNavigate = React.useCallback(
    (
      nextPath:
        | '/giris'
        | '/kayit'
        | '/(public)'
        | '/(public)/kuaforler'
        | '/(public)/randevularim'
    ) => {
      setIsOpen(false);
      router.push(nextPath);
    },
    [router]
  );

  const handleLogout = React.useCallback(() => {
    setIsOpen(false);
    logout();
    router.replace('/(public)');
  }, [logout, router]);

  const dropdownOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const dropdownTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const dropdownScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });

  const dropdownPosition = triggerFrame
    ? getDropdownPosition({
        frame: triggerFrame,
        dropdownWidth,
        viewportWidth,
      })
    : null;

  return (
    <View ref={triggerRef} style={{ zIndex: 80 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => {
          measureTrigger();
          setIsOpen((previous) => !previous);
        }}
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
            backgroundColor:
              hovered || pressed || isOpen ? surfaceContainerHigh : surfaceContainerLow,
            borderColor:
              hovered || pressed || isOpen
                ? hexToRgba(primary, 0.38)
                : hexToRgba(outlineVariant, 0.3),
          },
          Platform.OS === 'web'
            ? ({
                transition:
                  'background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                boxShadow:
                  hovered || isOpen ? `0 14px 34px ${hexToRgba(primary, 0.12)}` : 'none',
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

      {rendered && dropdownPosition ? (
        <Modal
          transparent
          visible={rendered}
          animationType="none"
          onRequestClose={() => setIsOpen(false)}>
          <View style={{ flex: 1 }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsOpen(false)}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownWidth,
                  borderRadius: 24,
                  borderWidth: 1,
                  padding: dropdownPadding,
                  overflow: 'hidden',
                  backgroundColor: surface,
                  borderColor: hexToRgba(outlineVariant, 0.24),
                },
                Platform.OS === 'web'
                  ? ({
                      backdropFilter: 'blur(18px)',
                      boxShadow: `0 24px 54px ${hexToRgba('#000000', 0.22)}`,
                    } as any)
                  : {
                      shadowColor: '#000000',
                      shadowOpacity: 0.2,
                      shadowRadius: 24,
                      shadowOffset: { width: 0, height: 12 },
                      elevation: 10,
                    },
                {
                  opacity: dropdownOpacity,
                  transform: [{ translateY: dropdownTranslateY }, { scale: dropdownScale }],
                },
              ]}>
              <View
                pointerEvents="none"
                className="absolute right-[-80px] top-[-80px] rounded-full"
                style={{
                  width: 220,
                  height: 220,
                  backgroundColor: hexToRgba(primary, 0.12),
                  ...(Platform.OS === 'web' ? ({ filter: 'blur(80px)' } as any) : {}),
                }}
              />

              <View style={{ gap: 14 }}>
                <View
                  className="rounded-[18px] border px-4 py-4"
                  style={{
                    gap: 14,
                    backgroundColor: hexToRgba(primaryContainer, 0.16),
                    borderColor: hexToRgba(primary, 0.18),
                  }}>
                  <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
                    <View className="flex-row items-center" style={{ flex: 1, gap: 12 }}>
                      <View
                        className="items-center justify-center rounded-full"
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: isAuthenticated ? primary : hexToRgba(primary, 0.12),
                        }}>
                        {isAuthenticated ? (
                          <Text className="font-label text-sm font-bold uppercase" style={{ color: onPrimary }}>
                            {user?.initials}
                          </Text>
                        ) : (
                          <MaterialIcons name="person-outline" size={22} color={primary} />
                        )}
                      </View>

                      <View style={{ flex: 1, gap: 3 }}>
                        <Text className="font-headline text-xl font-bold" style={{ color: onSurface }}>
                          {displayName}
                        </Text>
                        <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                          {detailLine}
                        </Text>
                      </View>
                    </View>

                    <View
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: isAuthenticated
                          ? hexToRgba(primary, 0.16)
                          : hexToRgba(primaryContainer, 0.24),
                      }}>
                      <Text
                        className="font-label text-[10px] font-bold uppercase tracking-[1.6px]"
                        style={{ color: primary }}>
                        {isAuthenticated ? 'Aktif' : 'Misafir'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center" style={{ gap: 10 }}>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: hexToRgba(primary, 0.14) }}>
                      <Text
                        className="font-label text-[10px] font-bold uppercase tracking-[1.8px]"
                        style={{ color: primary }}>
                        {statusLabel}
                      </Text>
                    </View>
                    {isAuthenticated ? (
                      <View
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: hexToRgba(primary, 0.1) }}>
                        <Text
                          className="font-label text-[10px] font-bold uppercase tracking-[1.8px]"
                          style={{ color: onSurfaceVariant }}>
                          1 Aktif Oturum
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {isAuthenticated ? (
                  <>
                    <SessionProfileNextBookingCard
                      booking={nextBooking}
                      onPress={() => handleNavigate('/(public)/randevularim')}
                    />

                    <View
                      className="rounded-[18px] border py-2"
                      style={{
                        borderColor: hexToRgba(outlineVariant, 0.18),
                        backgroundColor: hexToRgba(surfaceContainerLow, 0.72),
                      }}>
                      <SessionProfileMenuAction
                        icon="calendar-month"
                        title="Randevularim"
                        description="Yaklasan ve gecmis rezervasyonlarini ac."
                        onPress={() => handleNavigate('/(public)/randevularim')}
                      />
                      <SessionProfileMenuAction
                        icon="storefront"
                        title="Kuaforleri Ac"
                        description="Yeni randevu almak icin salonlari kesfet."
                        onPress={() => handleNavigate('/(public)/kuaforler')}
                      />
                      <SessionProfileMenuAction
                        icon="logout"
                        title="Cikis Yap"
                        description="Musteri oturumunu guvenli sekilde kapat."
                        tone="danger"
                        onPress={handleLogout}
                      />
                    </View>
                  </>
                ) : (
                  <View style={{ gap: 12 }}>
                    <View
                      className="rounded-[18px] border px-4 py-4"
                      style={{
                        gap: 6,
                        backgroundColor: hexToRgba(surfaceContainerLow, 0.88),
                        borderColor: hexToRgba(outlineVariant, 0.18),
                      }}>
                      <Text
                        className="font-label text-[10px] font-bold uppercase tracking-[2.2px]"
                        style={{ color: primary }}>
                        Musteri Girisi
                      </Text>
                      <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                        Giris yaparak randevularini yonet, favori berberlerini kaydet ve sonraki rezervasyonunu hizlandir.
                      </Text>
                    </View>

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
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
