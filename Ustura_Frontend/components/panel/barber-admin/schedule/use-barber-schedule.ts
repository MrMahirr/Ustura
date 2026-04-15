import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  cancelReservation,
  getSalonReservations,
  updateReservationStatus,
  type OperationalReservationStatus,
  type ReservationRecord,
} from '@/services/reservation.service';
import { getOwnedSalons } from '@/services/salon.service';
import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';

import { mapReservationsToScheduleDay, mapReservationsToScheduleWeek, mapStaffToScheduleMembers } from './data';
import type { ScheduleDay, ScheduleStaffMember, ScheduleViewMode, ScheduleWeek } from './types';

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatWeekRange(date: Date): string {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1);
  const end = addDays(start, 6);

  const fmt = (d: Date) => d.getDate();
  const monthFmt = (d: Date) =>
    d.toLocaleDateString('tr-TR', { month: 'long' });

  if (start.getMonth() === end.getMonth()) {
    return `${fmt(start)} - ${fmt(end)} ${monthFmt(start)} ${start.getFullYear()}`;
  }

  return `${fmt(start)} ${monthFmt(start)} - ${fmt(end)} ${monthFmt(end)} ${end.getFullYear()}`;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function useBarberSchedule() {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('day');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const [salonId, setSalonId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [staffRecords, setStaffRecords] = useState<StaffRecord[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const salonIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const salons = await getOwnedSalons();
        if (cancelled) return;
        if (salons.length === 0) {
          setError('Salon bulunamadı');
          setLoading(false);
          return;
        }
        const id = salons[0].id;
        salonIdRef.current = id;
        setSalonId(id);

        const staff = await getStaffBySalon(id);
        if (!cancelled) setStaffRecords(staff);
      } catch {
        if (!cancelled) {
          setError('Salon bilgisi alınamadı');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchReservations = useCallback(async (sid: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSalonReservations(sid);
      setReservations(data);
    } catch {
      setError('Randevular yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (salonId) {
      fetchReservations(salonId);
    }
  }, [salonId, currentDate, fetchReservations]);

  const staffMembers: ScheduleStaffMember[] = useMemo(
    () => mapStaffToScheduleMembers(staffRecords),
    [staffRecords],
  );

  const scheduleDay: ScheduleDay = useMemo(() => {
    return mapReservationsToScheduleDay(
      reservations,
      currentDate,
      staffRecords,
      selectedStaffId,
    );
  }, [reservations, currentDate, staffRecords, selectedStaffId]);

  const scheduleWeek: ScheduleWeek = useMemo(() => {
    return mapReservationsToScheduleWeek(
      reservations,
      currentDate,
      staffRecords,
      selectedStaffId,
    );
  }, [reservations, currentDate, staffRecords, selectedStaffId]);

  const dateRangeLabel = useMemo(() => {
    return viewMode === 'week'
      ? formatWeekRange(currentDate)
      : formatDayLabel(currentDate);
  }, [currentDate, viewMode]);

  const goBack = useCallback(() => {
    setCurrentDate((prev) =>
      viewMode === 'week' ? addDays(prev, -7) : addDays(prev, -1),
    );
  }, [viewMode]);

  const goForward = useCallback(() => {
    setCurrentDate((prev) =>
      viewMode === 'week' ? addDays(prev, 7) : addDays(prev, 1),
    );
  }, [viewMode]);

  const refresh = useCallback(async () => {
    const sid = salonIdRef.current;
    if (sid) await fetchReservations(sid);
  }, [fetchReservations]);

  const handleUpdateStatus = useCallback(
    async (reservationId: string, status: OperationalReservationStatus) => {
      setMutating(true);
      try {
        await updateReservationStatus(reservationId, status);
        await refresh();
      } catch {
        setError('Durum güncellenemedi');
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const handleCancel = useCallback(
    async (reservationId: string) => {
      setMutating(true);
      try {
        await cancelReservation(reservationId);
        await refresh();
      } catch {
        setError('Randevu iptal edilemedi');
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  return {
    viewMode,
    setViewMode,
    currentDate,
    dateRangeLabel,
    goBack,
    goForward,
    scheduleDay,
    scheduleWeek,
    loading,
    error,
    mutating,
    handleUpdateStatus,
    handleCancel,
    refresh,
    staffMembers,
    selectedStaffId,
    setSelectedStaffId,
  };
}
