import React from 'react';
import { Text, View } from 'react-native';

import type { SalonServiceRecord } from '@/services/salon-service.service';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';

export default function ServicesSummaryRow({
  services,
  isMobile,
}: {
  services: SalonServiceRecord[];
  isMobile: boolean;
}) {
  const theme = useBarberAdminTheme();
  const activeCount = services.filter((service) => service.isActive).length;
  const averageDuration =
    services.length > 0
      ? Math.round(
          services.reduce((total, service) => total + service.durationMinutes, 0) /
            services.length,
        )
      : 0;

  const summaryItems = [
    { id: 'total', label: 'Toplam hizmet', value: String(services.length) },
    { id: 'active', label: 'Aktif hizmet', value: String(activeCount) },
    {
      id: 'duration',
      label: 'Ortalama sure',
      value: services.length > 0 ? `${averageDuration} dk` : '-',
    },
  ];

  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        gap: 12,
      }}>
      {summaryItems.map((item) => (
        <View
          key={item.id}
          className="rounded-[22px] border px-4 py-4"
          style={{
            flex: isMobile ? undefined : 1,
            backgroundColor: theme.panelBackground,
            borderColor: theme.borderSubtle,
          }}>
          <Text
            className="font-label text-[11px] uppercase tracking-[1.8px]"
            style={{ color: theme.primary }}>
            {item.label}
          </Text>
          <Text
            className="mt-3 font-headline text-[28px] font-bold"
            style={{ color: theme.onSurface }}>
            {item.value}
          </Text>
          <Text
            className="mt-2 text-sm leading-6"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
            Hizmet panelindeki guncel katalog ozeti.
          </Text>
        </View>
      ))}
    </View>
  );
}
