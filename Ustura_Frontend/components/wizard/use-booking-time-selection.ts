import React from 'react';

import {
  createBookingDateOptions,
  type BookingDateOption,
  type BookingTimeSlot,
} from '@/components/wizard/time-selection-presentation';
import { getAvailableSlots } from '@/services/slot.service';

interface UseBookingTimeSelectionOptions {
  salonId?: string | null;
  staffId?: string | null;
}

const DEFAULT_PREFERRED_SLOT = '11:30';

export function useBookingTimeSelection(options: UseBookingTimeSelectionOptions = {}) {
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [selectedDateId, setSelectedDateId] = React.useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = React.useState<string | null>(null);
  const [timeSlots, setTimeSlots] = React.useState<BookingTimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [slotLoadError, setSlotLoadError] = React.useState<string | null>(null);

  const dateOptions = React.useMemo(() => createBookingDateOptions(weekOffset), [weekOffset]);

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
    let isActive = true;

    if (!options.salonId || !selectedDateId) {
      setTimeSlots([]);
      setSelectedTimeId(null);
      setSlotLoadError(null);
      setIsLoadingSlots(false);
      return;
    }

    const run = async () => {
      setIsLoadingSlots(true);
      setSlotLoadError(null);

      try {
        const slots = await getAvailableSlots(options.salonId!, {
          date: selectedDateId,
          staffId: options.staffId,
        });

        if (!isActive) {
          return;
        }

        setTimeSlots(
          slots.map((slot) => ({
            id: slot.id,
            label: slot.label,
            startsAt: slot.startsAt,
            endsAt: slot.endsAt,
            status: slot.status,
            availableStaffIds: slot.availableStaffIds,
          })),
        );
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setTimeSlots([]);
        setSlotLoadError(
          loadError instanceof Error
            ? loadError.message
            : 'Slot bilgisi yuklenemedi.',
        );
      } finally {
        if (isActive) {
          setIsLoadingSlots(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [options.salonId, options.staffId, selectedDateId]);

  React.useEffect(() => {
    if (timeSlots.length === 0) {
      setSelectedTimeId(null);
      return;
    }

    const hasSelectedTime =
      selectedTimeId != null &&
      timeSlots.some((slot) => slot.id === selectedTimeId && slot.status === 'available');

    if (hasSelectedTime) {
      return;
    }

    const preferredSlot =
      timeSlots.find(
        (slot) => slot.label === DEFAULT_PREFERRED_SLOT && slot.status === 'available',
      ) ??
      timeSlots.find((slot) => slot.status === 'available') ??
      null;

    setSelectedTimeId(preferredSlot?.id ?? null);
  }, [selectedTimeId, timeSlots]);

  const selectedDate = React.useMemo(
    () => dateOptions.find((option) => option.id === selectedDateId) ?? null,
    [dateOptions, selectedDateId]
  );

  const selectedTime = React.useMemo(
    () =>
      timeSlots.find(
        (slot) => slot.id === selectedTimeId && slot.status === 'available',
      ) ?? null,
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
    isLoadingSlots,
    slotLoadError,
    isSelectionComplete: selectedDate != null && selectedTime != null,
    handleSelectDate,
    handleSelectTime,
    goToPreviousWeek,
    goToNextWeek,
  };
}
