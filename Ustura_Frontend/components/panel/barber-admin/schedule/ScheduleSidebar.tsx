import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { SCHEDULE_COPY } from './presentation';
import type { ScheduleNextUp, ScheduleOverview } from './types';

interface StatCardProps {
  label: string;
  value: number;
  delta: string;
  accentColor: string;
}

function StatCard({ label, value, delta, accentColor }: StatCardProps) {
  const theme = useBarberAdminTheme();

  return (
    <Pressable
      className="rounded-sm border-l-2 p-5"
      style={({ hovered }) => [
        {
          backgroundColor: hovered
            ? theme.surfaceContainerHigh
            : theme.surfaceContainerLow,
          borderLeftColor: accentColor,
        },
        Platform.OS === 'web'
          ? ({ cursor: 'default', transition: 'background-color 180ms ease' } as any)
          : null,
      ]}>
      <Text
        className="mb-2 font-label text-[10px] font-bold uppercase tracking-widest"
        style={{ color: hexToRgba(theme.onSurfaceVariant, 0.8) }}>
        {label}
      </Text>
      <View className="flex-row items-baseline gap-2">
        <Text
          className="font-headline text-3xl font-black"
          style={{ color: theme.onSurface, fontFamily: theme.serifFont }}>
          {value}
        </Text>
        <Text
          className="font-label text-[10px]"
          style={{ color: accentColor }}>
          {delta}
        </Text>
      </View>
    </Pressable>
  );
}

interface NextUpCardProps {
  nextUp: ScheduleNextUp;
}

function NextUpCard({ nextUp }: NextUpCardProps) {
  const theme = useBarberAdminTheme();
  const isDark = theme.theme === 'dark';

  return (
    <View
      className="overflow-hidden rounded-sm border p-6"
      style={{
        backgroundColor: hexToRgba(theme.surfaceContainerHighest, 0.3),
        borderColor: theme.borderSubtle,
      }}>
      <Text
        className="mb-2 font-headline font-bold"
        style={{ color: theme.onSurface, fontFamily: theme.serifFont }}>
        {SCHEDULE_COPY.nextUpTitle}
      </Text>

      <View className="mb-4 flex-row items-center gap-4">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.2) }}>
          <MaterialIcons name="alarm" size={20} color={theme.primary} />
        </View>
        <View>
          <Text
            className="font-body text-sm font-bold"
            style={{ color: theme.onSurface }}>
            {nextUp.time} {nextUp.label}
          </Text>
          <Text
            className="font-label text-[10px] uppercase tracking-widest"
            style={{ color: theme.onSurfaceVariant }}>
            {nextUp.minutesUntil} {SCHEDULE_COPY.minutesUntilSuffix}
          </Text>
        </View>
      </View>

      <Pressable
        className="w-full items-center py-2.5"
        style={({ hovered }) => [
          {
            backgroundColor: hovered ? theme.primary : theme.onSurface,
          },
          Platform.OS === 'web'
            ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
            : null,
        ]}>
        <Text
          className="font-label text-xs font-black uppercase tracking-widest"
          style={{ color: theme.surface }}>
          {SCHEDULE_COPY.prepareLabel}
        </Text>
      </Pressable>
    </View>
  );
}

interface ScheduleSidebarProps {
  overview: ScheduleOverview;
  nextUp: ScheduleNextUp | null;
}

export default function ScheduleSidebar({
  overview,
  nextUp,
}: ScheduleSidebarProps) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="w-80 border-l p-8"
      style={{
        backgroundColor: theme.surface,
        borderLeftColor: theme.borderSubtle,
      }}>
      <View className="flex-1 gap-8">
        <View>
          <Text
            className="mb-6 font-label text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.6) }}>
            {SCHEDULE_COPY.overviewTitle}
          </Text>

          <View className="gap-4">
            <StatCard
              label={SCHEDULE_COPY.totalLabel}
              value={overview.totalAppointments}
              delta={overview.totalDelta}
              accentColor={theme.primary}
            />
            <StatCard
              label={SCHEDULE_COPY.completedLabel}
              value={overview.completed}
              delta={overview.completedEfficiency}
              accentColor={theme.success}
            />
            <StatCard
              label={SCHEDULE_COPY.cancelledLabel}
              value={overview.cancelled}
              delta={overview.cancelledNote}
              accentColor={hexToRgba(theme.error, 0.6)}
            />
          </View>
        </View>

        {nextUp ? (
          <View className="mt-auto">
            <NextUpCard nextUp={nextUp} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
