import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { adminNotifications, type AdminNotification } from '@/components/panel/super-admin/data';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

function NotificationRow({ item }: { item: AdminNotification }) {
  const adminTheme = useSuperAdminTheme();

  const toneColor =
    item.tone === 'success'
      ? adminTheme.success
      : item.tone === 'warning'
        ? adminTheme.warning
        : item.tone === 'error'
          ? adminTheme.error
          : adminTheme.primary;

  const toneIcon =
    item.tone === 'success'
      ? 'verified'
      : item.tone === 'warning'
        ? 'schedule'
        : item.tone === 'error'
          ? 'priority-high'
          : 'campaign';

  return (
    <Pressable
      className="flex-row items-start gap-3 rounded-2xl border px-2.5 py-3"
      style={({ hovered }) => [
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundMuted : 'transparent',
          borderColor: item.unread ? hexToRgba(toneColor, 0.16) : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              cursor: 'pointer',
              transition: 'background-color 180ms ease, border-color 180ms ease',
            } as any)
          : null,
      ]}>
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: hexToRgba(toneColor, 0.12) }}>
        <MaterialIcons name={toneIcon} size={18} color={toneColor} />
      </View>

      <View className="min-w-0 flex-1 gap-1.5">
        <View className="flex-row items-start justify-between gap-2.5">
          <Text numberOfLines={1} className="flex-1 font-body text-base font-semibold leading-5" style={{ color: adminTheme.onSurface }}>
            {item.title}
          </Text>
          <Text className="shrink-0 font-label text-[9px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
            {item.time}
          </Text>
        </View>

        <Text numberOfLines={2} className="font-body text-[13px] leading-[19px]" style={{ color: adminTheme.onSurfaceVariant }}>
          {item.description}
        </Text>
      </View>

      {item.unread ? <View className="mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full" style={{ backgroundColor: toneColor }} /> : null}
    </Pressable>
  );
}

export default function NotificationsMenu() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const [open, setOpen] = React.useState(false);

  const unreadCount = adminNotifications.filter((item) => item.unread).length;
  const menuWidth = width < 520 ? Math.max(280, width - 32) : 360;

  return (
    <View className="relative z-[120]">
      {open && Platform.OS === 'web' ? <Pressable style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'transparent', zIndex: 110 } as any} onPress={() => setOpen(false)} /> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Bildirim menusu"
        onPress={() => setOpen((prev) => !prev)}
        className="relative z-[130] h-10 w-10 items-center justify-center rounded-xl border"
        style={({ hovered, pressed }) => [
          {
            backgroundColor: hovered || open ? adminTheme.cardBackgroundMuted : 'transparent',
            borderColor: open ? adminTheme.borderStrong : 'transparent',
            transform: [{ scale: pressed ? 0.96 : 1 }],
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
            <MaterialIcons
              name="notifications"
              size={22}
              color={hovered || open ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.75)}
            />
            {unreadCount > 0 ? (
              <View className="absolute right-px top-px min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 px-1" style={{ backgroundColor: adminTheme.primary, borderColor: adminTheme.surface }}>
                <Text className="font-body text-[9px] font-bold leading-[10px]" style={{ color: adminTheme.onPrimary }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </Pressable>

      {open ? (
        <View
          className="absolute right-0 top-[52px] z-[130] overflow-hidden rounded-[20px] border"
          style={{
            width: menuWidth,
            backgroundColor: adminTheme.cardBackground,
            borderColor: adminTheme.borderSubtle,
            ...(Platform.OS === 'web'
              ? ({
                  boxShadow:
                    adminTheme.theme === 'light'
                      ? '0 24px 60px rgba(27, 27, 32, 0.12)'
                      : '0 24px 60px rgba(0, 0, 0, 0.32)',
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: adminTheme.theme === 'light' ? 0.12 : 0.26,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 12,
                }),
          }}>
          <View className="flex-row items-start justify-between gap-3 border-b px-5 pb-4 pt-5" style={{ borderBottomColor: adminTheme.borderSubtle }}>
            <View>
              <Text className="mb-1 font-headline text-[22px]" style={{ color: adminTheme.onSurface }}>
                Bildirimler
              </Text>
              <Text className="max-w-[220px] font-body text-sm" style={{ color: adminTheme.onSurfaceVariant }}>
                {unreadCount} yeni olay, panel akisinda onceliklendirildi.
              </Text>
            </View>

            <View className="rounded-full px-2.5 py-1.5" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.12) }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: adminTheme.primary }}>
                Canli
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2.5 px-5 pb-1.5 pt-[14px]">
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: adminTheme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                Bekleyen
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: adminTheme.onSurface }}>
                02
              </Text>
            </View>
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: adminTheme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                Kritik
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: adminTheme.error }}>
                01
              </Text>
            </View>
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: adminTheme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                Bugun
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: adminTheme.primary }}>
                08
              </Text>
            </View>
          </View>

          <ScrollView style={{ maxHeight: 340 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }} showsVerticalScrollIndicator={false}>
            {adminNotifications.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </ScrollView>

          <View className="border-t p-3" style={{ borderTopColor: adminTheme.borderSubtle }}>
            <Pressable
              onPress={() => setOpen(false)}
              className="min-h-[46px] flex-row items-center justify-between rounded-[14px] px-4"
              style={({ hovered }) => [
                {
                  backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundMuted,
                },
                Platform.OS === 'web'
                  ? ({
                      cursor: 'pointer',
                      transition: 'background-color 180ms ease',
                    } as any)
                  : null,
              ]}>
              <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurface }}>
                Tum bildirimleri gor
              </Text>
              <MaterialIcons name="east" size={16} color={adminTheme.primary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
