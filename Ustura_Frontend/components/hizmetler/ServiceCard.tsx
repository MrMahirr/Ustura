import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';

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
          {
            padding: 32,
            borderRadius: 12,
            borderLeftWidth: 2,
            transform: [{ scale: scaleAnim }],
          },
          {
            backgroundColor: isHovered ? surfaceContainerHigh : surfaceContainer,
            borderLeftColor: isHovered ? primary : 'transparent',
          },
        ]}>
        <View className="mb-6 h-12 w-12 items-center justify-center rounded-md" style={{ backgroundColor: isHovered ? `${primary}33` : surfaceContainerHighest }}>
          <MaterialIcons name={icon} size={24} color={primary} />
        </View>
        <Text className="mb-3 font-body text-2xl font-bold" style={{ color: onSurface }}>
          {title}
        </Text>
        <Text className="font-body text-base" style={{ color: onSurfaceVariant, lineHeight: 22 }}>
          {description}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
