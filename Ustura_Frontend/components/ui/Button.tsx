import React from 'react';
import { Text, Pressable, StyleSheet, Animated, View, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return hex;
  }

  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  interactionPreset?: 'default' | 'subtle' | 'cta' | 'outlineCta';
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  interactionPreset = 'default',
  icon,
  style,
  textStyle,
  disabled
}: ButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');

  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const translateYAnim = React.useRef(new Animated.Value(0)).current;
  const isHovered = React.useRef(false);
  const isSubtle = interactionPreset === 'subtle';
  const isInteractiveCta = interactionPreset === 'cta' || interactionPreset === 'outlineCta';

  const getRestState = () => ({
    scale: isHovered.current ? (isInteractiveCta ? 1.02 : isSubtle ? 1.008 : 1.03) : 1,
    translateY: isHovered.current && isInteractiveCta ? -2 : 0,
  });

  const animateTransform = (scale: number, translateY: number, speed: number, bounciness: number) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: scale,
        useNativeDriver: true,
        speed,
        bounciness,
      }),
      Animated.spring(translateYAnim, {
        toValue: translateY,
        useNativeDriver: true,
        speed,
        bounciness,
      }),
    ]).start();
  };

  const handleHoverIn = () => {
    isHovered.current = true;
    animateTransform(isInteractiveCta ? 1.02 : isSubtle ? 1.008 : 1.03, isInteractiveCta ? -2 : 0, 12, 6);
  };

  const handleHoverOut = () => {
    isHovered.current = false;
    animateTransform(1, 0, 12, 6);
  };

  const handlePressIn = () => {
    animateTransform(isInteractiveCta ? 0.99 : isSubtle ? 0.995 : 0.96, 0, 20, 4);
  };

  const handlePressOut = () => {
    const nextState = getRestState();
    animateTransform(nextState.scale, nextState.translateY, 12, 6);
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isOutlineCta = interactionPreset === 'outlineCta';
  const isPrimaryCta = interactionPreset === 'cta' && isPrimary;

  const Content = ({ textColor }: { textColor: string }) => (
    <>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
      {icon && (
        <MaterialIcons
          name={icon}
          size={20}
          color={textColor}
          style={{ marginLeft: 8 }}
        />
      )}
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ translateY: translateYAnim }, { scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        disabled={disabled}
        aria-disabled={disabled}
        role="button"
        style={({ pressed, hovered }) => {
          const outlineBorder = isOutlineCta
            ? hovered
              ? hexToRgba(primaryColor, 0.64)
              : hexToRgba(primaryColor, 0.34)
            : outlineVariant;

          const outlineBackground = isOutlineCta
            ? pressed
              ? hexToRgba(primaryColor, 0.16)
              : hovered
                ? hexToRgba(primaryColor, 0.09)
                : 'rgba(255, 255, 255, 0.02)'
            : (pressed || hovered)
              ? surfaceContainerHigh
              : 'transparent';

          return [
            styles.base,
            Platform.OS === 'web' && styles.transitionBase,
            isOutline && {
              borderColor: outlineBorder,
              borderWidth: 1,
              backgroundColor: outlineBackground,
            },
            variant === 'ghost' && {
              backgroundColor: (pressed || hovered) ? surfaceContainerHigh : 'transparent'
            },
            isPrimaryCta && [
              styles.ctaBase,
              Platform.OS === 'web'
                ? ({
                    boxShadow: hovered
                      ? `0 18px 42px ${hexToRgba(primaryColor, 0.24)}, 0 4px 12px rgba(0, 0, 0, 0.18)`
                      : `0 10px 24px ${hexToRgba(primaryColor, 0.16)}, 0 2px 6px rgba(0, 0, 0, 0.12)`,
                  } as any)
                : {
                    shadowColor: primaryColor,
                    shadowOpacity: hovered ? 0.28 : 0.18,
                    shadowRadius: hovered ? 20 : 12,
                    shadowOffset: { width: 0, height: hovered ? 10 : 6 },
                    elevation: hovered ? 10 : 6,
                  },
            ],
            isOutlineCta && [
              styles.outlineCtaBase,
              Platform.OS === 'web'
                ? ({
                    boxShadow: hovered
                      ? `0 14px 34px ${hexToRgba(primaryColor, 0.14)}, 0 3px 10px rgba(0, 0, 0, 0.14)`
                      : `0 8px 20px rgba(0, 0, 0, 0.08)`,
                  } as any)
                : {
                    shadowColor: primaryColor,
                    shadowOpacity: hovered ? 0.18 : 0.08,
                    shadowRadius: hovered ? 16 : 10,
                    shadowOffset: { width: 0, height: hovered ? 8 : 4 },
                    elevation: hovered ? 8 : 3,
                  },
            ],
            disabled && { opacity: 0.5 }
          ];
        }}
      >
        {({ hovered, pressed }) => {
          const textColor = isPrimary
            ? onPrimaryColor
            : isOutlineCta && hovered
              ? primaryColor
              : onSurface;

          return (
            <>
              {isPrimary && (
                <LinearGradient
                  colors={isPrimaryCta ? [primaryColor, '#B48D28'] : [primaryColor, primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { borderRadius: isPrimaryCta ? 8 : 2 },
                  ]}
                />
              )}
              {isPrimaryCta && (
                <>
                  <LinearGradient
                    colors={[
                      hovered ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.14)',
                      'rgba(255, 255, 255, 0)',
                    ]}
                    start={{ x: 0.1, y: 0 }}
                    end={{ x: 0.9, y: 0.85 }}
                    style={[styles.primarySheen, pressed && styles.primarySheenPressed]}
                  />
                  <View
                    pointerEvents="none"
                    style={[
                      styles.primaryRing,
                      { borderColor: hovered ? hexToRgba('#FFFFFF', 0.22) : hexToRgba('#FFFFFF', 0.14) },
                    ]}
                  />
                </>
              )}
              <Content textColor={textColor} />
            </>
          );
        }}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 2,
    minHeight: 52,
    overflow: 'hidden',
  },
  transitionBase: {
    transition: 'background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.22s ease, color 0.18s ease',
  } as any,
  ctaBase: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  outlineCtaBase: {
    borderRadius: 8,
  },
  text: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  primarySheen: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  primarySheenPressed: {
    opacity: 0.7,
  },
  primaryRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderWidth: 1,
  },
});
