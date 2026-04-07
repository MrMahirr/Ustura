import React from 'react';
import { Platform, ScrollView, useWindowDimensions, View } from 'react-native';

import BookingActionBar from '@/components/wizard/BookingActionBar';
import BookingTopBar from '@/components/wizard/BookingTopBar';
import { BOOKING_COPY, BOOKING_PROGRESS_STEPS } from '@/components/wizard/presentation';
import WizardProgress from '@/components/wizard/WizardProgress';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingScaffoldProps {
  children: React.ReactNode;
  currentStep: 2 | 3;
  onBack: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
}

export default function BookingScaffold({
  children,
  currentStep,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = BOOKING_COPY.continueLabel,
}: BookingScaffoldProps) {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const isCompact = width < 768;

  return (
    <View className="flex-1" style={{ backgroundColor: surface }}>
      <View
        pointerEvents="none"
        className="absolute left-[-80px] top-[-120px] rounded-full"
        style={{
          width: 280,
          height: 280,
          backgroundColor: hexToRgba(primary, theme === 'light' ? 0.12 : 0.08),
          ...(Platform.OS === 'web' ? ({ filter: 'blur(120px)' } as any) : {}),
        }}
      />
      <View
        pointerEvents="none"
        className="absolute bottom-16 right-[-60px] rounded-full"
        style={{
          width: 240,
          height: 240,
          backgroundColor: hexToRgba(primary, theme === 'light' ? 0.08 : 0.06),
          ...(Platform.OS === 'web' ? ({ filter: 'blur(100px)' } as any) : {}),
        }}
      />

      <BookingTopBar compact={isCompact} title={BOOKING_COPY.footerBrand} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: isCompact ? 108 : 120,
          paddingBottom: 136,
          paddingHorizontal: isCompact ? 20 : 24,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="w-full self-center" style={{ maxWidth: 1200, gap: 32 }}>
          <View
            className="rounded-2xl border px-4 py-6"
            style={{
              backgroundColor:
                theme === 'light'
                  ? hexToRgba(surfaceContainerLowest, 0.94)
                  : hexToRgba(surfaceContainerLow, 0.88),
              borderColor: hexToRgba(outlineVariant, theme === 'light' ? 0.44 : 0.18),
              ...(Platform.OS === 'web'
                ? ({
                    boxShadow:
                      theme === 'light'
                        ? '0 18px 38px rgba(27, 27, 32, 0.06)'
                        : `0 18px 38px ${hexToRgba('#000000', 0.18)}`,
                  } as any)
                : {
                    shadowColor: theme === 'light' ? '#1B1B20' : '#000000',
                    shadowOpacity: theme === 'light' ? 0.06 : 0.14,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 6,
                  }),
            }}>
            <WizardProgress steps={BOOKING_PROGRESS_STEPS} currentStep={currentStep} />
          </View>

          {children}
        </View>
      </ScrollView>

      <BookingActionBar
        backLabel={BOOKING_COPY.backLabel}
        continueLabel={continueLabel}
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={continueDisabled}
      />
    </View>
  );
}
