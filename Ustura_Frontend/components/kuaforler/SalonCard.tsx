import React from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export interface SalonCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  barbers: string[];
  onBookPress?: () => void;
}

export default function SalonCard({ name, location, rating, reviewCount, imageUrl, barbers, onBookPress }: SalonCardProps) {
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowAnim = React.useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }),
      Animated.timing(shadowAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const handleHoverOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(shadowAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  return (
    <Pressable className="h-full" onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 18,
            borderWidth: 1,
          },
          {
            backgroundColor: surfaceContainerLow,
            borderColor: outlineVariant,
            shadowColor: primary,
            shadowOpacity: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] }),
            shadowRadius: 30,
            elevation: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) as any,
          },
          Platform.OS === 'web'
            ? ({ transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 260ms ease' } as any)
            : null,
        ]}>
        <View className="relative overflow-hidden" style={{ aspectRatio: 1.6 }}>
          <Animated.Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: '100%',
              transform: [{ scale: scaleAnim }],
              opacity: theme === 'light' ? 0.9 : 0.72,
            }}
            resizeMode="cover"
          />

          <View
            className="absolute right-4 top-4 flex-row items-center gap-1 rounded-full border px-3 py-1"
            style={[
              {
                backgroundColor:
                  theme === 'light'
                    ? Platform.OS === 'web'
                      ? 'rgba(255, 255, 255, 0.92)'
                      : surfaceContainerLowest
                    : Platform.OS === 'web'
                      ? 'rgba(19, 19, 24, 0.8)'
                      : surface,
                borderColor: hexToRgba(primary, theme === 'light' ? 0.22 : 0.16),
              },
              Platform.OS === 'web'
                ? ({ backdropFilter: 'blur(8px)', transition: 'background-color 360ms ease, border-color 360ms ease' } as any)
                : null,
            ]}>
            <MaterialIcons name="star" size={14} color={primary} />
            <Text className="font-body text-base font-bold" style={{ color: onSurface }}>
              {rating.toFixed(1)}
            </Text>
            <Text className="font-body text-xs" style={{ color: onSurfaceVariant }}>
              ({reviewCount})
            </Text>
          </View>
        </View>

        <View className="flex-1 p-6">
          <View className="mb-4">
            <Text className="mb-1 font-headline text-2xl font-bold" style={{ color: onSurface }}>
              {name}
            </Text>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={14} color={onSurfaceVariant} />
              <Text className="font-body text-base" style={{ color: onSurfaceVariant }}>
                {location}
              </Text>
            </View>
          </View>

          <View className="mb-6 flex-row flex-wrap gap-2">
            {barbers.map((barber) => (
              <View key={barber} className="rounded-full px-2 py-1" style={{ backgroundColor: surfaceContainerHighest }}>
                <Text className="font-body text-[10px] font-bold uppercase tracking-[1px]" style={{ color: onSurfaceVariant }}>
                  {barber}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-auto">
            <Button
              title="Randevu Al"
              onPress={onBookPress}
              style={{ width: '100%', paddingVertical: 12, minHeight: 44 }}
              textStyle={{ fontSize: 12, letterSpacing: 1.5 }}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
