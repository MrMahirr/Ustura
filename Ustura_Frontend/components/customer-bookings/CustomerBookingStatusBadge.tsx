import React from 'react';
import { Text, View } from 'react-native';

import { getCustomerBookingStatusLabel, type CustomerBookingStatus } from '@/components/customer-bookings/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingStatusBadgeProps {
  status: CustomerBookingStatus;
}

export default function CustomerBookingStatusBadge({
  status,
}: CustomerBookingStatusBadgeProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const success = useThemeColor({}, 'success');
  const error = useThemeColor({}, 'error');

  const toneColor =
    status === 'upcoming' ? primary : status === 'completed' ? success : error;

  return (
    <View
      className="self-start rounded-full border px-3 py-1"
      style={{
        backgroundColor: hexToRgba(toneColor, theme === 'light' ? 0.1 : 0.12),
        borderColor: hexToRgba(toneColor, theme === 'light' ? 0.2 : 0.18),
      }}>
      <Text
        className="font-label text-[10px] font-bold uppercase tracking-[2px]"
        style={{ color: toneColor }}>
        {getCustomerBookingStatusLabel(status)}
      </Text>
    </View>
  );
}
