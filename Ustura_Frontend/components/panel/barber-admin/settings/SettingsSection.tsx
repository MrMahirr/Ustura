import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';
import type { ComponentProps } from 'react';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getBarberCardStyle } from './presentation';

interface SettingsSectionProps {
  title: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, icon, description, children }: SettingsSectionProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const cardStyle = getBarberCardStyle(theme);
  const isMobile = width < 640;

  return (
    <View style={cardStyle}>
      <View
        className="flex-row items-center gap-3 border-b px-5 py-4"
        style={{ borderBottomColor: theme.borderSubtle }}>
        <View
          className="h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.08) }}>
          <MaterialIcons name={icon} size={18} color={theme.primary} />
        </View>
        <View className="flex-1">
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-Bold',
              fontSize: 15,
            }}>
            {title}
          </Text>
          {description ? (
            <Text
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.6),
                fontSize: 12,
                marginTop: 2,
              }}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ padding: isMobile ? 16 : 20, gap: 16 }}>
        {children}
      </View>
    </View>
  );
}
