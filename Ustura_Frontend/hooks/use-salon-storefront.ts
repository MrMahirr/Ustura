import React from 'react';

import { getSalonById, type SalonRecord } from '@/services/salon.service';
import {
  getSalonServices,
  type SalonServiceRecord,
} from '@/services/salon-service.service';
import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';

interface SalonStorefrontState {
  salon: SalonRecord | null;
  staff: StaffRecord[];
  services: SalonServiceRecord[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY_STATE: SalonStorefrontState = {
  salon: null,
  staff: [],
  services: [],
  isLoading: false,
  error: null,
};

export function useSalonStorefront(salonId?: string | null) {
  const [state, setState] = React.useState<SalonStorefrontState>({
    ...EMPTY_STATE,
    isLoading: Boolean(salonId),
  });

  const loadStorefront = React.useCallback(async () => {
    if (!salonId) {
      setState(EMPTY_STATE);
      return;
    }

    setState((previous) => ({
      ...previous,
      isLoading: true,
      error: null,
    }));

    const [salonResult, staffResult, servicesResult] = await Promise.allSettled([
      getSalonById(salonId),
      getStaffBySalon(salonId),
      getSalonServices(salonId),
    ]);

    if (salonResult.status === 'rejected') {
      setState({
        salon: null,
        staff: [],
        services: [],
        isLoading: false,
        error:
          salonResult.reason instanceof Error
            ? salonResult.reason.message
            : 'Salon detaylari yuklenemedi.',
      });
      return;
    }

    setState({
      salon: salonResult.value,
      staff: staffResult.status === 'fulfilled' ? staffResult.value : [],
      services: servicesResult.status === 'fulfilled' ? servicesResult.value : [],
      isLoading: false,
      error: null,
    });
  }, [salonId]);

  React.useEffect(() => {
    let isActive = true;

    if (!salonId) {
      setState(EMPTY_STATE);
      return;
    }

    const run = async () => {
      setState((previous) => ({
        ...previous,
        isLoading: true,
        error: null,
      }));

      const [salonResult, staffResult, servicesResult] = await Promise.allSettled([
        getSalonById(salonId),
        getStaffBySalon(salonId),
        getSalonServices(salonId),
      ]);

      if (!isActive) {
        return;
      }

      if (salonResult.status === 'rejected') {
        setState({
          salon: null,
          staff: [],
          services: [],
          isLoading: false,
          error:
            salonResult.reason instanceof Error
              ? salonResult.reason.message
              : 'Salon detaylari yuklenemedi.',
        });
        return;
      }

      setState({
        salon: salonResult.value,
        staff: staffResult.status === 'fulfilled' ? staffResult.value : [],
        services: servicesResult.status === 'fulfilled' ? servicesResult.value : [],
        isLoading: false,
        error: null,
      });
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [salonId]);

  return {
    ...state,
    reload: loadStorefront,
  };
}
