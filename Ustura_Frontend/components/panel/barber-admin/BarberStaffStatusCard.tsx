import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { BarberStaffRecord } from './data';
import {
  getInteractiveWebStyle,
} from './presentation';
import { useBarberAdminTheme } from './theme';

function getStaffStatePresentation(
  state: BarberStaffRecord['state'],
  theme: ReturnType<typeof useBarberAdminTheme>,
) {
  if (state === 'busy') {
    return {
      dotColor: theme.warning,
      titleColor: theme.warning,
    };
  }

  if (state === 'available') {
    return {
      dotColor: theme.success,
      titleColor: theme.primary,
    };
  }

  return {
    dotColor: theme.surfaceContainerHighest,
    titleColor: hexToRgba(theme.onSurfaceVariant, 0.8),
  };
}

export default function BarberStaffStatusCard({
  staff,
}: {
  staff: BarberStaffRecord;
}) {
  const theme = useBarberAdminTheme();
  const state = getStaffStatePresentation(staff.state, theme);
  const isMuted = staff.state === 'break';

  return (
    <Pressable
      className="overflow-hidden rounded-xl border px-5 py-5"
      style={({ hovered, pressed }) => [
        {
          opacity: isMuted ? 0.76 : 1,
          backgroundColor: hovered ? theme.panelBackgroundStrong : theme.panelBackground,
          borderColor: hovered ? theme.borderStrong : theme.borderSubtle,
          transform: [{ scale: pressed ? 0.995 : 1 }],
        },
        getInteractiveWebStyle(),
      ]}>
      {({ hovered }) => (
        <>
          <View
            pointerEvents="none"
            className="absolute bottom-0 right-0 top-0 w-1"
            style={{
              opacity: hovered && !isMuted ? 1 : 0,
              backgroundColor: theme.primary,
            }}
          />

          <View className="mb-4 flex-row items-center gap-4">
            <View className="relative">
              {staff.imageUrl ? (
                <Image
                  source={{ uri: staff.imageUrl }}
                  contentFit="cover"
                  style={[
                    {
                      width: 56,
                      height: 56,
                      borderRadius: 10,
                    },
                    Platform.OS === 'web' ? ({ filter: 'grayscale(1)' } as any) : null,
                  ]}
                />
              ) : (
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    backgroundColor: theme.surfaceContainerHighest,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialIcons name="person" size={28} color={theme.onSurfaceVariant} />
                </View>
              )}
              <View
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2"
                style={{
                  backgroundColor: state.dotColor,
                  borderColor: theme.panelBackground,
                }}
              />
            </View>

            <View className="min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="font-body text-[15px]"
                style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold' }}>
                {staff.name}
              </Text>
              <Text
                numberOfLines={1}
                className="mt-1 font-body text-[10px] uppercase tracking-[2px]"
                style={{ color: state.titleColor, fontFamily: 'Manrope-Bold' }}>
                {staff.title}
              </Text>
            </View>
          </View>

          <View
            className="flex-row items-center justify-between rounded-lg px-4 py-4"
            style={{ backgroundColor: theme.panelBackgroundMuted }}>
            <View className="min-w-0 flex-1">
              <Text
                className="font-body text-[10px] uppercase tracking-[2px]"
                style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-SemiBold' }}>
                Siradaki Randevu
              </Text>
              <Text
                numberOfLines={1}
                className="mt-1 font-body text-sm"
                style={{
                  color: staff.nextAppointmentLabel ? theme.onSurface : theme.onSurfaceVariant,
                  fontFamily: 'Manrope-SemiBold',
                }}>
                {staff.nextAppointmentLabel ?? 'Su an aktif randevusu yok'}
              </Text>
            </View>

            <MaterialIcons name="arrow-forward-ios" size={16} color={theme.onSurfaceVariant} />
          </View>
        </>
      )}
    </Pressable>
  );
}
