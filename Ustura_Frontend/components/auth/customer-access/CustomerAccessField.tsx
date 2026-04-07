import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  canToggleSecureEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  textContentType?: TextInputProps['textContentType'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function CustomerAccessField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  canToggleSecureEntry = false,
  keyboardType,
  textContentType,
  autoComplete = 'off',
  autoCapitalize = 'none',
  actionLabel,
  onActionPress,
}: CustomerAccessFieldProps) {
  const theme = useAuthAccessTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const resolvedSecureTextEntry = canToggleSecureEntry ? !isTextVisible : secureTextEntry;

  return (
    <View style={{ gap: 8 }}>
      <View className="flex-row items-end justify-between" style={{ gap: 12 }}>
        <Text
          className="font-label text-[11px] uppercase tracking-[2.6px]"
          style={{
            color: isFocused ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.78),
          }}>
          {label}
        </Text>

        {actionLabel && onActionPress ? (
          <Pressable accessibilityRole="button" onPress={onActionPress}>
            {({ hovered, pressed }) => (
              <Text
                className="font-label text-[10px] uppercase tracking-[1.8px]"
                style={{
                  color: hovered || pressed ? theme.primary : hexToRgba(theme.primary, 0.72),
                }}>
                {actionLabel}
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>

      <View
        className="border-b px-4"
        style={{
          backgroundColor: theme.surfaceContainerLow,
          borderBottomColor: error
            ? theme.error
            : isFocused
              ? theme.primary
              : hexToRgba(theme.onSurfaceVariant, 0.26),
        }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.3)}
          secureTextEntry={resolvedSecureTextEntry}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          selectionColor={theme.primary}
          className="font-body text-sm"
          style={[
            {
              color: theme.onSurface,
              paddingVertical: 14,
              paddingRight: canToggleSecureEntry ? 42 : 0,
            },
            Platform.OS === 'web'
              ? ({
                  outlineWidth: 0,
                  outlineStyle: 'none',
                  boxShadow: 'none',
                } as any)
              : null,
          ]}
        />

        {canToggleSecureEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isTextVisible ? 'Sifreyi gizle' : 'Sifreyi goster'}
            onPress={() => setIsTextVisible((previous) => !previous)}
            className="absolute right-4 top-0 bottom-0 items-center justify-center">
            {({ hovered, pressed }) => (
              <MaterialIcons
                name={isTextVisible ? 'visibility-off' : 'visibility'}
                size={18}
                color={hovered || pressed ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.68)}
              />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="font-body text-[11px]" style={{ color: theme.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
