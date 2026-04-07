import type { Href } from 'expo-router';

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export interface BookingRouteParams {
  step?: string | string[];
  salonId?: string | string[];
  salonName?: string | string[];
  salonLocation?: string | string[];
  staffId?: string | string[];
}

export interface NormalizedBookingRouteParams {
  step: 'staff' | 'time';
  salonId?: string;
  salonName?: string;
  salonLocation?: string;
  staffId?: string;
}

export function normalizeBookingRouteParams(params: BookingRouteParams): NormalizedBookingRouteParams {
  const stepParam = getSingleParam(params.step);

  return {
    step: stepParam === 'time' ? 'time' : 'staff',
    salonId: getSingleParam(params.salonId),
    salonName: getSingleParam(params.salonName),
    salonLocation: getSingleParam(params.salonLocation),
    staffId: getSingleParam(params.staffId),
  };
}

export function buildBookingRoute(params: BookingRouteParams): Href {
  const normalized = normalizeBookingRouteParams(params);

  return {
    pathname: '/(public)/randevu',
    params: {
      step: normalized.step,
      ...(normalized.salonId ? { salonId: normalized.salonId } : {}),
      ...(normalized.salonName ? { salonName: normalized.salonName } : {}),
      ...(normalized.salonLocation ? { salonLocation: normalized.salonLocation } : {}),
      ...(normalized.staffId ? { staffId: normalized.staffId } : {}),
    },
  };
}

export function buildBookingLoginRoute(params: BookingRouteParams): Href {
  const normalized = normalizeBookingRouteParams(params);

  return {
    pathname: '/giris',
    params: {
      redirectTo: '/randevu',
      step: normalized.step,
      ...(normalized.salonId ? { salonId: normalized.salonId } : {}),
      ...(normalized.salonName ? { salonName: normalized.salonName } : {}),
      ...(normalized.salonLocation ? { salonLocation: normalized.salonLocation } : {}),
      ...(normalized.staffId ? { staffId: normalized.staffId } : {}),
    },
  };
}
