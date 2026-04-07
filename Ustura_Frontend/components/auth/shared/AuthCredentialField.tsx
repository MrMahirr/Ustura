import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface AuthCredentialFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
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

export default function AuthCredentialField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry,
  canToggleSecureEntry = false,
  keyboardType,
  textContentType,
  autoComplete = 'off',
  autoCapitalize = 'none',
  actionLabel,
  onActionPress,
}: AuthCredentialFieldProps) {
  const theme = useAuthAccessTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const resolvedSecureTextEntry = canToggleSecureEntry ? !isTextVisible : secureTextEntry;
  const visibilityIcon = isTextVisible ? 'visibility-off' : 'visibility';
  const accentColor = isFocused ? theme.primary : theme.onSurfaceVariant;

  return (
    <View style={{ gap: 6 }}>
      <View className="flex-row items-center justify-between px-1" style={{ gap: 12 }}>
        <Text
          className="font-label text-[11px] font-bold uppercase tracking-[2.2px]"
          style={{ color: hexToRgba(theme.onSurfaceVariant, 0.9) }}>
          {label}
        </Text>

        {actionLabel && onActionPress ? (
          <Pressable accessibilityRole="button" onPress={onActionPress}>
            {({ hovered, pressed }) => (
              <Text
                className="font-label text-[10px] font-bold uppercase tracking-[1.8px]"
                style={{
                  color: hovered || pressed ? theme.primary : theme.primaryContainer,
                }}>
                {actionLabel}
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>

      <View
        className="relative overflow-hidden rounded-sm border-b-2"
        style={{
          backgroundColor: theme.surfaceContainerLowest,
          borderBottomColor: error ? theme.error : isFocused ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.32),
        }}>
        <View
          className="absolute left-0 top-0 bottom-0 z-10 items-center justify-center pl-3"
          pointerEvents="none">
          <MaterialIcons name={icon} size={20} color={accentColor} />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.38)}
          secureTextEntry={resolvedSecureTextEntry}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          selectionColor={theme.primary}
          className="pl-11 pr-11 font-body text-sm"
          style={[
            {
              color: theme.onSurface,
              paddingVertical: 16,
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
            className="absolute right-0 top-0 bottom-0 items-center justify-center pr-3">
            {({ hovered, pressed }) => (
              <MaterialIcons
                name={visibilityIcon}
                size={20}
                color={hovered || pressed ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.68)}
              />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="px-1 font-body text-[11px]" style={{ color: theme.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
