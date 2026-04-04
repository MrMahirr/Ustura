import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Typography } from '@/constants/typography';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface StatsCardProps {
  label: string;
  value: string;
  icon: IconName;
  trendLabel?: string;
  trendTone?: 'positive' | 'negative' | 'neutral';
  highlight?: 'default' | 'alert';
}

export default function StatsCard({
  label,
  value,
  icon,
  trendLabel,
  trendTone = 'neutral',
  highlight = 'default',
}: StatsCardProps) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const success = useThemeColor({}, 'success');
  const error = useThemeColor({}, 'error');

  const trendColor =
    trendTone === 'positive' ? success : trendTone === 'negative' ? error : onSurfaceVariant;
  const iconColor = highlight === 'alert' ? error : primary;
  const valueColor = highlight === 'alert' ? error : onSurface;
  const labelColor = highlight === 'alert' ? error : onSurfaceVariant;

  const trendIcon: IconName =
    trendTone === 'positive' ? 'trending-up' : trendTone === 'negative' ? 'trending-down' : 'trending-flat';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surfaceContainerLow,
          borderLeftWidth: highlight === 'alert' ? 2 : 0,
          borderLeftColor: highlight === 'alert' ? error : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 200ms ease',
            } as any)
          : null,
      ]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>

      <View>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        {trendLabel ? (
          <View style={styles.trendRow}>
            {trendTone !== 'neutral' ? (
              <MaterialIcons name={trendIcon} size={14} color={trendColor} style={styles.trendIcon} />
            ) : null}
            <Text style={[styles.trend, { color: trendColor }]}>{trendLabel}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    padding: 20,
    minHeight: 128,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'default',
        } as any)
      : {}),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  label: {
    ...Typography.labelSm,
    fontSize: 10,
    flex: 1,
    marginRight: 8,
    fontFamily: 'Manrope-Bold',
  },
  value: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 4,
  },
  trend: {
    ...Typography.labelSm,
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0.2,
  },
});
