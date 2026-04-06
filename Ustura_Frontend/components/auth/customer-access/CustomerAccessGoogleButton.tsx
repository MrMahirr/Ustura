import { FontAwesome5 } from '@expo/vector-icons';
import { Platform, Pressable, Text } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessGoogleButtonProps {
  label: string;
  onPress: () => void;
}

export default function CustomerAccessGoogleButton({
  label,
  onPress,
}: CustomerAccessGoogleButtonProps) {
  const theme = useAuthAccessTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-[52px] flex-row items-center justify-center rounded-sm border px-4 py-3"
      style={({ hovered, pressed }) => [
        {
          backgroundColor:
            pressed || hovered ? theme.surfaceContainerHighest : theme.surfaceContainerLow,
          borderColor: hexToRgba(theme.onSurfaceVariant, hovered ? 0.22 : 0.12),
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 220ms ease, border-color 220ms ease, transform 180ms ease, box-shadow 220ms ease',
              cursor: 'pointer',
              boxShadow: hovered
                ? `0 16px 34px ${hexToRgba(theme.primary, 0.1)}`
                : '0 10px 24px rgba(0, 0, 0, 0.08)',
              transform: `scale(${pressed ? 0.99 : hovered ? 1.01 : 1})`,
            } as any)
          : {
              transform: [{ scale: pressed ? 0.99 : 1 }],
            },
      ]}>
      {({ hovered }) => (
        <>
          <FontAwesome5
            name="google"
            size={16}
            color={hovered ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.82)}
            style={{ marginRight: 12 }}
          />
          <Text className="font-body text-sm font-medium" style={{ color: hexToRgba(theme.secondary, 0.86) }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
