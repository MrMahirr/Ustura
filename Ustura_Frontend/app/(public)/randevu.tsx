import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AuthGuard from '@/components/layout/AuthGuard';
import { getSalonById } from '@/components/kuaforler/presentation';
import BookingScaffold from '@/components/wizard/BookingScaffold';
import { buildBookingLoginRoute, buildBookingRoute, normalizeBookingRouteParams, type BookingRouteParams } from '@/components/wizard/navigation';
import { getStaffBySalonId } from '@/components/wizard/presentation';
import StepStaffSelect from '@/components/wizard/StepStaffSelect';
import StepTimeSelect from '@/components/wizard/StepTimeSelect';

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

  if (routeParams.step === 'time') {
    return (
      <BookingScaffold
        currentStep={3}
        onBack={handleReturnToStaff}
        continueLabel="Yakinda"
        continueDisabled>
        <StepTimeSelect salonName={salonName} staffName={selectedStaff?.name ?? 'Herhangi Bir Berber'} />
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
