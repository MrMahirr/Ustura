import React from 'react';

import CustomerBookingsPage from '@/components/customer-bookings/CustomerBookingsPage';
import AuthGuard from '@/components/layout/AuthGuard';

export default function RandevularimPage() {
  return (
    <AuthGuard
      loginRedirect={{
        pathname: '/giris',
        params: {
          redirectTo: '/randevularim',
        },
      }}>
      <CustomerBookingsPage />
    </AuthGuard>
  );
}
