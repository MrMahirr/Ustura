import type { Href } from 'expo-router';

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export interface CustomerAuthRedirectParams {
  redirectTo?: string | string[];
  salonId?: string | string[];
  salonName?: string | string[];
  salonLocation?: string | string[];
  step?: string | string[];
}

export function resolveCustomerAuthRedirect(params: CustomerAuthRedirectParams): Href {
  const redirectTo = getSingleParam(params.redirectTo);

  if (redirectTo === '/randevu' || redirectTo === '/(public)/randevu') {
    const salonId = getSingleParam(params.salonId);
    const salonName = getSingleParam(params.salonName);
    const salonLocation = getSingleParam(params.salonLocation);
    const step = getSingleParam(params.step) ?? 'staff';

    return {
      pathname: '/(public)/randevu',
      params: {
        step,
        ...(salonId ? { salonId } : {}),
        ...(salonName ? { salonName } : {}),
        ...(salonLocation ? { salonLocation } : {}),
      },
    };
  }

  if (redirectTo === '/randevularim' || redirectTo === '/(public)/randevularim') {
    return '/(public)/randevularim';
  }

  return '/(public)';
}
