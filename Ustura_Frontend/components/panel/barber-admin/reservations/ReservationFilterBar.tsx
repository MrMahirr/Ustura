import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { RESERVATION_FILTER_TABS, getReservationStatusColor } from './presentation';
import type { ReservationFilterStatus, ReservationOverview } from './types';

interface Props {
  activeFilter: ReservationFilterStatus;
  onFilterChange: (filter: ReservationFilterStatus) => void;
  overview: ReservationOverview;
}

function getCountForFilter(filter: ReservationFilterStatus, overview: ReservationOverview): number {
  switch (filter) {
    case 'all': return overview.total;
    case 'pending': return overview.pending;
    case 'confirmed': return overview.confirmed;
    case 'completed': return overview.completed;
    case 'cancelled': return overview.cancelled;
    case 'no_show': return overview.noShow;
  }
}

export default function ReservationFilterBar({ activeFilter, onFilterChange, overview }: Props) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: isMobile ? 8 : 10,
        paddingBottom: 2,
      }}>
      {RESERVATION_FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.id;
        const count = getCountForFilter(tab.id, overview);
        const statusColor =
          tab.id === 'all'
            ? { color: theme.primary, bg: theme.primary + '18', border: theme.primary + '30' }
            : getReservationStatusColor(tab.id, theme);

        return (
          <Pressable
            key={tab.id}
            onPress={() => onFilterChange(tab.id)}
            className="flex-row items-center gap-2 rounded-lg border px-4 py-2.5"
            style={({ hovered }) => [
              {
                backgroundColor: isActive ? statusColor.bg : 'transparent',
                borderColor: isActive ? statusColor.border : hexToRgba(theme.onSurfaceVariant, 0.12),
              },
              Platform.OS === 'web' && !isActive && hovered
                ? ({
                    backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.04),
                    borderColor: hexToRgba(theme.onSurfaceVariant, 0.2),
                  })
                : null,
              Platform.OS === 'web'
                ? ({
                    transition: 'all 180ms ease',
                    cursor: 'pointer',
                  } as any)
                : null,
            ]}>
            <MaterialIcons
              name={tab.icon}
              size={16}
              color={isActive ? statusColor.color : hexToRgba(theme.onSurfaceVariant, 0.65)}
            />
            <Text
              style={{
                color: isActive ? statusColor.color : theme.onSurface,
                fontFamily: isActive ? 'Manrope-Bold' : 'Manrope-SemiBold',
                fontSize: 12,
                letterSpacing: 0.3,
              }}>
              {tab.label}
            </Text>
            <View
              className="min-w-[22px] items-center rounded-full px-1.5 py-0.5"
              style={{
                backgroundColor: isActive
                  ? statusColor.color + '20'
                  : hexToRgba(theme.onSurfaceVariant, 0.08),
              }}>
              <Text
                style={{
                  color: isActive ? statusColor.color : hexToRgba(theme.onSurfaceVariant, 0.7),
                  fontFamily: 'Manrope-Bold',
                  fontSize: 10,
                }}>
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
