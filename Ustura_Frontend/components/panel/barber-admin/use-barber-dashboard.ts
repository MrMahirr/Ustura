import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getSalonReservations, type ReservationRecord } from '@/services/reservation.service';
import { getOwnedSalons } from '@/services/salon.service';
import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';
import { getMyProfile } from '@/services/user.service';

import { buildDashboardSnapshot, type BarberDashboardSnapshot } from './data';

const EMPTY_SNAPSHOT: BarberDashboardSnapshot = {
  heroLabel: 'Yönetim Paneli',
  title: 'Hoş Geldiniz.',
  subtitle: 'Veriler yükleniyor...',
  dateLabel: '',
  metrics: [],
  appointments: [],
  staff: [],
};

export function useBarberDashboard() {
  const [userName, setUserName] = useState('');
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const salonIdRef = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profile, salons] = await Promise.all([
        getMyProfile(),
        getOwnedSalons(),
      ]);

      setUserName(profile.name);

      if (salons.length === 0) {
        setError('Salon bulunamadı');
        setLoading(false);
        return;
      }

      const salonId = salons[0].id;
      salonIdRef.current = salonId;

      const [reservationData, staffData] = await Promise.all([
        getSalonReservations(salonId),
        getStaffBySalon(salonId),
      ]);

      setReservations(reservationData);
      setStaff(staffData);
    } catch {
      setError('Dashboard verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const snapshot = useMemo<BarberDashboardSnapshot>(() => {
    if (loading && reservations.length === 0 && staff.length === 0) {
      return EMPTY_SNAPSHOT;
    }
    return buildDashboardSnapshot(userName, reservations, staff);
  }, [userName, reservations, staff, loading]);

  return {
    ...snapshot,
    loading,
    error,
    refresh: fetchAll,
  };
}
