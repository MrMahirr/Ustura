import { FontAwesome5 } from '@expo/vector-icons';
import { Platform, Pressable, Text } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessGoogleButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function CustomerAccessGoogleButton({
  label,
  onPress,
  disabled = false,
}: CustomerAccessGoogleButtonProps) {
  const theme = useAuthAccessTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className="min-h-[52px] flex-row items-center justify-center rounded-sm border px-4 py-3"
      style={({ hovered, pressed }) => [
        {
          backgroundColor:
            disabled
              ? theme.surfaceContainerLow
              : pressed || hovered
                ? theme.surfaceContainerHighest
                : theme.surfaceContainerLow,
          borderColor: hexToRgba(theme.onSurfaceVariant, disabled ? 0.08 : hovered ? 0.22 : 0.12),
          opacity: disabled ? 0.62 : 1,
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 220ms ease, border-color 220ms ease, transform 180ms ease, box-shadow 220ms ease',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: hovered
                ? `0 16px 34px ${hexToRgba(theme.primary, 0.1)}`
                : '0 10px 24px rgba(0, 0, 0, 0.08)',
              transform: `scale(${disabled ? 1 : pressed ? 0.99 : hovered ? 1.01 : 1})`,
            } as any)
          : {
              transform: [{ scale: disabled ? 1 : pressed ? 0.99 : 1 }],
            },
      ]}>
      {({ hovered }) => (
        <>
          <FontAwesome5
            name="google"
            size={16}
            color={
              disabled
                ? hexToRgba(theme.onSurfaceVariant, 0.44)
                : hovered
                  ? theme.primary
                  : hexToRgba(theme.onSurfaceVariant, 0.82)
            }
            style={{ marginRight: 12 }}
          />
          <Text
            className="font-body text-sm font-medium"
            style={{
              color: disabled
                ? hexToRgba(theme.secondary, 0.5)
                : hexToRgba(theme.secondary, 0.86),
            }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
