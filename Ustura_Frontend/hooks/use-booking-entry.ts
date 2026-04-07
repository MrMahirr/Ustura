import React from 'react';
import { useRouter } from 'expo-router';

import type { SalonListItem } from '@/components/kuaforler/presentation';
import { buildBookingLoginRoute, buildBookingRoute } from '@/components/wizard/navigation';
import { useAuth } from '@/hooks/use-auth';

type BookingSource = Pick<SalonListItem, 'id' | 'name' | 'location'>;

export function useBookingEntry() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const openBooking = React.useCallback(
    (salon: BookingSource) => {
      const bookingParams = {
        step: 'staff',
        salonId: salon.id,
        salonName: salon.name,
        salonLocation: salon.location,
      };

      if (isAuthenticated) {
        router.push(buildBookingRoute(bookingParams));
        return;
      }

      router.push(buildBookingLoginRoute(bookingParams));
    },
    [isAuthenticated, router]
  );

  return { openBooking };
}
