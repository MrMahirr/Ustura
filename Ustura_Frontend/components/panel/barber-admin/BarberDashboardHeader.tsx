import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from './theme';

interface BarberDashboardHeaderProps {
  heroLabel: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  isWide: boolean;
}

export default function BarberDashboardHeader({
  heroLabel,
  title,
  subtitle,
  dateLabel,
  isWide,
}: BarberDashboardHeaderProps) {
  const theme = useBarberAdminTheme();

  return (
    <View className={isWide ? 'flex-row items-end justify-between gap-8' : 'gap-5'}>
      <View className="max-w-[760px] gap-2">
        <Text
          className="font-body text-xs uppercase tracking-[3px]"
          style={{ color: theme.primary, fontFamily: 'Manrope-SemiBold' }}>
          {heroLabel}
        </Text>
        <Text
          className="font-headline text-[42px] leading-[46px]"
          style={{ color: theme.onSurface, fontFamily: 'NotoSerif-Bold' }}>
          {title}
        </Text>
        <Text
          className="max-w-[680px] font-body text-[15px] leading-6"
          style={{ color: hexToRgba(theme.onSurfaceVariant, 0.92), fontFamily: 'Manrope-Regular' }}>
          {subtitle}
        </Text>
      </View>

      <View
        className="flex-row items-center gap-3 rounded-xl border px-5 py-3"
        style={{
          backgroundColor: theme.panelBackground,
          borderColor: theme.borderStrong,
        }}>
        <MaterialIcons name="calendar-month" size={20} color={theme.primary} />
        <Text
          className="font-body text-xs uppercase tracking-[2.2px]"
          style={{ color: theme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
          {dateLabel}
        </Text>
      </View>
    </View>
  );
}
