import { Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { NotificationOverview, NotificationTheme } from './types';

interface NotificationStatsRowProps {
  overview: NotificationOverview;
  theme: NotificationTheme;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}

function StatCard({ label, value, color, bg }: StatCardProps) {
  return (
    <View
      className="flex-1 gap-1.5 rounded-[14px] border px-4 py-4"
      style={{ backgroundColor: bg, borderColor: hexToRgba(color, 0.12) }}>
      <Text
        className="font-label text-[9px] uppercase tracking-wide"
        style={{ color: hexToRgba(color, 0.7) }}>
        {label}
      </Text>
      <Text
        className="font-headline text-2xl leading-[26px]"
        style={{ color }}>
        {String(value).padStart(2, '0')}
      </Text>
    </View>
  );
}

export default function NotificationStatsRow({ overview, theme: adminTheme }: NotificationStatsRowProps) {

  return (
    <View className="flex-row gap-3">
      <StatCard
        label="Toplam"
        value={overview.total}
        color={adminTheme.onSurface}
        bg={adminTheme.cardBackgroundMuted}
      />
      <StatCard
        label="Okunmamis"
        value={overview.unread}
        color={adminTheme.primary}
        bg={hexToRgba(adminTheme.primary, 0.06)}
      />
      <StatCard
        label="Kritik"
        value={overview.critical}
        color={adminTheme.error}
        bg={hexToRgba(adminTheme.error, 0.06)}
      />
      <StatCard
        label="Bugun"
        value={overview.today}
        color={adminTheme.success}
        bg={hexToRgba(adminTheme.success, 0.06)}
      />
    </View>
  );
}
