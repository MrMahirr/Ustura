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

export default function ReservationRow({ reservation, onPress }: Props) {
  const theme = useBarberAdminTheme();
  const statusPalette = getReservationStatusColor(reservation.status, theme);

  return (
    <Pressable
      onPress={onPress}
      className="min-h-[72px] flex-row items-center px-6"
      style={({ hovered }) => [
        {
          backgroundColor: hovered ? hexToRgba(theme.primary, 0.03) : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease',
              cursor: 'pointer',
            } as any)
          : null,
      ]}>
      <View className="min-w-0 justify-center py-4" style={{ flex: 2.2 }}>
        <View className="flex-row items-center gap-3">
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
                fontSize: 13,
              }}>
              {reservation.customerName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.7),
                fontSize: 11,
              }}>
              {reservation.staffName}
            </Text>
          </View>
        </View>
      </View>

      <View className="min-w-0 justify-center py-4" style={{ flex: 1.5 }}>
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-SemiBold',
            fontSize: 13,
          }}>
          {reservation.date}
        </Text>
      </View>

      <View className="min-w-0 justify-center py-4" style={{ flex: 1.2 }}>
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-SemiBold',
            fontSize: 13,
          }}>
          {reservation.time} – {reservation.endTime}
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.65),
            fontSize: 11,
            marginTop: 1,
          }}>
          {reservation.durationMinutes} dk
        </Text>
      </View>

      <View className="min-w-0 justify-center py-4" style={{ flex: 1 }}>
        <View
          className="self-start rounded-full border px-2.5 py-1"
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

      <View className="min-w-0 items-end justify-center py-4" style={{ flex: 0.5 }}>
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={hexToRgba(theme.onSurfaceVariant, 0.5)}
        />
      </View>
    </Pressable>
  );
}
