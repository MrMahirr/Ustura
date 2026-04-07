import React from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import BookingSurfacePanel from '@/components/wizard/BookingSurfacePanel';
import type { BookingDateOption } from '@/components/wizard/time-selection-presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingDateSelectorProps {
  title: string;
  dateOptions: BookingDateOption[];
  selectedDateId: string | null;
  onSelectDate: (dateId: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  previousDisabled?: boolean;
}

function getDateTileWidth(width: number) {
  if (width >= 900) {
    return '13.25%';
  }

  if (width >= 640) {
    return '23.5%';
  }

  return '31.5%';
}

export default function BookingDateSelector({
  title,
  dateOptions,
  selectedDateId,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
  previousDisabled = false,
}: BookingDateSelectorProps) {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const tileWidth = React.useMemo(() => getDateTileWidth(width), [width]);
  const currentRangeLabel = React.useMemo(() => {
    if (dateOptions.length === 0) {
      return '';
    }

    return `${dateOptions[0]?.fullDateLabel} - ${dateOptions[dateOptions.length - 1]?.fullDateLabel}`;
  }, [dateOptions]);

  return (
    <BookingSurfacePanel>
      <View style={{ gap: 20 }}>
        <View className="flex-row items-center justify-between" style={{ gap: 16 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text className="font-headline text-2xl font-bold" style={{ color: onSurface }}>
              {title}
            </Text>
            <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.84) }}>
              {currentRangeLabel}
            </Text>
          </View>

          <View className="flex-row" style={{ gap: 8 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Onceki hafta"
              accessibilityState={{ disabled: previousDisabled }}
              disabled={previousDisabled}
              onPress={onPreviousWeek}
              style={({ hovered, pressed }) => [
                {
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
                  borderColor: hexToRgba(
                    outlineVariant,
                    previousDisabled ? 0.16 : hovered ? (theme === 'light' ? 0.44 : 0.26) : theme === 'light' ? 0.36 : 0.18
                  ),
                  opacity: previousDisabled ? 0.42 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
                hovered
                  ? Platform.OS === 'web'
                    ? ({ boxShadow: '0 10px 22px rgba(27, 27, 32, 0.08)' } as any)
                    : {
                        shadowColor: '#1B1B20',
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 6 },
                        elevation: 4,
                      }
                  : null,
              ]}>
              <MaterialIcons
                name="chevron-left"
                size={18}
                color={previousDisabled ? hexToRgba(onSurfaceVariant, 0.44) : onSurface}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sonraki hafta"
              onPress={onNextWeek}
              style={({ hovered, pressed }) => [
                {
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
                  borderColor: hexToRgba(
                    outlineVariant,
                    hovered ? (theme === 'light' ? 0.44 : 0.26) : theme === 'light' ? 0.36 : 0.18
                  ),
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
                hovered
                  ? Platform.OS === 'web'
                    ? ({ boxShadow: '0 10px 22px rgba(27, 27, 32, 0.08)' } as any)
                    : {
                        shadowColor: '#1B1B20',
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 6 },
                        elevation: 4,
                      }
                  : null,
              ]}>
              <MaterialIcons name="chevron-right" size={18} color={onSurface} />
            </Pressable>
          </View>
        </View>

        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {dateOptions.map((option) => {
            const isSelected = selectedDateId === option.id;

            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelectDate(option.id)}
                style={({ hovered, pressed }) => [
                  {
                    width: tileWidth,
                    minHeight: 76,
                    borderRadius: 12,
                    borderWidth: 1,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? primary : theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
                    borderColor: isSelected
                      ? primary
                      : hovered
                        ? hexToRgba(primary, theme === 'light' ? 0.34 : 0.3)
                        : hexToRgba(outlineVariant, theme === 'light' ? 0.34 : 0.16),
                    transform: [{ scale: pressed ? 0.97 : isSelected ? 1.02 : 1 }],
                  },
                  isSelected
                    ? Platform.OS === 'web'
                      ? ({
                          boxShadow:
                            theme === 'light'
                              ? `0 14px 26px ${hexToRgba(primary, 0.22)}`
                              : `0 14px 30px ${hexToRgba(primary, 0.2)}`,
                        } as any)
                      : {
                          shadowColor: primary,
                          shadowOpacity: theme === 'light' ? 0.2 : 0.18,
                          shadowRadius: 16,
                          shadowOffset: { width: 0, height: 8 },
                          elevation: 8,
                        }
                    : null,
                ]}>
                <Text
                  className="font-label text-[10px] font-bold uppercase tracking-[2.4px]"
                  style={{ color: isSelected ? onPrimary : hexToRgba(onSurfaceVariant, 0.82) }}>
                  {option.shortDayLabel}
                </Text>
                <Text
                  className="font-headline text-xl font-black"
                  style={{ marginTop: 6, color: isSelected ? onPrimary : onSurface }}>
                  {option.dayNumberLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </BookingSurfacePanel>
  );
}
