import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface SuperAdminAccessFieldProps {
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

export default function SuperAdminAccessField({
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
}: SuperAdminAccessFieldProps) {
  const adminTheme = useSuperAdminTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isTextVisible, setIsTextVisible] = React.useState(false);

  const resolvedSecureTextEntry = canToggleSecureEntry ? !isTextVisible : secureTextEntry;
  const visibilityIcon = isTextVisible ? 'visibility-off' : 'visibility';

  const borderColor = error
    ? adminTheme.error
    : isFocused
      ? adminTheme.primary
      : hexToRgba(adminTheme.onSurfaceVariant, 0.28);

  return (
    <View style={{ gap: 6 }}>
      <View className="flex-row items-end justify-between" style={{ gap: 12 }}>
        <Text
          className="px-1 font-label text-[10px] uppercase tracking-[2.8px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
          {label}
        </Text>

        {actionLabel && onActionPress ? (
          <Pressable accessibilityRole="button" onPress={onActionPress}>
            {({ hovered, pressed }) => (
              <Text
                className="font-label text-[10px] uppercase tracking-[-0.2px]"
                style={[
                  { color: hovered || pressed ? adminTheme.primary : adminTheme.primaryContainer },
                  Platform.OS === 'web' ? ({ transition: 'color 180ms ease' } as any) : null,
                ]}>
                {actionLabel}
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>

      <View
        className="border-b"
        style={{
          borderBottomColor: borderColor,
          backgroundColor: adminTheme.surfaceContainerLowest,
        }}>
        <View className="flex-row items-center">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={hexToRgba(adminTheme.onSurfaceVariant, 0.34)}
            secureTextEntry={resolvedSecureTextEntry}
            keyboardType={keyboardType}
            textContentType={textContentType}
            autoComplete={autoComplete}
            autoCapitalize={autoCapitalize}
            selectionColor={adminTheme.primary}
            className="flex-1 px-1 py-3 font-body text-sm"
            style={[
              { color: adminTheme.onSurface },
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
              className="px-1 py-2">
              {({ hovered, pressed }) => (
                <MaterialIcons
                  name={visibilityIcon}
                  size={20}
                  color={
                    hovered || pressed
                      ? adminTheme.primary
                      : hexToRgba(adminTheme.onSurfaceVariant, 0.64)
                  }
                />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      {error ? (
        <Text className="px-1 font-body text-[11px]" style={{ color: adminTheme.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
