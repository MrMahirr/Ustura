import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import type { OperationalReservationStatus } from '@/services/reservation.service';
import { hexToRgba } from '@/utils/color';

import { HOUR_SLOT_HEIGHT, SCHEDULE_START_HOUR } from './data';
import { SCHEDULE_COPY } from './presentation';
import type { ScheduleAppointment, ScheduleAppointmentStatus } from './types';

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function statusColor(status: ScheduleAppointmentStatus, theme: ReturnType<typeof useBarberAdminTheme>) {
  switch (status) {
    case 'completed':
      return theme.success;
    case 'upcoming':
      return theme.warning;
    case 'cancelled':
      return theme.error;
  }
}

function statusLabel(status: ScheduleAppointmentStatus): string {
  switch (status) {
    case 'completed':
      return SCHEDULE_COPY.completedStatus;
    case 'upcoming':
      return SCHEDULE_COPY.upcomingStatus;
    case 'cancelled':
      return SCHEDULE_COPY.cancelledStatus;
  }
}

interface ScheduleAppointmentBlockProps {
  appointment: ScheduleAppointment;
  onCancel: (reservationId: string) => void;
  onUpdateStatus: (reservationId: string, status: OperationalReservationStatus) => void;
  mutating: boolean;
}

function ActionMenu({
  appointment,
  onCancel,
  onUpdateStatus,
  onClose,
}: {
  appointment: ScheduleAppointment;
  onCancel: (id: string) => void;
  onUpdateStatus: (id: string, status: OperationalReservationStatus) => void;
  onClose: () => void;
}) {
  const theme = useBarberAdminTheme();

  const actions: { label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string; onPress: () => void }[] = [];

  if (appointment.backendStatus === 'pending') {
    actions.push({
      label: 'Onayla',
      icon: 'check-circle',
      color: theme.success,
      onPress: () => { onUpdateStatus(appointment.backendId, 'confirmed'); onClose(); },
    });
  }

  if (appointment.backendStatus === 'confirmed') {
    actions.push({
      label: 'Tamamla',
      icon: 'done-all',
      color: theme.success,
      onPress: () => { onUpdateStatus(appointment.backendId, 'completed'); onClose(); },
    });
    actions.push({
      label: 'Gelmedi',
      icon: 'person-off',
      color: theme.warning,
      onPress: () => { onUpdateStatus(appointment.backendId, 'no_show'); onClose(); },
    });
  }

  if (appointment.backendStatus !== 'cancelled' && appointment.backendStatus !== 'completed' && appointment.backendStatus !== 'no_show') {
    actions.push({
      label: 'İptal Et',
      icon: 'cancel',
      color: theme.error,
      onPress: () => { onCancel(appointment.backendId); onClose(); },
    });
  }

  if (actions.length === 0) return null;

  return (
    <View
      className="absolute right-0 top-0 z-50 min-w-[140px] rounded-sm border p-1"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.borderSubtle,
        ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } as any : {}),
      }}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          className="flex-row items-center gap-2 rounded-sm px-3 py-2"
          style={({ hovered }) => [
            hovered ? { backgroundColor: theme.surfaceContainerHigh } : null,
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
          ]}>
          <MaterialIcons name={action.icon} size={16} color={action.color} />
          <Text
            className="font-label text-xs font-medium"
            style={{ color: theme.onSurface }}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function ScheduleAppointmentBlock({
  appointment,
  onCancel,
  onUpdateStatus,
  mutating,
}: ScheduleAppointmentBlockProps) {
  const theme = useBarberAdminTheme();
  const isDark = theme.theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  const topOffset =
    (appointment.startHour - SCHEDULE_START_HOUR + appointment.startMinute / 60) *
    HOUR_SLOT_HEIGHT;
  const blockHeight = (appointment.durationMinutes / 60) * HOUR_SLOT_HEIGHT;
  const isCancelled = appointment.status === 'cancelled';
  const isCompact = blockHeight <= 60;
  const color = statusColor(appointment.status, theme);

  const startStr = `${pad(appointment.startHour)}:${pad(appointment.startMinute)}`;
  const endMinTotal = appointment.startHour * 60 + appointment.startMinute + appointment.durationMinutes;
  const endStr = `${pad(Math.floor(endMinTotal / 60))}:${pad(endMinTotal % 60)}`;

  const canAct = !isCancelled && appointment.backendStatus !== 'completed' && appointment.backendStatus !== 'no_show';

  const bgBase = isDark
    ? hexToRgba(theme.surfaceContainerLow, isCancelled ? 0.4 : 0.8)
    : hexToRgba(theme.surfaceContainerLowest, isCancelled ? 0.5 : 0.92);

  return (
    <Pressable
      className="absolute rounded-sm"
      onPress={() => { if (canAct && !mutating) setMenuOpen((v) => !v); }}
      style={({ hovered }) => [
        {
          top: topOffset,
          left: 0,
          right: '10%',
          height: blockHeight,
          backgroundColor: hovered
            ? (isDark ? theme.surfaceContainerLow : theme.surfaceContainerLow)
            : bgBase,
          borderLeftWidth: 4,
          borderLeftColor: hexToRgba(color, isCancelled ? 0.4 : 0.8),
          opacity: isCancelled ? 0.7 : mutating ? 0.5 : 1,
        },
        Platform.OS === 'web'
          ? ({
              cursor: canAct ? 'pointer' : 'default',
              transition: 'background-color 180ms ease, opacity 180ms ease',
              backdropFilter: 'blur(8px)',
            } as any)
          : null,
        Platform.OS === 'web' && isCancelled ? ({ filter: 'grayscale(0.4)' } as any) : null,
      ]}>
      {({ hovered }) => (
        <>
          {menuOpen && canAct ? (
            <ActionMenu
              appointment={appointment}
              onCancel={onCancel}
              onUpdateStatus={onUpdateStatus}
              onClose={() => setMenuOpen(false)}
            />
          ) : null}

          {isCompact ? (
            <View className="flex-1 flex-row items-center gap-4 px-3">
              {appointment.imageUrl ? (
                <Image
                  source={{ uri: appointment.imageUrl }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    backgroundColor: theme.surfaceContainerHighest,
                  }}
                  contentFit="cover"
                />
              ) : null}
              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={1}
                  className="font-headline text-sm font-bold leading-none"
                  style={{ color: theme.onSurface }}>
                  {appointment.customerName}
                </Text>
                <Text
                  className="mt-1 font-label text-[10px] uppercase tracking-wider"
                  style={{ color: theme.onSurfaceVariant }}>
                  {appointment.staffName}
                  <Text style={{ opacity: 0.3 }}> {'\u2022'} </Text>
                  {appointment.durationMinutes} dk
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text
                  className="font-label text-[10px] font-bold uppercase tracking-widest"
                  style={{ color }}>
                  {statusLabel(appointment.status)}
                </Text>
                <Text
                  className="rounded-sm px-2 py-1 font-label text-[10px] font-medium"
                  style={{
                    backgroundColor: theme.surfaceContainerHighest,
                    color: theme.onSurfaceVariant,
                  }}>
                  {startStr}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1 p-4">
              <View className="flex-row items-start justify-between">
                <View className="min-w-0 flex-1">
                  <View className="mb-1 flex-row items-center gap-2">
                    <Text
                      className="font-label text-[10px] font-bold uppercase tracking-widest"
                      style={{ color }}>
                      {statusLabel(appointment.status)}
                    </Text>
                    <View
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.3) }}
                    />
                    <Text
                      className="font-label text-[10px] font-medium"
                      style={{ color: theme.onSurfaceVariant }}>
                      {startStr} — {endStr}
                    </Text>
                  </View>
                  <Text
                    className="font-headline text-lg font-bold"
                    style={[
                      { color: theme.onSurface, fontFamily: theme.serifFont },
                      isCancelled
                        ? ({
                            textDecorationLine: 'line-through',
                            textDecorationColor: hexToRgba(theme.onSurface, 0.4),
                          } as any)
                        : null,
                    ]}>
                    {appointment.customerName}
                  </Text>
                  <Text
                    className="mt-1 font-label text-xs uppercase tracking-wider"
                    style={{ color: theme.onSurfaceVariant }}>
                    {appointment.staffName}
                    <Text style={{ opacity: 0.3 }}> | </Text>
                    {appointment.durationMinutes} dk
                  </Text>
                </View>

                {isCancelled ? (
                  <MaterialIcons
                    name="event-busy"
                    size={20}
                    color={hexToRgba(theme.error, 0.5)}
                  />
                ) : (
                  <View
                    style={{
                      opacity: hovered ? 1 : 0,
                      ...(Platform.OS === 'web'
                        ? ({ transition: 'opacity 180ms ease' } as any)
                        : {}),
                    }}>
                    <MaterialIcons
                      name="more-vert"
                      size={18}
                      color={theme.onSurfaceVariant}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
