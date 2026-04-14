import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { getSettingsCardStyle, getStatusColor } from './presentation';
import type { ConfigDisplayItem, ConfigGroup } from './types';

interface ConfigCardProps {
  group: ConfigGroup;
}

export default function ConfigCard({ group }: ConfigCardProps) {
  const { width } = useWindowDimensions();
  const theme = useSuperAdminTheme();
  const cardStyle = getSettingsCardStyle(theme);
  const isMobile = width < 640;

  return (
    <View style={cardStyle}>
      <View
        className="flex-row items-center gap-3 border-b px-5 py-4"
        style={{ borderBottomColor: theme.borderSubtle }}>
        <View
          className="h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.08) }}>
          <MaterialIcons name={group.icon} size={18} color={theme.primary} />
        </View>
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-Bold',
            fontSize: 15,
          }}>
          {group.title}
        </Text>
      </View>

      <View style={{ padding: isMobile ? 16 : 20, gap: isMobile ? 12 : 16 }}>
        {group.items.map((item, i) => (
          <ConfigRow key={i} item={item} isLast={i === group.items.length - 1} />
        ))}
      </View>
    </View>
  );
}

function ConfigRow({ item, isLast }: { item: ConfigDisplayItem; isLast: boolean }) {
  const { width } = useWindowDimensions();
  const theme = useSuperAdminTheme();
  const statusColor = getStatusColor(theme, item.status);
  const isMobile = width < 640;

  return (
    <View
      style={[
        {
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 4 : 12,
          paddingBottom: isLast ? 0 : isMobile ? 12 : 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.06),
        },
      ]}>
      <View className="flex-row items-center gap-2">
        <View
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.8),
            fontFamily: 'Manrope-Bold',
            fontSize: 13,
          }}>
          {item.label}
        </Text>
      </View>

      <Text
        style={[
          {
            color: item.status === 'missing'
              ? theme.error
              : theme.onSurface,
            fontSize: 13,
          },
          item.masked
            ? { fontFamily: theme.monoFont, letterSpacing: 1 }
            : { fontFamily: 'Manrope-Bold' },
          Platform.OS === 'web' && !isMobile
            ? ({ textAlign: 'right', maxWidth: '60%' } as any)
            : null,
        ]}
        numberOfLines={2}>
        {item.value}
      </Text>
    </View>
  );
}
