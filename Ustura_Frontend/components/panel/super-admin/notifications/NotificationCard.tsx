import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { NotificationRecord, NotificationTheme } from './types';

interface NotificationCardProps {
  notification: NotificationRecord;
  onMarkRead: (id: string) => void;
  theme: NotificationTheme;
}

function toneIcon(tone: string): 'verified' | 'schedule' | 'priority-high' | 'campaign' {
  switch (tone) {
    case 'success':
      return 'verified';
    case 'warning':
      return 'schedule';
    case 'error':
      return 'priority-high';
    default:
      return 'campaign';
  }
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'Az once';
  if (diffMin < 60) return `${diffMin} dk once`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} sa once`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} gun once`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export default function NotificationCard({ notification, onMarkRead, theme: adminTheme }: NotificationCardProps) {

  const toneColor =
    notification.tone === 'success'
      ? adminTheme.success
      : notification.tone === 'warning'
        ? adminTheme.warning
        : notification.tone === 'error'
          ? adminTheme.error
          : adminTheme.primary;

  return (
    <Pressable
      onPress={() => {
        if (!notification.isRead) {
          onMarkRead(notification.id);
        }
      }}
      className="flex-row items-start gap-4 rounded-2xl border px-4 py-4"
      style={({ hovered }) => [
        {
          backgroundColor: hovered
            ? adminTheme.cardBackgroundMuted
            : notification.isRead
              ? 'transparent'
              : hexToRgba(toneColor, 0.03),
          borderColor: !notification.isRead
            ? hexToRgba(toneColor, 0.16)
            : adminTheme.borderSubtle,
        },
        Platform.OS === 'web'
          ? ({
              cursor: notification.isRead ? 'default' : 'pointer',
              transition: 'background-color 180ms ease, border-color 180ms ease',
            } as any)
          : null,
      ]}>
      <View
        className="mt-0.5 h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: hexToRgba(toneColor, 0.12) }}>
        <MaterialIcons name={toneIcon(notification.tone)} size={20} color={toneColor} />
      </View>

      <View className="min-w-0 flex-1 gap-1.5">
        <View className="flex-row items-start justify-between gap-3">
          <Text
            numberOfLines={1}
            className="flex-1 font-body text-base font-semibold leading-5"
            style={{ color: adminTheme.onSurface }}>
            {notification.title}
          </Text>
          <Text
            className="shrink-0 font-label text-[9px] uppercase tracking-wide"
            style={{ color: adminTheme.onSurfaceVariant }}>
            {formatTime(notification.createdAt)}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className="font-body text-[13px] leading-[19px]"
          style={{ color: adminTheme.onSurfaceVariant }}>
          {notification.body}
        </Text>

        <View className="mt-1 flex-row items-center gap-2">
          <View
            className="rounded-md px-2 py-0.5"
            style={{ backgroundColor: hexToRgba(toneColor, 0.1) }}>
            <Text
              className="font-label text-[9px] uppercase tracking-wide"
              style={{ color: toneColor }}>
              {notification.key}
            </Text>
          </View>
        </View>
      </View>

      {!notification.isRead ? (
        <View
          className="mt-2 h-[10px] w-[10px] shrink-0 rounded-full"
          style={{ backgroundColor: toneColor }}
        />
      ) : null}
    </Pressable>
  );
}
