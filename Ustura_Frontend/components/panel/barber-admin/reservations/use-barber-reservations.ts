import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  cancelReservation,
  getSalonReservations,
  updateReservationStatus,
  type OperationalReservationStatus,
  type ReservationRecord,
  type ReservationStatus,
} from '@/services/reservation.service';
import { getOwnedSalons } from '@/services/salon.service';
import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';

import { STATUS_LABELS } from './presentation';
import type {
  ReservationFilterStatus,
  ReservationListItem,
  ReservationOverview,
} from './types';

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildStaffLookup(staff: StaffRecord[]): Map<string, StaffRecord> {
  const map = new Map<string, StaffRecord>();
  for (const s of staff) map.set(s.id, s);
  return map;
}

function mapToListItem(
  r: ReservationRecord,
  staffLookup: Map<string, StaffRecord>,
): ReservationListItem {
  const start = new Date(r.slotStart);
  const end = new Date(r.slotEnd);
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
  const staffMember = staffLookup.get(r.staffId);

  return {
    id: r.id,
    customerName: r.notes ?? 'Müşteri',
    staffName: staffMember?.displayName ?? 'Personel',
    staffId: r.staffId,
    date: formatDate(r.slotStart),
    time: formatTime(r.slotStart),
    endTime: formatTime(r.slotEnd),
    durationMinutes,
    status: r.status,
    statusLabel: STATUS_LABELS[r.status],
    notes: r.notes,
    createdAtLabel: formatDate(r.createdAt),
  };
}

function computeOverview(items: ReservationListItem[]): ReservationOverview {
  return {
    total: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    confirmed: items.filter((i) => i.status === 'confirmed').length,
    completed: items.filter((i) => i.status === 'completed').length,
    cancelled: items.filter((i) => i.status === 'cancelled').length,
    noShow: items.filter((i) => i.status === 'no_show').length,
  };
}

export interface BarberReservationsState {
  allItems: ReservationListItem[];
  filteredItems: ReservationListItem[];
  pageItems: ReservationListItem[];
  overview: ReservationOverview;
  staffMembers: StaffRecord[];
  filterStatus: ReservationFilterStatus;
  setFilterStatus: (status: ReservationFilterStatus) => void;
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  startRow: number;
  endRow: number;
  loading: boolean;
  error: string | null;
  mutating: boolean;
  selectedReservation: ReservationListItem | null;
  setSelectedReservation: (item: ReservationListItem | null) => void;
  handleUpdateStatus: (reservationId: string, status: OperationalReservationStatus) => Promise<void>;
  handleCancel: (reservationId: string) => Promise<void>;
  refresh: () => void;
}

export function useBarberReservations(): BarberReservationsState {
  const [rawReservations, setRawReservations] = useState<ReservationRecord[]>([]);
  const [staffRecords, setStaffRecords] = useState<StaffRecord[]>([]);
  const [salonId, setSalonId] = useState<string | null>(null);
  const salonIdRef = useRef<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<ReservationFilterStatus>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationListItem | null>(null);

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
    return () => { cancelled = true; };
  }, []);

  const fetchReservations = useCallback(async (sid: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSalonReservations(sid);
      setRawReservations(data);
    } catch {
      setError('Randevular yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (salonId) fetchReservations(salonId);
  }, [salonId, fetchReservations]);

  const staffLookup = useMemo(() => buildStaffLookup(staffRecords), [staffRecords]);

  const allItems = useMemo(
    () =>
      rawReservations
        .map((r) => mapToListItem(r, staffLookup))
        .sort((a, b) => {
          const statusOrder: Record<ReservationStatus, number> = {
            pending: 0,
            confirmed: 1,
            completed: 2,
            no_show: 3,
            cancelled: 4,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        }),
    [rawReservations, staffLookup],
  );

  const overview = useMemo(() => computeOverview(allItems), [allItems]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (filterStatus !== 'all') {
      items = items.filter((i) => i.status === filterStatus);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.customerName.toLowerCase().includes(q) ||
          i.staffName.toLowerCase().includes(q) ||
          i.date.toLowerCase().includes(q),
      );
    }
    return items;
  }, [allItems, filterStatus, query]);

  useEffect(() => { setPage(1); }, [filterStatus, query]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const startRow = (page - 1) * PAGE_SIZE;
  const endRow = Math.min(startRow + PAGE_SIZE, filteredItems.length);
  const pageItems = filteredItems.slice(startRow, endRow);

  const refresh = useCallback(() => {
    const sid = salonIdRef.current;
    if (sid) fetchReservations(sid);
  }, [fetchReservations]);

  const handleUpdateStatus = useCallback(
    async (reservationId: string, status: OperationalReservationStatus) => {
      setMutating(true);
      try {
        await updateReservationStatus(reservationId, status);
        await refresh();
        setSelectedReservation(null);
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
        setSelectedReservation(null);
      } catch {
        setError('Randevu iptal edilemedi');
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  return {
    allItems,
    filteredItems,
    pageItems,
    overview,
    staffMembers: staffRecords,
    filterStatus,
    setFilterStatus,
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    startRow: startRow + 1,
    endRow,
    loading,
    error,
    mutating,
    selectedReservation,
    setSelectedReservation,
    handleUpdateStatus,
    handleCancel,
    refresh,
  };
}
