import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { BarberAppointmentRecord } from './data';
import {
  barberAdminClassNames,
  getBarberPanelShadow,
  getInteractiveWebStyle,
} from './presentation';
import { useBarberAdminTheme } from './theme';
import BarberAppointmentRow from './BarberAppointmentRow';

export default function TodayAppointmentsPanel({
  appointments,
}: {
  appointments: BarberAppointmentRecord[];
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className={`${barberAdminClassNames.panelSection} px-5 py-5 md:px-6 md:py-6`}
      style={{
        backgroundColor: theme.panelBackground,
        borderColor: theme.borderSubtle,
        ...getBarberPanelShadow(theme),
      }}>
      <View className={barberAdminClassNames.panelHeader}>
        <Text
          className="font-headline text-[28px]"
          style={{ color: theme.onSurface, fontFamily: 'NotoSerif-Bold' }}>
          Bugunun Randevulari
        </Text>

        <Pressable
          style={({ hovered, pressed }) => [
            {
              opacity: pressed ? 0.85 : 1,
              transform: [{ translateY: pressed ? 1 : 0 }],
            },
            getInteractiveWebStyle(),
          ]}>
          <Text
            className="font-body text-[11px] uppercase tracking-[2px]"
            style={{
              color: hoveredColor(theme),
              fontFamily: 'Manrope-SemiBold',
            }}>
            Tumunu Gor
          </Text>
        </Pressable>
      </View>

      <View className={barberAdminClassNames.appointmentList}>
        {appointments.map((appointment) => (
          <BarberAppointmentRow key={appointment.id} appointment={appointment} />
        ))}
      </View>
    </View>
  );
}

function hoveredColor(theme: ReturnType<typeof useBarberAdminTheme>) {
  return hexToRgba(theme.primary, 0.98);
}
