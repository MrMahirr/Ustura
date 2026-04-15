import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { BarberAppointmentRecord } from './data';
import { getInteractiveWebStyle } from './presentation';
import { useBarberAdminTheme } from './theme';

function getStatusPresentation(
  status: BarberAppointmentRecord['status'],
  theme: ReturnType<typeof useBarberAdminTheme>,
) {
  if (status === 'approved') {
    return {
      label: 'Onaylandi',
      textColor: theme.success,
      backgroundColor: theme.successSoft,
    };
  }

  if (status === 'pending') {
    return {
      label: 'Bekliyor',
      textColor: theme.warning,
      backgroundColor: theme.warningSoft,
    };
  }

  return {
    label: 'Iptal',
    textColor: theme.error,
    backgroundColor: theme.errorSoft,
  };
}

export default function BarberAppointmentRow({
  appointment,
}: {
  appointment: BarberAppointmentRecord;
}) {
  const theme = useBarberAdminTheme();
  const status = getStatusPresentation(appointment.status, theme);

  return (
    <Pressable
      className="rounded-xl border px-5 py-5"
      style={({ hovered, pressed }) => [
        {
          opacity: appointment.isDimmed ? 0.62 : 1,
          backgroundColor: hovered ? theme.panelBackgroundStrong : theme.panelBackground,
          borderColor: hovered ? theme.borderStrong : theme.borderSubtle,
          transform: [{ scale: pressed ? 0.995 : 1 }],
        },
        getInteractiveWebStyle(),
      ]}>
      <View className="gap-4 md:flex-row md:items-center md:gap-6">
        <View className="w-[92px]">
          <Text
            className="font-headline text-[24px]"
            style={{
              color: appointment.isDimmed ? theme.onSurfaceVariant : theme.primary,
              fontFamily: 'NotoSerif-Bold',
            }}>
            {appointment.time}
          </Text>
          <Text
            className="font-body text-[10px] uppercase tracking-[2px]"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.75), fontFamily: 'Manrope-SemiBold' }}>
            {appointment.durationLabel}
          </Text>
        </View>

        <View className="min-w-0 flex-1 flex-row items-center gap-4">
          {appointment.imageUrl ? (
            <Image
              source={{ uri: appointment.imageUrl }}
              contentFit="cover"
              style={[
                {
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                },
                Platform.OS === 'web' ? ({ filter: 'grayscale(1)' } as any) : null,
              ]}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: theme.surfaceContainerHighest,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="person" size={24} color={theme.onSurfaceVariant} />
            </View>
          )}
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="font-body text-[15px]"
              style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold' }}>
              {appointment.customerName}
            </Text>
            <View className="mt-1 flex-row items-center gap-1.5">
              <MaterialIcons name={appointment.serviceIcon} size={14} color={theme.onSurfaceVariant} />
              <Text
                numberOfLines={1}
                className="font-body text-xs"
                style={{ color: hexToRgba(theme.onSurfaceVariant, 0.9), fontFamily: 'Manrope-Regular' }}>
                {appointment.serviceLabel}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-[120px]">
          <Text
            className="font-body text-[10px] uppercase tracking-[2px]"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-SemiBold' }}>
            Berber
          </Text>
          <Text
            className="mt-1 font-body text-sm"
            style={{ color: theme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
            {appointment.barberName}
          </Text>
        </View>

        <View className="items-start md:items-end">
          <View
            className="rounded-md px-3 py-1.5"
            style={{ backgroundColor: status.backgroundColor }}>
            <Text
              className="font-body text-[10px] uppercase tracking-[2px]"
              style={{ color: status.textColor, fontFamily: 'Manrope-Bold' }}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
