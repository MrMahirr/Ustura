import React from 'react';

import {
  CUSTOMER_BOOKINGS_TABS,
  MOCK_CUSTOMER_BOOKINGS,
  getNextUpcomingBooking,
  sortBookingsByDate,
  type CustomerBookingRecord,
  type CustomerBookingsTabId,
} from '@/components/customer-bookings/presentation';

export function useCustomerBookings() {
  const [activeTab, setActiveTab] = React.useState<CustomerBookingsTabId>('upcoming');
  const [bookings, setBookings] = React.useState<CustomerBookingRecord[]>(() =>
    sortBookingsByDate(MOCK_CUSTOMER_BOOKINGS)
  );

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

  const cancelBooking = React.useCallback((bookingId: string) => {
    setBookings((currentBookings) =>
      sortBookingsByDate(
        currentBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      )
    );
  }, []);

  return {
    tabs: CUSTOMER_BOOKINGS_TABS,
    activeTab,
    visibleBookings,
    highlightedBooking,
    tabCounts,
    setActiveTab,
    cancelBooking,
  };
}
