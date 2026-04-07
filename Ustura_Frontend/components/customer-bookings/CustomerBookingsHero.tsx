import React from 'react';
import { Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { CUSTOMER_BOOKINGS_COPY } from '@/components/customer-bookings/presentation';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CustomerBookingsHeroProps {
  onCreateBooking: () => void;
}

export default function CustomerBookingsHero({
  onCreateBooking,
}: CustomerBookingsHeroProps) {
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View
      className="flex-row flex-wrap items-end justify-between"
      style={{ gap: 24 }}>
      <View style={{ flex: 1, minWidth: 280, gap: 12 }}>
        <Text className="font-headline text-[56px] font-bold tracking-tight" style={{ color: onSurface }}>
          {CUSTOMER_BOOKINGS_COPY.heroTitle}
        </Text>
        <Text className="font-body text-lg" style={{ maxWidth: 520, color: onSurfaceVariant }}>
          {CUSTOMER_BOOKINGS_COPY.heroDescription}
        </Text>
      </View>

      <Button
        title={CUSTOMER_BOOKINGS_COPY.addBookingLabel}
        interactionPreset="cta"
        icon="add"
        onPress={onCreateBooking}
      />
    </View>
  );
}
