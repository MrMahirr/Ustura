import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { getReservationStatusColor } from './presentation';
import type { ReservationListItem } from './types';

interface Props {
  reservation: ReservationListItem;
  onPress: () => void;
}

export default function ReservationMobileCard({ reservation, onPress }: Props) {
  const theme = useBarberAdminTheme();
  const statusPalette = getReservationStatusColor(reservation.status, theme);

  return (
    <Pressable
      onPress={onPress}
      className="gap-3 rounded-[10px] border p-4"
      style={({ hovered }) => [
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderSubtle,
        },
        Platform.OS === 'web' && hovered
          ? ({
              borderColor: hexToRgba(theme.primary, 0.25),
              transition: 'border-color 180ms ease',
              cursor: 'pointer',
            } as any)
          : Platform.OS === 'web'
            ? ({ transition: 'border-color 180ms ease', cursor: 'pointer' } as any)
            : null,
      ]}>
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}>
            <MaterialIcons name="person" size={20} color={theme.primary} />
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text
              numberOfLines={1}
              style={{
                color: theme.onSurface,
                fontFamily: 'Manrope-Bold',
                fontSize: 14,
              }}>
              {reservation.customerName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.7),
                fontSize: 12,
              }}>
              {reservation.staffName}
            </Text>
          </View>
        </View>

        <View
          className="rounded-full border px-2.5 py-1"
          style={{
            backgroundColor: statusPalette.bg,
            borderColor: statusPalette.border,
          }}>
          <Text
            style={{
              color: statusPalette.color,
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}>
            {reservation.statusLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3.5">
        <View className="min-w-[120px] flex-1 gap-1">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.6),
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.4,
            }}>
            Tarih
          </Text>
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-SemiBold',
              fontSize: 13,
            }}>
            {reservation.date}
          </Text>
        </View>
        <View className="min-w-[120px] flex-1 gap-1">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.6),
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.4,
            }}>
            Saat
          </Text>
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-SemiBold',
              fontSize: 13,
            }}>
            {reservation.time} – {reservation.endTime}
          </Text>
        </View>
        <View className="min-w-[80px] flex-1 gap-1">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.6),
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.4,
            }}>
            Süre
          </Text>
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-SemiBold',
              fontSize: 13,
            }}>
            {reservation.durationMinutes} dk
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
