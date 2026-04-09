import React from 'react';

import {
  CUSTOMER_BOOKINGS_TABS,
  getNextUpcomingBooking,
  type CustomerBookingsTabId,
} from '@/components/customer-bookings/presentation';
import { useMyBookings } from '@/hooks/use-my-bookings';

export function useCustomerBookings() {
  const [activeTab, setActiveTab] = React.useState<CustomerBookingsTabId>('upcoming');
  const { bookings, isLoading, error, reload, cancelBooking } = useMyBookings();

  const bookingsByTab = React.useMemo(
    () => ({
      upcoming: bookings.filter((booking) => booking.status === 'upcoming'),
      completed: bookings.filter((booking) => booking.status === 'completed'),
      cancelled: bookings.filter((booking) => booking.status === 'cancelled'),
    }),
    [bookings]
  );

  const highlightedBooking = React.useMemo(
    () => getNextUpcomingBooking(bookingsByTab.upcoming),
    [bookingsByTab.upcoming]
  );

  const visibleBookings = bookingsByTab[activeTab];

  const tabCounts = React.useMemo(
    () => ({
      upcoming: bookingsByTab.upcoming.length,
      completed: bookingsByTab.completed.length,
      cancelled: bookingsByTab.cancelled.length,
    }),
    [bookingsByTab]
  );

  return {
    tabs: CUSTOMER_BOOKINGS_TABS,
    activeTab,
    visibleBookings,
    highlightedBooking,
    tabCounts,
    isLoading,
    error,
    reload,
    setActiveTab,
    cancelBooking,
  };
}
