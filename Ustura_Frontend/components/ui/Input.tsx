import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  iconLeft?: keyof typeof MaterialIcons.glyphMap;
  containerStyle?: import('react-native').ViewStyle;
  style?: import('react-native').TextStyle;
}

export default function Input({ label, value, onChangeText, onFocus, onBlur, iconLeft, containerStyle, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const primary = useThemeColor({}, 'primary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  // Animation values
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
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
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
    <View style={[styles.container, { borderBottomColor: borderColor }, containerStyle]}>
      {iconLeft && (
        <MaterialIcons 
          name={iconLeft} 
          size={iconWidth} 
          color={isFocused ? primary : onSurfaceVariant} 
          style={styles.icon} 
        />
      )}
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              left: paddingLeft,
              transform: [{ scale: labelScale }, { translateX: isFloating ? -8 : 0 }],
              color: labelColor,
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      <TextInput
        style={[styles.input, { color: onSurface, paddingLeft }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={isFocused ? "transparent" : onSurfaceVariant}
        selectionColor={primary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    borderBottomWidth: 2,
    marginTop: 8,
  },
  label: {
    position: 'absolute',
    left: 0,
    ...Typography.labelLg,
    fontFamily: 'Manrope-Regular',
    zIndex: 1, // keep label behind input or disable pointer events
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    ...Typography.bodyLg,
    zIndex: 2,
  },
  icon: {
    position: 'absolute',
    left: 0,
    top: 10,
    zIndex: 2,
  },
});
