import { Platform, ScrollView, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import type { OperationalReservationStatus } from '@/services/reservation.service';
import { hexToRgba } from '@/utils/color';

import { HOUR_SLOT_HEIGHT, SCHEDULE_END_HOUR, SCHEDULE_START_HOUR } from './data';
import ScheduleAppointmentBlock from './ScheduleAppointmentBlock';
import type { ScheduleWeek } from './types';

interface ScheduleWeekGridProps {
  week: ScheduleWeek;
  onCancel: (reservationId: string) => void;
  onUpdateStatus: (reservationId: string, status: OperationalReservationStatus) => void;
  mutating: boolean;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

const TIME_GUTTER_WIDTH = 52;

function DayColumnHeader({
  dayLabel,
  dateLabel,
  isToday,
}: {
  dayLabel: string;
  dateLabel: string;
  isToday: boolean;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View className="flex-1 items-center border-l py-3" style={{ borderLeftColor: hexToRgba(theme.onSurfaceVariant, 0.06) }}>
      <Text
        className="font-label text-[10px] font-bold uppercase tracking-widest"
        style={{ color: isToday ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.5) }}>
        {dayLabel}
      </Text>
      <View
        className="mt-1 h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: isToday ? theme.primary : 'transparent',
        }}>
        <Text
          className="font-headline text-sm font-bold"
          style={{
            color: isToday ? theme.onPrimary : theme.onSurface,
            fontFamily: theme.serifFont,
          }}>
          {dateLabel}
        </Text>
      </View>
    </View>
  );
}

function HourLabel({ hour }: { hour: number }) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="items-end justify-start pr-2"
      style={{ height: HOUR_SLOT_HEIGHT, width: TIME_GUTTER_WIDTH }}>
      <Text
        className="font-label text-[10px] font-bold uppercase tracking-widest"
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.4),
          marginTop: -7,
        }}>
        {pad(hour)}:00
      </Text>
    </View>
  );
}

function DayColumn({
  week,
  dayIndex,
  onCancel,
  onUpdateStatus,
  mutating,
}: {
  week: ScheduleWeek;
  dayIndex: number;
  onCancel: (id: string) => void;
  onUpdateStatus: (id: string, status: OperationalReservationStatus) => void;
  mutating: boolean;
}) {
  const theme = useBarberAdminTheme();
  const totalSlots = SCHEDULE_END_HOUR - SCHEDULE_START_HOUR;
  const totalHeight = totalSlots * HOUR_SLOT_HEIGHT;
  const day = week.days[dayIndex];
  const hours = Array.from({ length: totalSlots }, (_, i) => SCHEDULE_START_HOUR + i);

  return (
    <View className="relative flex-1 border-l" style={{ height: totalHeight, borderLeftColor: hexToRgba(theme.onSurfaceVariant, 0.06) }}>
      {hours.map((hour) => (
        <View
          key={hour}
          className="border-t"
          style={{
            height: HOUR_SLOT_HEIGHT,
            borderTopColor: hexToRgba(theme.onSurfaceVariant, 0.06),
          }}
        />
      ))}

      <View className="absolute inset-0" style={{ marginHorizontal: 2 }}>
        {day.appointments.map((apt) => (
          <ScheduleAppointmentBlock
            key={apt.id}
            appointment={apt}
            onCancel={onCancel}
            onUpdateStatus={onUpdateStatus}
            mutating={mutating}
            compact
          />
        ))}
      </View>
    </View>
  );
}

export default function ScheduleWeekGrid({
  week,
  onCancel,
  onUpdateStatus,
  mutating,
}: ScheduleWeekGridProps) {
  const theme = useBarberAdminTheme();
  const totalSlots = SCHEDULE_END_HOUR - SCHEDULE_START_HOUR;
  const totalHeight = totalSlots * HOUR_SLOT_HEIGHT;
  const hours = Array.from({ length: totalSlots }, (_, i) => SCHEDULE_START_HOUR + i);

  return (
    <View className="flex-1">
      <View
        className="flex-row border-b"
        style={{
          borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.08),
          ...(Platform.OS === 'web'
            ? ({
                position: 'sticky',
                top: 0,
                zIndex: 20,
                backgroundColor: theme.surface,
              } as any)
            : {}),
        }}>
        <View style={{ width: TIME_GUTTER_WIDTH }} />
        {week.days.map((day, i) => (
          <DayColumnHeader
            key={i}
            dayLabel={day.dayLabel}
            dateLabel={day.dateLabel}
            isToday={day.isToday}
          />
        ))}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row" style={{ minHeight: totalHeight }}>
          <View style={{ width: TIME_GUTTER_WIDTH }}>
            {hours.map((hour) => (
              <HourLabel key={hour} hour={hour} />
            ))}
          </View>

          {week.days.map((_, i) => (
            <DayColumn
              key={i}
              week={week}
              dayIndex={i}
              onCancel={onCancel}
              onUpdateStatus={onUpdateStatus}
              mutating={mutating}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
