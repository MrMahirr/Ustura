import React from 'react';
import { Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AuthGuard from '@/components/layout/AuthGuard';
import { getSalonById } from '@/components/kuaforler/presentation';
import BookingScaffold from '@/components/wizard/BookingScaffold';
import { buildBookingLoginRoute, buildBookingRoute, normalizeBookingRouteParams, type BookingRouteParams } from '@/components/wizard/navigation';
import { getStaffBySalonId } from '@/components/wizard/presentation';
import StepStaffSelect from '@/components/wizard/StepStaffSelect';
import StepTimeSelect from '@/components/wizard/StepTimeSelect';
import { BOOKING_TIME_SELECTION_COPY } from '@/components/wizard/time-selection-presentation';
import { useBookingTimeSelection } from '@/components/wizard/use-booking-time-selection';

function BookingRouteScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams<BookingRouteParams>();
  const routeParams = React.useMemo(() => normalizeBookingRouteParams(rawParams), [rawParams]);

  const resolvedSalon = React.useMemo(() => getSalonById(routeParams.salonId), [routeParams.salonId]);
  const salonName = routeParams.salonName ?? resolvedSalon.name;
  const salonLocation = routeParams.salonLocation ?? resolvedSalon.location;
  const staffMembers = React.useMemo(() => getStaffBySalonId(resolvedSalon.id), [resolvedSalon.id]);
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (routeParams.staffId === 'any') {
      setSelectedStaffId(null);
      return;
    }

    if (routeParams.staffId && staffMembers.some((member) => member.id === routeParams.staffId)) {
      setSelectedStaffId(routeParams.staffId);
      return;
    }

    setSelectedStaffId(staffMembers[0]?.id ?? null);
  }, [routeParams.staffId, staffMembers]);

  const selectedStaff = staffMembers.find((member) => member.id === selectedStaffId) ?? null;
  const {
    weekOffset,
    dateOptions,
    selectedDateId,
    selectedTimeId,
    selectedDate,
    selectedTime,
    timeSlots,
    isSelectionComplete,
    handleSelectDate,
    handleSelectTime,
    goToPreviousWeek,
    goToNextWeek,
  } = useBookingTimeSelection({ staffId: selectedStaffId });

  const handleBackToSalons = React.useCallback(() => {
    router.push('/(public)/kuaforler');
  }, [router]);

  const handleContinueToTime = React.useCallback(() => {
    router.push(
      buildBookingRoute({
        step: 'time',
        salonId: resolvedSalon.id,
        salonName,
        salonLocation,
        staffId: selectedStaffId ?? 'any',
      })
    );
  }, [resolvedSalon.id, router, salonLocation, salonName, selectedStaffId]);

  const handleReturnToStaff = React.useCallback(() => {
    router.replace(
      buildBookingRoute({
        step: 'staff',
        salonId: resolvedSalon.id,
        salonName,
        salonLocation,
        staffId: selectedStaffId ?? 'any',
      })
    );
  }, [resolvedSalon.id, router, salonLocation, salonName, selectedStaffId]);

  const handleConfirmBooking = React.useCallback(() => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const staffLabel = selectedStaff?.name ?? 'Herhangi Bir Berber';
    const previewMessage = [
      `Salon: ${salonName}`,
      `Berber: ${staffLabel}`,
      `Tarih: ${selectedDate.fullDateLabel}`,
      `Saat: ${selectedTime.label}`,
      '',
      BOOKING_TIME_SELECTION_COPY.confirmPreviewDescription,
    ].join('\n');

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${BOOKING_TIME_SELECTION_COPY.confirmPreviewTitle}\n\n${previewMessage}`);
      return;
    }

    Alert.alert(BOOKING_TIME_SELECTION_COPY.confirmPreviewTitle, previewMessage);
  }, [salonName, selectedDate, selectedStaff?.name, selectedTime]);

  if (routeParams.step === 'time') {
    return (
      <BookingScaffold
        currentStep={3}
        onBack={handleReturnToStaff}
        onContinue={handleConfirmBooking}
        continueLabel={BOOKING_TIME_SELECTION_COPY.confirmLabel}
        continueIcon="arrow-forward"
        continueDisabled={!isSelectionComplete}
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
        selectedStaffId={selectedStaffId}
        onSelectAny={() => setSelectedStaffId(null)}
        onSelectStaff={setSelectedStaffId}
        onClearSalon={handleBackToSalons}
      />
    </BookingScaffold>
  );
}

export default function RandevuPage() {
  const rawParams = useLocalSearchParams<BookingRouteParams>();
  const routeParams = React.useMemo(() => normalizeBookingRouteParams(rawParams), [rawParams]);
  const loginRedirect = React.useMemo(() => buildBookingLoginRoute(routeParams), [routeParams]);

  return (
    <AuthGuard loginRedirect={loginRedirect}>
      <BookingRouteScreen />
    </AuthGuard>
  );
}
