import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  CUSTOMER_BOOKINGS_COPY,
  formatCustomerBookingDateTime,
  type CustomerBookingRecord,
} from '@/components/customer-bookings/presentation';
import Button from '@/components/ui/Button';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface SessionProfileNextBookingCardProps {
  booking: CustomerBookingRecord | null;
  onPress: () => void;
}

export default function SessionProfileNextBookingCard({
  booking,
  onPress,
}: SessionProfileNextBookingCardProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="rounded-[18px] border px-4 py-4"
      style={{
        gap: 12,
        backgroundColor: theme === 'light' ? hexToRgba(primary, 0.08) : surfaceContainerLow,
        borderColor: hexToRgba(outlineVariant, 0.18),
      }}>
      <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text className="font-label text-[10px] font-bold uppercase tracking-[2.2px]" style={{ color: primary }}>
            {CUSTOMER_BOOKINGS_COPY.profileQuickLabel}
          </Text>
          <Text className="font-body text-sm font-bold" style={{ color: onSurface }}>
            {booking?.salonName ?? CUSTOMER_BOOKINGS_COPY.bookingsMenuLabel}
          </Text>
        </View>

        <View
          className="items-center justify-center rounded-full"
          style={{ width: 40, height: 40, backgroundColor: hexToRgba(primary, 0.12) }}>
          <MaterialIcons name="event-available" size={18} color={primary} />
        </View>
      </View>

      <Text className="font-body text-xs" style={{ color: onSurfaceVariant }}>
        {booking
          ? `${booking.barberName} ile ${formatCustomerBookingDateTime(booking.startsAt)}`
          : CUSTOMER_BOOKINGS_COPY.bookingsMenuDescription}
      </Text>

      <Button
        title={CUSTOMER_BOOKINGS_COPY.bookingsMenuLabel}
        variant="outline"
        interactionPreset="outlineCta"
        onPress={onPress}
        style={{ width: '100%' }}
      />
    </View>
  );
}
