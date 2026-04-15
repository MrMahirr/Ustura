import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { SCHEDULE_COPY } from './presentation';
import type { ScheduleStaffMember } from './types';

interface StaffFilterBarProps {
  staff: ScheduleStaffMember[];
  selectedStaffId: string | null;
  onSelectStaff: (staffId: string | null) => void;
}

function StaffChip({
  label,
  photoUrl,
  isActive,
  onPress,
  appointmentCount,
}: {
  label: string;
  photoUrl?: string | null;
  isActive: boolean;
  onPress: () => void;
  appointmentCount?: number;
}) {
  const theme = useBarberAdminTheme();
  const isDark = theme.theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2.5 rounded-sm px-4 py-2.5"
      style={({ hovered }) => [
        {
          backgroundColor: isActive
            ? (isDark ? hexToRgba(theme.primary, 0.15) : hexToRgba(theme.primary, 0.1))
            : hovered
              ? theme.surfaceContainerHigh
              : theme.surfaceContainerLow,
          borderWidth: 1,
          borderColor: isActive
            ? hexToRgba(theme.primary, 0.3)
            : 'transparent',
        },
        Platform.OS === 'web'
          ? ({ cursor: 'pointer', transition: 'all 180ms ease' } as any)
          : null,
      ]}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: isActive
              ? hexToRgba(theme.primary, 0.4)
              : hexToRgba(theme.onSurfaceVariant, 0.1),
          }}
          contentFit="cover"
        />
      ) : (
        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{
            backgroundColor: isActive
              ? hexToRgba(theme.primary, 0.2)
              : theme.surfaceContainerHighest,
          }}>
          <MaterialIcons
            name="person"
            size={16}
            color={isActive ? theme.primary : theme.onSurfaceVariant}
          />
        </View>
      )}

      <View>
        <Text
          className="font-body text-xs font-bold"
          style={{ color: isActive ? theme.primary : theme.onSurface }}>
          {label}
        </Text>
        {typeof appointmentCount === 'number' ? (
          <Text
            className="font-label text-[9px] uppercase tracking-wider"
            style={{ color: isActive ? hexToRgba(theme.primary, 0.7) : theme.onSurfaceVariant }}>
            {appointmentCount} randevu
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function StaffFilterBar({
  staff,
  selectedStaffId,
  onSelectStaff,
}: StaffFilterBarProps) {
  const theme = useBarberAdminTheme();

  if (staff.length === 0) return null;

  return (
    <View
      className="border-b px-10 py-3"
      style={{
        borderBottomColor: theme.borderSubtle,
        backgroundColor: theme.surface,
      }}>
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialIcons
          name="groups"
          size={16}
          color={theme.onSurfaceVariant}
        />
        <Text
          className="font-label text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: hexToRgba(theme.onSurfaceVariant, 0.6) }}>
          {SCHEDULE_COPY.staffFilterTitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}>
        <StaffChip
          label={SCHEDULE_COPY.allStaffLabel}
          isActive={selectedStaffId === null}
          onPress={() => onSelectStaff(null)}
        />

        {staff.map((member) => (
          <StaffChip
            key={member.id}
            label={member.displayName}
            photoUrl={member.photoUrl}
            isActive={selectedStaffId === member.id}
            onPress={() =>
              onSelectStaff(selectedStaffId === member.id ? null : member.id)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
