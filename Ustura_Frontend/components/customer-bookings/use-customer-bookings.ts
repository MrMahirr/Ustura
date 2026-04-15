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
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(null);
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
  const selectedBooking = React.useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) ?? null,
    [bookings, selectedBookingId]
  );

  const tabCounts = React.useMemo(
    () => ({
      upcoming: bookingsByTab.upcoming.length,
      completed: bookingsByTab.completed.length,
      cancelled: bookingsByTab.cancelled.length,
    }),
    [bookingsByTab]
  );

  const openBookingDetails = React.useCallback((bookingId: string) => {
    setSelectedBookingId(bookingId);
  }, []);

  const closeBookingDetails = React.useCallback(() => {
    setSelectedBookingId(null);
  }, []);

  return {
    tabs: CUSTOMER_BOOKINGS_TABS,
    activeTab,
    visibleBookings,
    highlightedBooking,
    selectedBooking,
    tabCounts,
    isLoading,
    error,
    reload,
    setActiveTab,
    openBookingDetails,
    closeBookingDetails,
    cancelBooking,
  };
}
