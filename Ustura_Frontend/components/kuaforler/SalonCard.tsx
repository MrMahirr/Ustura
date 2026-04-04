import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/typography';
import Button from '@/components/ui/Button';
import { hexToRgba } from '@/utils/color';

export interface SalonCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  barbers: string[];
}

export default function SalonCard({ name, location, rating, reviewCount, imageUrl, barbers }: SalonCardProps) {
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
    <Pressable onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} style={styles.pressableWrapper}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: surfaceContainerLow,
            borderColor: outlineVariant,
            shadowColor: primary,
            shadowOpacity: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] }),
            shadowRadius: 30,
            elevation: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) as any,
          },
        ]}>
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                transform: [{ scale: scaleAnim }],
                opacity: theme === 'light' ? 0.9 : 0.72,
              },
            ]}
            resizeMode="cover"
          />

          <View
            style={[
              styles.ratingBadge,
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
            ]}>
            <MaterialIcons name="star" size={14} color={primary} />
            <Text style={[styles.ratingText, { color: onSurface }]}>{rating.toFixed(1)}</Text>
            <Text style={[styles.reviewText, { color: onSurfaceVariant }]}>({reviewCount})</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurface }]}>{name}</Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={14} color={onSurfaceVariant} />
              <Text style={[styles.locationText, { color: onSurfaceVariant }]}>{location}</Text>
            </View>
          </View>

          <View style={styles.barbersWrapper}>
            {barbers.map((barber, index) => (
              <View key={index} style={[styles.barberChip, { backgroundColor: surfaceContainerHighest }]}>
                <Text style={[styles.barberText, { color: onSurfaceVariant }]}>{barber}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionWrapper}>
            <Button
              title="Randevu Al"
              style={{ width: '100%', paddingVertical: 12, minHeight: 44 }}
              textStyle={{ fontSize: 12, letterSpacing: 1.5 }}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableWrapper: {
    height: '100%',
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 260ms ease' } as any)
      : {}),
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: 1.6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(8px)', transition: 'background-color 360ms ease, border-color 360ms ease' } as any)
      : {}),
  },
  ratingText: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
  },
  reviewText: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
  },
  content: {
    padding: 24,
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    ...Typography.headlineLg,
    fontSize: 24,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...Typography.bodyMd,
  },
  barbersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  barberChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  barberText: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionWrapper: {
    marginTop: 'auto',
  },
});
