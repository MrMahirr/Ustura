import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { NotificationOverview, NotificationTheme } from './types';

interface NotificationPageHeaderProps {
  isWide: boolean;
  overview: NotificationOverview;
  onMarkAllRead: () => void;
  theme: NotificationTheme;
}

export default function NotificationPageHeader({
  isWide,
  overview,
  onMarkAllRead,
  theme: adminTheme,
}: NotificationPageHeaderProps) {

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
        onPress={onMarkAllRead}
        className="flex-row items-center gap-2 self-start rounded-xl border px-4 py-2.5"
        style={({ hovered }) => [
          {
            backgroundColor: hovered
              ? hexToRgba(adminTheme.primary, 0.08)
              : 'transparent',
            borderColor: hexToRgba(adminTheme.primary, 0.2),
          },
          Platform.OS === 'web'
            ? ({
                cursor: 'pointer',
                transition: 'background-color 180ms ease, border-color 180ms ease',
              } as any)
            : null,
        ]}>
        <MaterialIcons name="done-all" size={18} color={adminTheme.primary} />
        <Text
          className="font-label text-[11px] uppercase tracking-[1.5px]"
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-SemiBold' }}>
          Tumunu Okundu Isaretle
        </Text>
      </Pressable>
    </View>
  );
}
