import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, Platform, type TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  iconLeft?: keyof typeof MaterialIcons.glyphMap;
  containerStyle?: import('react-native').ViewStyle;
  style?: import('react-native').TextStyle;
}

export default function Input({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  iconLeft,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const primary = useThemeColor({}, 'primary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;
  const floatAnim = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(floatAnim, {
      toValue: isFloating ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFloating, floatAnim]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const labelTop = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -10],
  });

  const labelScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const iconWidth = 24;
  const iconSpacing = 12;
  const paddingLeft = iconLeft ? iconWidth + iconSpacing : 0;
  const labelColor = isFocused ? primary : onSurfaceVariant;
  const borderColor = isFocused ? primary : outlineVariant;

  return (
    <View className="relative mt-2 w-full border-b-2" style={[{ borderBottomColor: borderColor }, containerStyle]}>
      {iconLeft ? (
        <MaterialIcons name={iconLeft} size={iconWidth} color={isFocused ? primary : onSurfaceVariant} style={{ position: 'absolute', left: 0, top: 10, zIndex: 2 }} />
      ) : null}

      {label ? (
        <Animated.Text
          className="absolute left-0 z-10 text-sm uppercase tracking-[1.4px]"
          style={{
            top: labelTop,
            left: paddingLeft,
            transform: [{ scale: labelScale }, { translateX: isFloating ? -8 : 0 }],
            color: labelColor,
            fontFamily: 'Manrope-Regular',
          }}>
          {label}
        </Animated.Text>
      ) : null}

      <TextInput
        className="w-full py-3 text-base"
        style={[
          {
            color: onSurface,
            paddingLeft,
            zIndex: 2,
            fontFamily: 'Manrope-Regular',
          },
          Platform.OS === 'web'
            ? ({
                outlineWidth: 0,
                outlineStyle: 'none',
                boxShadow: 'none',
              } as any)
            : null,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={isFocused ? 'transparent' : onSurfaceVariant}
        selectionColor={primary}
        {...props}
      />
    </View>
  );
}
