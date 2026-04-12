import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { staffRoutes } from '@/constants/routes';
import type { NotificationRecord } from '@/services/notification.service';
import { hexToRgba } from '@/utils/color';

import {
  formatRelativeTime,
  useNotificationsDropdown,
} from '../super-admin/use-notifications-dropdown';
import { useBarberAdminTheme } from './theme';

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationRecord;
  onPress: () => void;
}) {
  const theme = useBarberAdminTheme();

  const toneColor =
    item.tone === 'success'
      ? theme.success
      : item.tone === 'warning'
        ? theme.warning
        : item.tone === 'error'
          ? theme.error
          : theme.primary;

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
      onPress={onPress}
      className="flex-row items-start gap-3 rounded-2xl border px-2.5 py-3"
      style={({ hovered }) => [
        {
          backgroundColor: hovered ? theme.cardBackgroundMuted : 'transparent',
          borderColor: !item.isRead ? hexToRgba(toneColor, 0.16) : 'transparent',
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
          <Text numberOfLines={1} className="flex-1 font-body text-base font-semibold leading-5" style={{ color: theme.onSurface }}>
            {item.title}
          </Text>
          <Text className="shrink-0 font-label text-[9px] uppercase tracking-wide" style={{ color: theme.onSurfaceVariant }}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        <Text numberOfLines={2} className="font-body text-[13px] leading-[19px]" style={{ color: theme.onSurfaceVariant }}>
          {item.body}
        </Text>
      </View>

      {!item.isRead ? <View className="mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full" style={{ backgroundColor: toneColor }} /> : null}
    </Pressable>
  );
}

function padStat(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default function BarberNotificationsMenu() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const { items, stats, loading, markAsRead } =
    useNotificationsDropdown(open);

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
            backgroundColor: hovered || open ? theme.cardBackgroundMuted : 'transparent',
            borderColor: open ? theme.borderStrong : 'transparent',
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
              color={hovered || open ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.75)}
            />
            {stats.unread > 0 ? (
              <View className="absolute right-px top-px min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 px-1" style={{ backgroundColor: theme.primary, borderColor: theme.surface }}>
                <Text className="font-body text-[9px] font-bold leading-[10px]" style={{ color: theme.onPrimary }}>
                  {stats.unread > 9 ? '9+' : stats.unread}
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
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderSubtle,
            ...(Platform.OS === 'web'
              ? ({
                  boxShadow:
                    theme.theme === 'light'
                      ? '0 24px 60px rgba(27, 27, 32, 0.12)'
                      : '0 24px 60px rgba(0, 0, 0, 0.32)',
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: theme.theme === 'light' ? 0.12 : 0.26,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 12,
                }),
          }}>
          <View className="flex-row items-start justify-between gap-3 border-b px-5 pb-4 pt-5" style={{ borderBottomColor: theme.borderSubtle }}>
            <View>
              <Text className="mb-1 font-headline text-[22px]" style={{ color: theme.onSurface }}>
                Bildirimler
              </Text>
              <Text className="max-w-[220px] font-body text-sm" style={{ color: theme.onSurfaceVariant }}>
                {stats.unread} yeni bildirim bekliyor.
              </Text>
            </View>

            <View className="rounded-full px-2.5 py-1.5" style={{ backgroundColor: hexToRgba(theme.primary, 0.12) }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: theme.primary }}>
                Canli
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2.5 px-5 pb-1.5 pt-[14px]">
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: theme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: theme.onSurfaceVariant }}>
                Bekleyen
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: theme.onSurface }}>
                {padStat(stats.unread)}
              </Text>
            </View>
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: theme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: theme.onSurfaceVariant }}>
                Kritik
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: theme.error }}>
                {padStat(stats.critical)}
              </Text>
            </View>
            <View className="flex-1 gap-1.5 rounded-[14px] px-3 py-3" style={{ backgroundColor: theme.cardBackgroundMuted }}>
              <Text className="font-label text-[9px] uppercase tracking-wide" style={{ color: theme.onSurfaceVariant }}>
                Bugun
              </Text>
              <Text className="font-headline text-xl leading-[22px]" style={{ color: theme.primary }}>
                {padStat(stats.today)}
              </Text>
            </View>
          </View>

          <ScrollView style={{ maxHeight: 340 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }} showsVerticalScrollIndicator={false}>
            {loading && items.length === 0 ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : items.length === 0 ? (
              <View className="items-center justify-center gap-2 py-10">
                <MaterialIcons name="notifications-none" size={32} color={theme.onSurfaceVariant} />
                <Text className="font-body text-sm" style={{ color: theme.onSurfaceVariant }}>
                  Henuz bildirim yok.
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onPress={() => {
                    if (!item.isRead) markAsRead(item.id);
                  }}
                />
              ))
            )}
          </ScrollView>

          <View className="border-t p-3" style={{ borderTopColor: theme.borderSubtle }}>
            <Pressable
              onPress={() => {
                setOpen(false);
                router.push(staffRoutes.bildirimler);
              }}
              className="min-h-[46px] flex-row items-center justify-between rounded-[14px] px-4"
              style={({ hovered }) => [
                {
                  backgroundColor: hovered ? theme.cardBackgroundStrong : theme.cardBackgroundMuted,
                },
                Platform.OS === 'web'
                  ? ({
                      cursor: 'pointer',
                      transition: 'background-color 180ms ease',
                    } as any)
                  : null,
              ]}>
              <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: theme.onSurface }}>
                Tum bildirimleri gor
              </Text>
              <MaterialIcons name="east" size={16} color={theme.primary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
