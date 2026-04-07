import React from 'react';

import { getSalonProfileById } from '@/components/panel/super-admin/salon-profile/data';

export function useSalonProfile(salonId?: string) {
  return React.useMemo(() => getSalonProfileById(salonId), [salonId]);
}
