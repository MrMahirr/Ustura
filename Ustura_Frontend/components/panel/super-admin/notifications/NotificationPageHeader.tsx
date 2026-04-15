import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { NotificationOverview, NotificationTheme } from './types';

interface NotificationPageHeaderProps {
  isWide: boolean;
  overview: NotificationOverview;
  onMarkAllRead: () => void | Promise<void>;
  isMarkingAllRead?: boolean;
  theme: NotificationTheme;
}

export default function NotificationPageHeader({
  isWide,
  overview,
  onMarkAllRead,
  isMarkingAllRead = false,
  theme: adminTheme,
}: NotificationPageHeaderProps) {
  const hasUnread = overview.unread > 0;
  const markDisabled = !hasUnread || isMarkingAllRead;

  return (
    <View className={isWide ? 'flex-row items-end justify-between gap-6' : 'gap-4'}>
      <View className="max-w-[720px] gap-2.5">
        <Text
          className="font-headline text-[34px] font-bold tracking-tight"
          style={{ color: adminTheme.onSurface }}>
          Bildirimler
        </Text>
        <Text
          className="font-body text-base"
          style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
          Platform olaylarini, sistem uyarilarini ve guvenlik bildirimlerini buradan takip edin.
        </Text>
      </View>

      <Pressable
        disabled={markDisabled}
        onPress={() => {
          void onMarkAllRead();
        }}
        className="flex-row items-center gap-2 self-start rounded-xl border px-4 py-2.5"
        style={({ hovered, pressed }) => {
          const webHover = Platform.OS === 'web' && hovered && !markDisabled;
          const webPressed = Platform.OS === 'web' && pressed && !markDisabled;
          const translateY = webHover ? -2 : webPressed ? 0.5 : 0;
          const scale = webHover ? 1.01 : webPressed ? 0.985 : 1;
          const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
          const duration = '300ms';

          return [
            {
              opacity: markDisabled ? 0.45 : 1,
              backgroundColor: webHover
                ? hexToRgba(adminTheme.primary, 0.12)
                : 'transparent',
              borderColor: webHover
                ? hexToRgba(adminTheme.primary, 0.45)
                : hexToRgba(adminTheme.primary, 0.22),
              transform: [{ translateY }, { scale }],
            },
            Platform.OS === 'web'
              ? ({
                  cursor: markDisabled ? 'not-allowed' : 'pointer',
                  transition: [
                    `transform ${duration} ${ease}`,
                    `background-color ${duration} ${ease}`,
                    `border-color ${duration} ${ease}`,
                    `box-shadow ${duration} ${ease}`,
                    `opacity ${duration} ${ease}`,
                  ].join(', '),
                  boxShadow: webHover
                    ? `0 8px 22px ${hexToRgba(adminTheme.primary, 0.16)}`
                    : '0 2px 8px transparent',
                } as any)
              : null,
          ];
        }}>
        {isMarkingAllRead ? (
          <ActivityIndicator size="small" color={adminTheme.primary} />
        ) : (
          <MaterialIcons name="done-all" size={18} color={adminTheme.primary} />
        )}
        <Text
          className="font-label text-[11px] uppercase tracking-[1.5px]"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-SemiBold' }}>
          Tumunu Okundu Isaretle
        </Text>
      </Pressable>
    </View>
  );
}
