import React from 'react';

import { barberDashboardSnapshot } from './data';

export function useBarberDashboard() {
  return React.useMemo(() => barberDashboardSnapshot, []);
}
