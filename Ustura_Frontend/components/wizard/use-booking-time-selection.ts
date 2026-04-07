import React from 'react';

import {
  createBookingDateOptions,
  createBookingTimeSlots,
  type BookingDateOption,
} from '@/components/wizard/time-selection-presentation';

interface UseBookingTimeSelectionOptions {
  staffId?: string | null;
}

const DEFAULT_PREFERRED_SLOT = '11:30';

export function useBookingTimeSelection(_options: UseBookingTimeSelectionOptions = {}) {
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [selectedDateId, setSelectedDateId] = React.useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = React.useState<string | null>(null);

  const dateOptions = React.useMemo(() => createBookingDateOptions(weekOffset), [weekOffset]);
  const timeSlots = React.useMemo(() => createBookingTimeSlots(), []);

  React.useEffect(() => {
    if (dateOptions.length === 0) {
      setSelectedDateId(null);
      return;
    }

    const hasSelectedDate = selectedDateId != null && dateOptions.some((option) => option.id === selectedDateId);

    if (hasSelectedDate) {
      return;
    }

    setSelectedDateId(dateOptions[1]?.id ?? dateOptions[0]?.id ?? null);
  }, [dateOptions, selectedDateId]);

  React.useEffect(() => {
    if (timeSlots.length === 0) {
      setSelectedTimeId(null);
      return;
    }

    const hasSelectedTime =
      selectedTimeId != null && timeSlots.some((slot) => slot.id === selectedTimeId && slot.status === 'available');

    if (hasSelectedTime) {
      return;
    }

    const preferredSlot =
      timeSlots.find((slot) => slot.id === DEFAULT_PREFERRED_SLOT && slot.status === 'available') ??
      timeSlots.find((slot) => slot.status === 'available') ??
      null;

    setSelectedTimeId(preferredSlot?.id ?? null);
  }, [selectedTimeId, timeSlots]);

  const selectedDate = React.useMemo(
    () => dateOptions.find((option) => option.id === selectedDateId) ?? null,
    [dateOptions, selectedDateId]
  );

  const selectedTime = React.useMemo(
    () => timeSlots.find((slot) => slot.id === selectedTimeId && slot.status === 'available') ?? null,
    [selectedTimeId, timeSlots]
  );

  const handleSelectDate = React.useCallback((dateId: BookingDateOption['id']) => {
    setSelectedDateId(dateId);
  }, []);

  const handleSelectTime = React.useCallback((timeId: string) => {
    setSelectedTimeId(timeId);
  }, []);

  const goToPreviousWeek = React.useCallback(() => {
    setWeekOffset((currentValue) => Math.max(0, currentValue - 1));
  }, []);

  const goToNextWeek = React.useCallback(() => {
    setWeekOffset((currentValue) => currentValue + 1);
  }, []);

  return {
    weekOffset,
    dateOptions,
    selectedDateId,
    selectedTimeId,
    selectedDate,
    selectedTime,
    timeSlots,
    isSelectionComplete: selectedDate != null && selectedTime != null,
    handleSelectDate,
    handleSelectTime,
    goToPreviousWeek,
    goToNextWeek,
  };
}
