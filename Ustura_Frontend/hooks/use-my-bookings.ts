import React from 'react';

import {
  sortBookingsByDate,
  type CustomerBookingRecord,
  type CustomerBookingStatus,
} from '@/components/customer-bookings/presentation';
import { useAuth } from '@/hooks/use-auth';
import {
  cancelReservation,
  getMyReservations,
  type ReservationRecord,
  type ReservationStatus,
} from '@/services/reservation.service';
import { getSalonById, type SalonRecord } from '@/services/salon.service';
import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';

const DEFAULT_BOOKING_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbCcDL9ClvUTlxURQkh_tdoHL5LahAajl2oTf7AI27_8x2NMx9XY1TZPjfoalIJuugLykfjzZHNkpBm12mAsoJXka8KS5KiuXXPw1lPtLiu9_I-zBtKMmX1mqLCccL7AJxkB7fVNpySKgrfBSCIuN6SfNUTaGWSv29i4YmjIoqCWcydnchIi16Z5tQQ5MX4R7QTs_sOK5c6s4eejJtFSkkCa2rYNn5l-7Y6LJPdYJPTap0U8JqNB0lC1KwEb8TFBfWaUJ2DoGdmSM';

const BACKEND_STATUS_MAP: Record<ReservationStatus, CustomerBookingStatus> = {
  pending: 'pending',
  confirmed: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show',
};

function resolveBarberName(
  staffId: string,
  staffMap: Map<string, StaffRecord>,
): string {
  const staff = staffMap.get(staffId);
  return staff?.displayName ?? 'Berber';
}

function mapReservationToBooking(
  reservation: ReservationRecord,
  salon: SalonRecord | undefined,
  staffMap: Map<string, StaffRecord>,
): CustomerBookingRecord {
  return {
    id: reservation.id,
    salonName: salon?.name ?? 'USTURA Salonu',
    address: salon?.address ?? 'Salon adresi su anda goruntulenemiyor.',
    barberName: resolveBarberName(reservation.staffId, staffMap),
    serviceName: reservation.notes?.trim() || 'Standart Randevu',
    startsAt: reservation.slotStart,
    status: BACKEND_STATUS_MAP[reservation.status],
    imageUri: salon?.photoUrl ?? DEFAULT_BOOKING_IMAGE_URI,
  };
}

async function hydrateBookings(reservations: ReservationRecord[]) {
  const uniqueSalonIds = [...new Set(reservations.map((r) => r.salonId))];

  const [salonEntries, staffEntries] = await Promise.all([
    Promise.all(
      uniqueSalonIds.map(async (salonId) => {
        try {
          const salon = await getSalonById(salonId);
          return [salonId, salon] as const;
        } catch {
          return [salonId, null] as const;
        }
      }),
    ),
    Promise.all(
      uniqueSalonIds.map(async (salonId) => {
        try {
          const staff = await getStaffBySalon(salonId);
          return [salonId, staff] as const;
        } catch {
          return [salonId, [] as StaffRecord[]] as const;
        }
      }),
    ),
  ]);

  const salonMap = new Map<string, SalonRecord | null>(salonEntries);

  const staffMap = new Map<string, StaffRecord>();
  for (const [, staffList] of staffEntries) {
    for (const member of staffList) {
      staffMap.set(member.id, member);
    }
  }

  return sortBookingsByDate(
    reservations.map((reservation) =>
      mapReservationToBooking(
        reservation,
        salonMap.get(reservation.salonId) ?? undefined,
        staffMap,
      ),
    ),
  );
}

export function useMyBookings() {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = React.useState<CustomerBookingRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadBookings = React.useCallback(async () => {
    if (!isAuthenticated) {
      setBookings([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reservations = await getMyReservations();
      const nextBookings = await hydrateBookings(reservations);
      setBookings(nextBookings);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Randevular yuklenemedi.',
      );
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    let isActive = true;

    if (!isAuthenticated) {
      setBookings([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const reservations = await getMyReservations();
        const nextBookings = await hydrateBookings(reservations);

        if (!isActive) {
          return;
        }

        setBookings(nextBookings);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Randevular yuklenemedi.',
        );
        setBookings([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const handleCancelBooking = React.useCallback(async (bookingId: string) => {
    await cancelReservation(bookingId);

    setBookings((currentBookings) =>
      sortBookingsByDate(
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking,
        ),
      ),
    );
  }, []);

  return {
    bookings,
    isLoading,
    error,
    reload: loadBookings,
    cancelBooking: handleCancelBooking,
  };
}
