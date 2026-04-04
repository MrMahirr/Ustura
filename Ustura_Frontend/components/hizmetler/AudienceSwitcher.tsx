import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';

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
    <View style={styles.container}>
      <View style={[styles.wrapper, { backgroundColor: surfaceContainerLow }]}>
        <Animated.View style={{ transform: [{ scale: scaleCustomer }] }}>
          <Pressable
            onPress={() => onSwitch('customers')}
            onHoverIn={() => animateHover(scaleCustomer, true)}
            onHoverOut={() => animateHover(scaleCustomer, false)}
            style={[
              styles.tab,
              active === 'customers'
                ? { backgroundColor: primary }
                : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: active === 'customers' ? onPrimary : onSurfaceVariant,
                },
              ]}
            >
              Müşteriler İçin
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleOwner }] }}>
          <Pressable
            onPress={() => onSwitch('owners')}
            onHoverIn={() => animateHover(scaleOwner, true)}
            onHoverOut={() => animateHover(scaleOwner, false)}
            style={[
              styles.tab,
              active === 'owners'
                ? { backgroundColor: primary }
                : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: active === 'owners' ? onPrimary : onSurfaceVariant,
                },
              ]}
            >
              Kuaförler İçin
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 64,
  },
  wrapper: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    transition: 'all 0.3s',
  } as any,
  tabText: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
    transition: 'color 0.3s',
  } as any,
});
