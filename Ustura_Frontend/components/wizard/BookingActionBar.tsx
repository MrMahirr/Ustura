import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingActionBarProps {
  backLabel: string;
  continueLabel: string;
  onBack: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueIcon?: keyof typeof MaterialIcons.glyphMap;
  helperLabel?: string;
  helperIcon?: keyof typeof MaterialIcons.glyphMap;
}

export default function BookingActionBar({
  backLabel,
  continueLabel,
  onBack,
  onContinue,
  continueDisabled = false,
  continueIcon,
  helperLabel,
  helperIcon,
}: BookingActionBarProps) {
  const { theme } = useAppTheme();
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="absolute bottom-0 left-0 right-0 z-40 border-t"
      style={[
        {
          paddingHorizontal: 24,
          paddingVertical: 18,
          backgroundColor:
            theme === 'light'
              ? Platform.OS === 'web'
                ? 'rgba(253, 251, 255, 0.94)'
                : surface
              : Platform.OS === 'web'
                ? hexToRgba(surface, 0.9)
                : surface,
          borderTopColor: hexToRgba(outlineVariant, theme === 'light' ? 0.48 : 0.18),
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(18px)',
              boxShadow:
                theme === 'light'
                  ? '0 -8px 28px rgba(27, 27, 32, 0.08)'
                  : '0 -8px 28px rgba(0, 0, 0, 0.18)',
            } as any)
          : {
              shadowColor: theme === 'light' ? '#1B1B20' : '#000000',
              shadowOpacity: theme === 'light' ? 0.08 : 0.16,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: -6 },
              elevation: 10,
            },
      ]}>
      <View
        className="w-full self-center"
        style={{ maxWidth: 1200, gap: helperLabel ? 18 : 0 }}>
        {helperLabel ? (
          <View className="items-center">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              {helperIcon ? <MaterialIcons name={helperIcon} size={18} color={primary} /> : null}
              <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                {helperLabel}
              </Text>
            </View>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between" style={{ gap: 16 }}>
          <Pressable accessibilityRole="button" className="flex-row items-center" style={{ gap: 8 }} onPress={onBack}>
            {({ hovered, pressed }) => (
              <>
                <MaterialIcons
                  name="arrow-back"
                  size={18}
                  color={hovered || pressed ? primary : onSurfaceVariant}
                />
                <Text
                  className="font-label text-xs font-bold uppercase tracking-[2.4px]"
                  style={{ color: hovered || pressed ? primary : onSurfaceVariant }}>
                  {backLabel}
                </Text>
              </>
            )}
          </Pressable>

          <Button
            title={continueLabel}
            icon={continueIcon}
            interactionPreset="cta"
            onPress={onContinue}
            disabled={continueDisabled}
            style={{ minWidth: 220 }}
          />
        </View>
      </View>
    </View>
  );
}
