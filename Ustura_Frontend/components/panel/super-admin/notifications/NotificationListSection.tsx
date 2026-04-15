import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import NotificationCard from './NotificationCard';
import type { NotificationRecord, NotificationTheme } from './types';

interface NotificationListSectionProps {
  notifications: NotificationRecord[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onMarkRead: (id: string) => void;
  onRefresh: () => void;
  theme: NotificationTheme;
}

export default function NotificationListSection({
  notifications,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onMarkRead,
  onRefresh,
  theme: adminTheme,
}: NotificationListSectionProps) {

  if (isLoading) {
    return (
      <View className="items-center justify-center py-16">
        <ActivityIndicator size="large" color={adminTheme.primary} />
        <Text
          className="mt-3 font-body text-sm"
          style={{ color: adminTheme.onSurfaceVariant }}>
          Bildirimler yukleniyor...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center gap-3 py-16">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: hexToRgba(adminTheme.error, 0.1) }}>
          <MaterialIcons name="error-outline" size={28} color={adminTheme.error} />
        </View>
        <Text
          className="max-w-[360px] text-center font-body text-sm"
          style={{ color: adminTheme.onSurfaceVariant }}>
          {error}
        </Text>
        <Pressable
          onPress={onRefresh}
          className="mt-1 rounded-lg border px-4 py-2"
          style={({ hovered }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.primary, 0.08)
                : 'transparent',
              borderColor: hexToRgba(adminTheme.primary, 0.2),
            },
            Platform.OS === 'web'
              ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
              : null,
          ]}>
          <Text
            className="font-label text-[10px] uppercase tracking-[1.2px]"
            style={{ color: adminTheme.primary }}>
            Tekrar Dene
          </Text>
        </Pressable>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="items-center justify-center gap-3 py-16">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.1) }}>
          <MaterialIcons name="notifications-none" size={28} color={adminTheme.primary} />
        </View>
        <Text
          className="font-headline text-xl"
          style={{ color: adminTheme.onSurface }}>
          Bildirim Bulunamadi
        </Text>
        <Text
          className="max-w-[320px] text-center font-body text-sm"
          style={{ color: adminTheme.onSurfaceVariant }}>
          Secili filtrelere uygun bildirim yok. Filtreleri sifirlayin veya yeni bildirimleri bekleyin.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text
          className="font-label text-[10px] uppercase tracking-wide"
          style={{ color: adminTheme.onSurfaceVariant }}>
          {notifications.length} bildirim listeleniyor
        </Text>
      </View>

      <View className="gap-2">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
            theme={adminTheme}
          />
        ))}
      </View>

      {totalPages > 1 ? (
        <View className="flex-row items-center justify-center gap-3 pt-4">
          <Pressable
            onPress={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex-row items-center gap-1 rounded-lg border px-3 py-2"
            style={({ hovered }) => [
              {
                opacity: page <= 1 ? 0.4 : 1,
                backgroundColor: hovered && page > 1
                  ? adminTheme.cardBackgroundMuted
                  : 'transparent',
                borderColor: adminTheme.borderSubtle,
              },
              Platform.OS === 'web'
                ? ({ cursor: page <= 1 ? 'not-allowed' : 'pointer', transition: 'background-color 180ms ease' } as any)
                : null,
            ]}>
            <MaterialIcons name="chevron-left" size={18} color={adminTheme.onSurfaceVariant} />
            <Text
              className="font-label text-[10px] uppercase tracking-wide"
              style={{ color: adminTheme.onSurfaceVariant }}>
              Onceki
            </Text>
          </Pressable>

          <Text
            className="font-body text-sm"
            style={{ color: adminTheme.onSurfaceVariant }}>
            {page} / {totalPages}
          </Text>

          <Pressable
            onPress={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex-row items-center gap-1 rounded-lg border px-3 py-2"
            style={({ hovered }) => [
              {
                opacity: page >= totalPages ? 0.4 : 1,
                backgroundColor: hovered && page < totalPages
                  ? adminTheme.cardBackgroundMuted
                  : 'transparent',
                borderColor: adminTheme.borderSubtle,
              },
              Platform.OS === 'web'
                ? ({ cursor: page >= totalPages ? 'not-allowed' : 'pointer', transition: 'background-color 180ms ease' } as any)
                : null,
            ]}>
            <Text
              className="font-label text-[10px] uppercase tracking-wide"
              style={{ color: adminTheme.onSurfaceVariant }}>
              Sonraki
            </Text>
            <MaterialIcons name="chevron-right" size={18} color={adminTheme.onSurfaceVariant} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
