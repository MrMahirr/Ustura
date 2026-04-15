import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';

import Card from '@/components/ui/Card';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { StaffOverview } from './types';

interface StaffOverviewCardsProps {
  overview: StaffOverview;
}

export default function StaffOverviewCards({ overview }: StaffOverviewCardsProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const columns = width >= 1280 ? 4 : width >= 720 ? 2 : 1;

  const cards = [
    {
      label: 'Aktif kadro',
      value: overview.total,
      icon: 'groups',
      tint: theme.primary,
      bg: hexToRgba(theme.primary, 0.1),
    },
    {
      label: 'Berber',
      value: overview.barberCount,
      icon: 'content-cut',
      tint: theme.success,
      bg: hexToRgba(theme.success, 0.12),
    },
    {
      label: 'Resepsiyon',
      value: overview.receptionistCount,
      icon: 'support-agent',
      tint: theme.warning,
      bg: hexToRgba(theme.warning, 0.14),
    },
    {
      label: 'Son 30 gun',
      value: overview.recentlyAdded,
      icon: 'bolt',
      tint: theme.onSurface,
      bg: hexToRgba(theme.onSurfaceVariant, 0.1),
    },
  ] as const;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
      }}>
      {cards.map((card) => (
        <Card
          key={card.label}
          variant="glass"
          style={{
            width: columns === 1 ? '100%' : columns === 2 ? '48%' : '23.7%',
            flexGrow: columns === 1 ? 1 : 0,
          }}
          contentStyle={{ gap: 14 }}>
          <View className="flex-row items-start justify-between gap-4">
            <View
              className="h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: card.bg }}>
              <MaterialIcons name={card.icon} size={22} color={card.tint} />
            </View>
            <Text
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.55),
                fontFamily: 'Manrope-Bold',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 1.6,
              }}>
              {card.label}
            </Text>
          </View>

          <View className="gap-1">
            <Text
              style={{
                color: theme.onSurface,
                fontFamily: 'Manrope-Bold',
                fontSize: 30,
                letterSpacing: -0.8,
              }}>
              {card.value}
            </Text>
            <Text
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.7),
                fontSize: 13,
                lineHeight: 20,
              }}>
              {card.label === 'Aktif kadro'
                ? 'Panelde gorunen personel erisimleri.'
                : card.label === 'Berber'
                  ? 'Servis akisini dogrudan ustlenen ekip.'
                  : card.label === 'Resepsiyon'
                    ? 'Karsilama ve organizasyon rollerinde olanlar.'
                    : 'Son bir ayda eklenen yeni personel.'}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}
