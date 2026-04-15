import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { logClassNames } from './presentation';
import type { LogOverview } from './types';

interface LogStatsRowProps {
  overview: LogOverview;
}

interface StatCardData {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}

export default function LogStatsRow({ overview }: LogStatsRowProps) {
  const adminTheme = useSuperAdminTheme();

  const cards: StatCardData[] = React.useMemo(
    () => [
      {
        label: 'Toplam Kayıt',
        value: overview.total.toLocaleString('tr-TR'),
        icon: 'receipt-long',
        color: adminTheme.primary,
      },
      {
        label: 'Bugün',
        value: String(overview.todayCount),
        icon: 'today',
        color: adminTheme.success,
      },
      {
        label: 'Kimlik Doğrulama',
        value: String(overview.authCount),
        icon: 'verified-user',
        color: adminTheme.tertiary,
      },
      {
        label: 'Personel',
        value: String(overview.staffCount),
        icon: 'badge',
        color: adminTheme.warning,
      },
      {
        label: 'Randevu',
        value: String(overview.reservationCount),
        icon: 'event-note',
        color: adminTheme.secondary,
      },
    ],
    [overview, adminTheme],
  );

  return (
    <View className={logClassNames.statsGrid}>
      {cards.map((card) => (
        <View
          key={card.label}
          className="min-h-[82px] min-w-[140px] flex-1 justify-between rounded-[7px] border px-[14px] py-3"
          style={[
            {
              backgroundColor: adminTheme.cardBackground,
              borderColor: adminTheme.borderSubtle,
            },
            Platform.OS === 'web'
              ? ({
                  transition: 'background-color 180ms ease, border-color 180ms ease',
                } as any)
              : null,
          ]}>
          <View className="flex-row items-center justify-between">
            <Text
              className="font-label text-[9px] uppercase tracking-[1.8px]"
              style={{
                color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
                fontFamily: 'Manrope-Bold',
              }}>
              {card.label}
            </Text>
            <MaterialIcons name={card.icon} size={16} color={hexToRgba(card.color, 0.6)} />
          </View>
          <Text
            className="font-body text-2xl"
            style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            {card.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
