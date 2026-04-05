import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type Audience = 'customers' | 'owners';

interface AudienceSwitcherProps {
  active: Audience;
  onSwitch: (audience: Audience) => void;
}

export default function AudienceSwitcher({ active, onSwitch }: AudienceSwitcherProps) {
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const scaleCustomer = React.useRef(new Animated.Value(1)).current;
  const scaleOwner = React.useRef(new Animated.Value(1)).current;

  const animateHover = (anim: Animated.Value, isIn: boolean) => {
    Animated.spring(anim, {
      toValue: isIn ? 1.03 : 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  };

  return (
    <View className="mb-16 items-center">
      <View className="flex-row gap-2 rounded-xl p-1.5" style={{ backgroundColor: surfaceContainerLow }}>
        <Animated.View style={{ transform: [{ scale: scaleCustomer }] }}>
          <Pressable
            className="rounded-xl px-8 py-3.5"
            onPress={() => onSwitch('customers')}
            onHoverIn={() => animateHover(scaleCustomer, true)}
            onHoverOut={() => animateHover(scaleCustomer, false)}
            style={active === 'customers' ? { backgroundColor: primary } : undefined}>
            <Text className="font-body text-base font-bold" style={{ color: active === 'customers' ? onPrimary : onSurfaceVariant }}>
              Musteriler Icin
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleOwner }] }}>
          <Pressable
            className="rounded-xl px-8 py-3.5"
            onPress={() => onSwitch('owners')}
            onHoverIn={() => animateHover(scaleOwner, true)}
            onHoverOut={() => animateHover(scaleOwner, false)}
            style={active === 'owners' ? { backgroundColor: primary } : undefined}>
            <Text className="font-body text-base font-bold" style={{ color: active === 'owners' ? onPrimary : onSurfaceVariant }}>
              Kuaforler Icin
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
