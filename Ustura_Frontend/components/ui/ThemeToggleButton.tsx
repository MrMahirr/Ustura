import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={theme === 'light' ? 'Karanlık temaya geç' : 'Açık temaya geç'}
      style={({ hovered, pressed }) => [
        styles.themeToggle,
        {
          backgroundColor: hovered ? surfaceContainerLow : surface,
          borderColor: hovered ? hexToRgba(primary, 0.38) : outlineVariant,
          transform: [{ scale: pressed ? 0.96 : hovered ? 1.02 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              boxShadow: hovered
                ? `0 12px 24px ${hexToRgba(primary, 0.14)}`
                : '0 6px 16px rgba(27, 27, 32, 0.08)',
            } as any)
          : {
              shadowColor: primary,
              shadowOpacity: hovered ? 0.16 : 0.08,
              shadowRadius: hovered ? 14 : 8,
              shadowOffset: { width: 0, height: hovered ? 8 : 4 },
              elevation: hovered ? 8 : 3,
            },
      ]}>
      <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={20} color={primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 200ms ease',
          cursor: 'pointer',
        } as any)
      : {}),
  } as any,
});
