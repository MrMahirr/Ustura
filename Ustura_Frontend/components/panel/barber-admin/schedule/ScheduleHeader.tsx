import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { SCHEDULE_COPY } from './presentation';
import type { ScheduleViewMode } from './types';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDw051u9VURfqNHhK5Y7XaUykTw41OFsn-zceJ5wv-KFucbPCGmc_YqARjt_gPM8k-JUxe0A9c8Jyl6jMJgc6h7o9Pe11oL9UE_4A38Ll_5jRLySvSebuy-6Xk7EHxqKmNGePZsssOJzP6S2Z2lPnXUI2ay3kon7xQqYi0WZDW1o4PSGRjPQbvPUouPNoWPWEutb15MLJN8LJyH2bpKLRCHZsSAUXxBLIVXq4WpK4BBodoxx4GWC8fRvCyPPgcQP40zxdeneYXmX1c';

interface ScheduleHeaderProps {
  dateRangeLabel: string;
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  onGoBack: () => void;
  onGoForward: () => void;
}

function NavButton({
  icon,
  onPress,
}: {
  icon: 'chevron-left' | 'chevron-right';
  onPress: () => void;
}) {
  const theme = useBarberAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-sm"
      style={({ hovered }) => [
        {
          backgroundColor: hovered
            ? theme.surfaceContainerHighest
            : theme.surfaceContainerHigh,
        },
        Platform.OS === 'web'
          ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
          : null,
      ]}>
      <MaterialIcons name={icon} size={22} color={theme.onSurfaceVariant} />
    </Pressable>
  );
}

function ViewToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
}) {
  const theme = useBarberAdminTheme();

  const modes: { key: ScheduleViewMode; label: string }[] = [
    { key: 'day', label: SCHEDULE_COPY.dayLabel },
    { key: 'week', label: SCHEDULE_COPY.weekLabel },
  ];

  return (
    <View
      className="flex-row overflow-hidden rounded-sm p-1"
      style={{ backgroundColor: theme.surfaceContainerLow }}>
      {modes.map((m) => {
        const isActive = viewMode === m.key;
        return (
          <Pressable
            key={m.key}
            onPress={() => onViewModeChange(m.key)}
            className="items-center justify-center px-4 py-1.5"
            style={[
              {
                backgroundColor: isActive
                  ? theme.surfaceContainerHighest
                  : 'transparent',
              },
              Platform.OS === 'web'
                ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
                : null,
            ]}>
            <Text
              className="font-label text-xs font-bold uppercase tracking-widest"
              style={{
                color: isActive ? theme.primary : theme.onSurfaceVariant,
              }}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ScheduleHeader({
  dateRangeLabel,
  viewMode,
  onViewModeChange,
  onGoBack,
  onGoForward,
}: ScheduleHeaderProps) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="z-40 min-h-[80px] flex-row flex-wrap items-center justify-between gap-4 border-b px-10 py-3"
      style={[
        {
          backgroundColor:
            Platform.OS === 'web'
              ? hexToRgba(theme.surface, 0.8)
              : theme.surface,
          borderBottomColor: theme.borderSubtle,
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            } as any)
          : null,
      ]}>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-4">
          <NavButton icon="chevron-left" onPress={onGoBack} />
          <Text
            className="font-headline text-xl font-bold tracking-tight"
            style={{ color: theme.onSurface, fontFamily: theme.serifFont }}>
            {dateRangeLabel}
          </Text>
          <NavButton icon="chevron-right" onPress={onGoForward} />
        </View>

        <View
          className="mx-2 h-6 w-px"
          style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.12) }}
        />

        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="items-end">
          <Text
            className="font-body text-sm font-bold"
            style={{ color: theme.onSurface }}>
            Kemal Yilmaz
          </Text>
          <Text
            className="mt-0.5 font-label text-[10px] uppercase tracking-tight"
            style={{ color: theme.primary }}>
            Salon Sahibi
          </Text>
        </View>
        <Image
          source={{ uri: AVATAR_URI }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: hexToRgba(theme.primary, 0.2),
          }}
          contentFit="cover"
        />
      </View>
    </View>
  );
}
