import React from 'react';

import {
  CUSTOMER_BOOKINGS_TABS,
  getBookingTabId,
  getNextUpcomingBooking,
  type CustomerBookingsTabId,
} from '@/components/customer-bookings/presentation';
import { useMyBookings } from '@/hooks/use-my-bookings';

export function useCustomerBookings() {
  const [activeTab, setActiveTab] = React.useState<CustomerBookingsTabId>('upcoming');
  const { bookings, isLoading, error, reload, cancelBooking } = useMyBookings();

  const bookingsByTab = React.useMemo(
    () => ({
      upcoming: bookings.filter((b) => getBookingTabId(b.status) === 'upcoming'),
      completed: bookings.filter((b) => getBookingTabId(b.status) === 'completed'),
      cancelled: bookings.filter((b) => getBookingTabId(b.status) === 'cancelled'),
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
