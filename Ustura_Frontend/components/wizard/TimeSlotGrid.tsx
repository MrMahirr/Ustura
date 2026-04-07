import React from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import type { BookingTimeSlot } from '@/components/wizard/time-selection-presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface TimeSlotGridProps {
  slots: BookingTimeSlot[];
  selectedTimeId: string | null;
  onSelectTime: (timeId: string) => void;
}

function getSlotWidth(width: number) {
  return width >= 768 ? '23.5%' : '48%';
}

export default function TimeSlotGrid({
  slots,
  selectedTimeId,
  onSelectTime,
}: TimeSlotGridProps) {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const slotWidth = React.useMemo(() => getSlotWidth(width), [width]);

  return (
    <View className="flex-row flex-wrap" style={{ gap: 12 }}>
      {slots.map((slot) => {
        const isLocked = slot.status === 'locked';
        const isSelected = !isLocked && selectedTimeId === slot.id;

        return (
          <Pressable
            key={slot.id}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLocked, selected: isSelected }}
            disabled={isLocked}
            onPress={() => onSelectTime(slot.id)}
            style={({ hovered, pressed }) => [
              {
                width: slotWidth,
                minHeight: 60,
                borderRadius: 12,
                borderWidth: 1,
                paddingHorizontal: 14,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isLocked
                  ? theme === 'light'
                    ? surfaceContainerLow
                    : surfaceContainerLowest
                  : isSelected
                    ? primary
                    : theme === 'light'
                      ? surfaceContainerLowest
                      : surfaceContainerLow,
                borderColor: isLocked
                  ? hexToRgba(outlineVariant, theme === 'light' ? 0.24 : 0.1)
                  : isSelected
                    ? primary
                    : hovered
                      ? hexToRgba(primary, theme === 'light' ? 0.44 : 0.38)
                      : hexToRgba(outlineVariant, theme === 'light' ? 0.34 : 0.16),
                opacity: isLocked ? 0.72 : 1,
                transform: [{ scale: pressed ? 0.98 : isSelected ? 1.03 : 1 }],
              },
              isSelected
                ? Platform.OS === 'web'
                  ? ({
                      boxShadow:
                        theme === 'light'
                          ? `0 16px 30px ${hexToRgba(primary, 0.24)}`
                          : `0 16px 34px ${hexToRgba(primary, 0.2)}`,
                    } as any)
                  : {
                      shadowColor: primary,
                      shadowOpacity: theme === 'light' ? 0.22 : 0.18,
                      shadowRadius: 18,
                      shadowOffset: { width: 0, height: 8 },
                      elevation: 8,
                    }
                : !isLocked && hovered
                  ? Platform.OS === 'web'
                    ? ({ boxShadow: '0 12px 26px rgba(27, 27, 32, 0.08)' } as any)
                    : {
                        shadowColor: '#1B1B20',
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 6 },
                        elevation: 4,
                      }
                  : null,
            ]}>
            {isLocked ? (
              <View className="flex-row items-center justify-center" style={{ gap: 6 }}>
                <MaterialIcons name="lock" size={14} color={hexToRgba(onSurfaceVariant, 0.7)} />
                <Text className="font-body text-sm font-semibold" style={{ color: hexToRgba(onSurfaceVariant, 0.76) }}>
                  {slot.label}
                </Text>
              </View>
            ) : (
              <Text className="font-body text-sm font-semibold" style={{ color: isSelected ? onPrimary : onSurface }}>
                {slot.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
