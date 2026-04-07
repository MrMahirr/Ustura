import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface AuthSelectFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export default function AuthSelectField({
  label,
  value,
  placeholder,
  icon,
  onPress,
}: AuthSelectFieldProps) {
  const theme = useAuthAccessTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text
        className="ml-1 font-label text-[11px] font-bold uppercase tracking-[2.2px]"
        style={{ color: hexToRgba(theme.onSurfaceVariant, 0.9) }}>
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="overflow-hidden rounded-sm border-b-2"
        style={({ hovered, pressed }) => ({
          backgroundColor: theme.surfaceContainerLowest,
          borderBottomColor: hovered || pressed ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.32),
        })}>
        {({ hovered, pressed }) => (
          <View className="flex-row items-center px-3 py-4">
            <MaterialIcons
              name={icon}
              size={20}
              color={hovered || pressed ? theme.primary : theme.onSurfaceVariant}
            />

            <Text
              className="ml-3 flex-1 font-body text-sm"
              style={{
                color: value ? theme.onSurface : hexToRgba(theme.onSurfaceVariant, 0.52),
              }}>
              {value || placeholder || ''}
            </Text>

            <MaterialIcons name="expand-more" size={20} color={theme.onSurfaceVariant} />
          </View>
        )}
      </Pressable>
    </View>
  );
}
