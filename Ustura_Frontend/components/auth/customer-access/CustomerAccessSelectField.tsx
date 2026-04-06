import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessSelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onPress: () => void;
}

export default function CustomerAccessSelectField({
  label,
  value,
  placeholder,
  error,
  onPress,
}: CustomerAccessSelectFieldProps) {
  const theme = useAuthAccessTheme();

  return (
    <View style={{ gap: 8 }}>
      <Text
        className="font-label text-[11px] uppercase tracking-[2.6px]"
        style={{ color: hexToRgba(theme.onSurfaceVariant, 0.78) }}>
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="border-b px-4"
        style={({ hovered, pressed }) => ({
          backgroundColor: theme.surfaceContainerLow,
          borderBottomColor: error
            ? theme.error
            : hovered || pressed
              ? theme.primary
              : hexToRgba(theme.onSurfaceVariant, 0.26),
        })}>
        {({ hovered, pressed }) => (
          <View className="flex-row items-center justify-between py-[14px]">
            <Text
              className="font-body text-sm"
              style={{
                color: value
                  ? theme.onSurface
                  : hexToRgba(theme.onSurfaceVariant, 0.42),
              }}>
              {value || placeholder}
            </Text>

            <MaterialIcons
              name="expand-more"
              size={18}
              color={
                hovered || pressed
                  ? theme.primary
                  : hexToRgba(theme.onSurfaceVariant, 0.68)
              }
            />
          </View>
        )}
      </Pressable>

      {error ? (
        <Text className="font-body text-[11px]" style={{ color: theme.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
