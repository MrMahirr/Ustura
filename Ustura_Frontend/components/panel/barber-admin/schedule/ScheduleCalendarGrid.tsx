import { ScrollView, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import type { OperationalReservationStatus } from '@/services/reservation.service';
import { hexToRgba } from '@/utils/color';

import { HOUR_SLOT_HEIGHT, SCHEDULE_END_HOUR, SCHEDULE_START_HOUR } from './data';
import ScheduleAppointmentBlock from './ScheduleAppointmentBlock';
import type { ScheduleAppointment } from './types';

interface ScheduleCalendarGridProps {
  appointments: ScheduleAppointment[];
  onCancel: (reservationId: string) => void;
  onUpdateStatus: (reservationId: string, status: OperationalReservationStatus) => void;
  mutating: boolean;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function TimeSlotRow({ hour }: { hour: number }) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="relative border-t"
      style={{
        height: HOUR_SLOT_HEIGHT,
        borderTopColor: hexToRgba(theme.onSurfaceVariant, 0.08),
      }}>
      <Text
        className="absolute font-label text-[10px] font-bold uppercase tracking-widest"
        style={{
          top: -8,
          left: -2,
          color: hexToRgba(theme.onSurfaceVariant, 0.4),
        }}>
        {pad(hour)}:00
      </Text>
    </View>
  );
}

export default function ScheduleCalendarGrid({
  appointments,
  onCancel,
  onUpdateStatus,
  mutating,
}: ScheduleCalendarGridProps) {
  const theme = useBarberAdminTheme();
  const totalSlots = SCHEDULE_END_HOUR - SCHEDULE_START_HOUR;
  const totalHeight = totalSlots * HOUR_SLOT_HEIGHT;
  const hours = Array.from(
    { length: totalSlots },
    (_, i) => SCHEDULE_START_HOUR + i,
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 40, paddingLeft: 16 }}
      showsVerticalScrollIndicator={false}>
      <View className="relative" style={{ minHeight: totalHeight }}>
        <View className="absolute inset-0">
          {hours.map((hour) => (
            <TimeSlotRow key={hour} hour={hour} />
          ))}
        </View>

        <View className="relative z-10" style={{ marginLeft: 64, height: totalHeight }}>
          {appointments.map((apt) => (
            <ScheduleAppointmentBlock
              key={apt.id}
              appointment={apt}
              onCancel={onCancel}
              onUpdateStatus={onUpdateStatus}
              mutating={mutating}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
