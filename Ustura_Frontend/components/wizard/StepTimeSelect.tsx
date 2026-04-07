import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { BOOKING_COPY } from '@/components/wizard/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface StepTimeSelectProps {
  salonName: string;
  staffName: string;
}

export default function StepTimeSelect({ salonName, staffName }: StepTimeSelectProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="rounded-2xl border p-8"
      style={{
        gap: 18,
        backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
        borderColor: hexToRgba(outlineVariant, theme === 'light' ? 0.42 : 0.24),
      }}>
      <View
        className="items-center justify-center self-start rounded-full"
        style={{ width: 52, height: 52, backgroundColor: hexToRgba(primary, 0.12) }}>
        <MaterialIcons name="schedule" size={24} color={primary} />
      </View>

      <View style={{ gap: 8 }}>
        <Text className="font-headline text-4xl font-bold" style={{ color: onSurface }}>
          {BOOKING_COPY.timeStepTitle}
        </Text>
        <Text className="font-body text-base" style={{ maxWidth: 640, color: onSurfaceVariant }}>
          {BOOKING_COPY.timeStepDescription}
        </Text>
      </View>

      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        <View className="rounded-full px-4 py-2" style={{ backgroundColor: hexToRgba(primary, 0.12) }}>
          <Text className="font-label text-xs font-bold uppercase tracking-[2px]" style={{ color: primary }}>
            {salonName}
          </Text>
        </View>
        <View className="rounded-full px-4 py-2" style={{ backgroundColor: hexToRgba(outlineVariant, 0.12) }}>
          <Text className="font-label text-xs font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
            {staffName}
          </Text>
        </View>
      </View>
    </View>
  );
}
