import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';

interface ServiceCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [isHovered, setIsHovered] = React.useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: isHovered ? surfaceContainerHigh : surfaceContainer,
            borderLeftColor: isHovered ? primary : 'transparent',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isHovered
                ? `${primary}33` // 20% opacity
                : surfaceContainerHighest,
            },
          ]}
        >
          <MaterialIcons name={icon} size={24} color={primary} />
        </View>
        <Text style={[styles.title, { color: onSurface }]}>{title}</Text>
        <Text style={[styles.description, { color: onSurfaceVariant }]}>{description}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 32,
    borderRadius: 12,
    borderLeftWidth: 2,
    transition: 'all 0.3s',
  } as any,
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    transition: 'background-color 0.3s',
  } as any,
  title: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Bold',
    marginBottom: 12,
  },
  description: {
    ...Typography.bodyMd,
    lineHeight: 22,
  },
});
