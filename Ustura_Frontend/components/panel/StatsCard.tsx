import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

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
      className="min-h-[128px] justify-between rounded-sm p-5"
      style={[
        {
          backgroundColor: surfaceContainerLow,
          borderLeftWidth: highlight === 'alert' ? 2 : 0,
          borderLeftColor: highlight === 'alert' ? error : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 200ms ease',
              cursor: 'default',
            } as any)
          : null,
      ]}>
      <View className="mb-4 flex-row items-start justify-between">
        <Text className="mr-2 flex-1 font-label text-[10px] uppercase tracking-wide" style={{ color: labelColor }}>
          {label}
        </Text>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>

      <View>
        <Text className="mb-1.5 font-headline text-[26px] leading-[30px]" style={{ color: valueColor }}>
          {value}
        </Text>
        {trendLabel ? (
          <View className="flex-row items-center">
            {trendTone !== 'neutral' ? (
              <MaterialIcons name={trendIcon} size={14} color={trendColor} style={{ marginRight: 4 }} />
            ) : null}
            <Text className="font-label text-[10px] tracking-[0.2px]" style={{ color: trendColor }}>
              {trendLabel}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
