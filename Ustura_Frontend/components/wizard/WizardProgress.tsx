import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import type { BookingProgressStep } from '@/components/wizard/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface WizardProgressProps {
  steps: BookingProgressStep[];
  currentStep: number;
}

export default function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View style={{ gap: 10 }}>
      <View className="relative flex-row items-center justify-between">
        <View
          className="absolute left-0 right-0 top-1/2 h-px"
          style={{ backgroundColor: hexToRgba(outlineVariant, 0.3), transform: [{ translateY: -14 }] }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <View key={step.id} className="items-center" style={{ gap: 8 }}>
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor:
                    isCompleted
                      ? primary
                      : isCurrent
                        ? surface
                        : theme === 'light'
                          ? hexToRgba(surfaceContainerLow, 0.7)
                          : surfaceContainerLow,
                  borderWidth: isCurrent || !isCompleted ? 2 : 0,
                  borderColor: isCurrent ? primary : hexToRgba(outlineVariant, theme === 'light' ? 0.58 : 0.3),
                }}>
                {isCompleted ? (
                  <MaterialIcons name="check" size={16} color={onPrimary} />
                ) : (
                  <Text
                    className="font-headline text-sm font-black"
                    style={{ color: isCurrent ? primary : hexToRgba(onSurfaceVariant, 0.7) }}>
                    {step.number}
                  </Text>
                )}
              </View>

              <Text
                className="font-label text-[10px] font-bold uppercase tracking-[2.6px]"
                style={{ color: isCurrent ? primary : hexToRgba(onSurfaceVariant, 0.84) }}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
