import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AuthGuard from '@/components/layout/AuthGuard';
import BookingScaffold from '@/components/wizard/BookingScaffold';
import { buildBookingLoginRoute, buildBookingRoute, normalizeBookingRouteParams, type BookingRouteParams } from '@/components/wizard/navigation';
import type { BookingStaffProfile } from '@/components/wizard/presentation';
import StepStaffSelect from '@/components/wizard/StepStaffSelect';
import StepTimeSelect from '@/components/wizard/StepTimeSelect';
import { BOOKING_TIME_SELECTION_COPY } from '@/components/wizard/time-selection-presentation';
import { useBookingTimeSelection } from '@/components/wizard/use-booking-time-selection';
import { useSalonById } from '@/hooks/use-salons';
import { useStaffBySalonId } from '@/hooks/use-staff';
import { createReservation } from '@/services/reservation.service';
import type { StaffRecord } from '@/services/staff.service';
import { showErrorFlash, showSuccessFlash, showWarningFlash } from '@/utils/flash';

const STAFF_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=400&q=80';

function mapStaffToBookingProfile(staffMember: StaffRecord): BookingStaffProfile {
  return {
    id: staffMember.id,
    salonId: staffMember.salonId,
    name: staffMember.displayName,
    specialty: staffMember.bio?.trim() || 'Berber Uzmani',
    rating: 0,
    reviewCount: 0,
    imageUri: staffMember.photoUrl ?? STAFF_IMAGE_FALLBACK,
  };
}

function formatSalonLocation(city?: string, district?: string | null) {
  if (!city) {
    return 'Salon konumu';
  }

  return district ? `${district}, ${city}` : city;
}

function BookingRouteScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams() as BookingRouteParams;
  const routeParams = React.useMemo(() => normalizeBookingRouteParams(rawParams), [rawParams]);
  const { salon: liveSalon } = useSalonById(routeParams.salonId ?? null);
  const salonId = routeParams.salonId ?? liveSalon?.id ?? null;
  const salonName = routeParams.salonName ?? liveSalon?.name ?? 'USTURA Salonu';
  const salonLocation =
    routeParams.salonLocation ?? formatSalonLocation(liveSalon?.city, liveSalon?.district);
  const {
    staffMembers: liveStaffMembers,
    isLoading: isLoadingStaffMembers,
    error: staffLoadError,
  } = useStaffBySalonId(salonId);
  const staffMembers = React.useMemo<BookingStaffProfile[]>(
    () => liveStaffMembers.map(mapStaffToBookingProfile),
    [liveStaffMembers],
  );
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = React.useState(false);

  React.useEffect(() => {
    if (selectedStaffId && staffMembers.some((member) => member.id === selectedStaffId)) {
      return;
    }

    setSelectedStaffId(staffMembers[0]?.id ?? null);
  }, [selectedStaffId, staffMembers]);

  const selectedStaff = staffMembers.find((member) => member.id === selectedStaffId) ?? null;
  const {
    weekOffset,
    dateOptions,
    selectedDateId,
    selectedTimeId,
    selectedDate,
    selectedTime,
    timeSlots,
    isLoadingSlots,
    slotLoadError,
    isSelectionComplete,
    handleSelectDate,
    handleSelectTime,
    goToPreviousWeek,
    goToNextWeek,
  } = useBookingTimeSelection({
    salonId,
    staffId: selectedStaffId,
  });

  const handleBackToSalons = React.useCallback(() => {
    router.push('/(public)/kuaforler');
  }, [router]);

  const handleContinueToTime = React.useCallback(() => {
    if (!salonId) {
      return;
    }

    router.push(
      buildBookingRoute({
        step: 'time',
        salonId,
        salonName,
        salonLocation,
        staffId: selectedStaffId ?? 'any',
      })
    );
  }, [router, salonId, salonLocation, salonName, selectedStaffId]);

  const handleReturnToStaff = React.useCallback(() => {
    if (!salonId) {
      return;
    }

    router.replace(
      buildBookingRoute({
        step: 'staff',
        salonId,
        salonName,
        salonLocation,
        staffId: selectedStaffId ?? 'any',
      })
    );
  }, [router, salonId, salonLocation, salonName, selectedStaffId]);

  const handleConfirmBooking = React.useCallback(async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    if (!salonId) {
      return;
    }

    const resolvedStaffId = selectedStaffId ?? selectedTime.availableStaffIds[0];

    if (!resolvedStaffId) {
      showWarningFlash('Musait Personel Bulunamadi', 'Bu slot icin atanabilir berber bulunamadi.');
      return;
    }

    try {
      setIsSubmittingReservation(true);
      await createReservation({
        salonId,
        staffId: resolvedStaffId,
        slotStart: selectedTime.startsAt,
      });

      const confirmationMessage = [
        `Salon: ${salonName}`,
        `Berber: ${selectedStaff?.name ?? 'Herhangi Bir Berber'}`,
        `Tarih: ${selectedDate.fullDateLabel}`,
        `Saat: ${selectedTime.label}`,
      ].join('\n');

      showSuccessFlash('Randevu Olusturuldu', confirmationMessage);

      router.replace('/(public)/randevularim');
    } catch (bookingError) {
      const message =
        bookingError instanceof Error
          ? bookingError.message
          : 'Randevu olusturulamadi.';
      showErrorFlash('Randevu Hatasi', message);
    } finally {
      setIsSubmittingReservation(false);
    }
  }, [
    router,
    salonId,
    salonName,
    selectedDate,
    selectedStaff?.name,
    selectedStaffId,
    selectedTime,
  ]);

  if (routeParams.step === 'time') {
    return (
      <BookingScaffold
        currentStep={3}
        onBack={handleReturnToStaff}
        onContinue={() => {
          void handleConfirmBooking();
        }}
        continueLabel={isSubmittingReservation ? 'Olusturuluyor' : BOOKING_TIME_SELECTION_COPY.confirmLabel}
        continueIcon="arrow-forward"
        continueDisabled={!isSelectionComplete || isLoadingSlots || isSubmittingReservation}
        helperLabel={BOOKING_TIME_SELECTION_COPY.durationNote}
        helperIcon="check-circle">
        <StepTimeSelect
          salonName={salonName}
          salonLocation={salonLocation}
          staffName={selectedStaff?.name ?? 'Herhangi Bir Berber'}
          dateOptions={dateOptions}
          selectedDateId={selectedDateId}
          selectedDateLabel={selectedDate?.fullDateLabel}
          selectedTimeId={selectedTimeId}
          timeSlots={timeSlots}
          onSelectDate={handleSelectDate}
          onSelectTime={handleSelectTime}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          previousWeekDisabled={weekOffset === 0}
          isLoadingSlots={isLoadingSlots}
          slotErrorMessage={slotLoadError}
        />
      </BookingScaffold>
    );
  }

  return (
    <BookingScaffold currentStep={2} onBack={handleBackToSalons} onContinue={handleContinueToTime}>
      <StepStaffSelect
        salonName={salonName}
        salonLocation={salonLocation}
        staffMembers={staffMembers}
        isLoading={isLoadingStaffMembers}
        errorMessage={staffLoadError}
        selectedStaffId={selectedStaffId}
        onSelectAny={() => setSelectedStaffId(null)}
        onSelectStaff={setSelectedStaffId}
        onClearSalon={handleBackToSalons}
      />
    </BookingScaffold>
  );
}

export default function RandevuPage() {
  const rawParams = useLocalSearchParams() as BookingRouteParams;
  const routeParams = React.useMemo(() => normalizeBookingRouteParams(rawParams), [rawParams]);
  const loginRedirect = React.useMemo(() => buildBookingLoginRoute(routeParams), [routeParams]);

  return (
    <AuthGuard loginRedirect={loginRedirect}>
      <BookingRouteScreen />
    </AuthGuard>
  );
}
