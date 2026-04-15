import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';

import { getOwnedSalons, type OwnedSalonSummary } from '@/services/salon.service';
import {
  createStaffMember,
  deleteStaffMember,
  getStaffBySalon,
  removeStaffMemberPhoto,
  uploadStaffMemberPhoto,
  updateStaffMember,
  type StaffRecord,
  type StaffRole,
} from '@/services/staff.service';

import {
  STAFF_PERMISSION_HIGHLIGHTS,
  STAFF_ROLE_ACTION_LABELS,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
} from './presentation';
import type {
  StaffDirectoryItem,
  StaffEditorValues,
  StaffOverview,
  StaffRoleFilter,
  StaffRoleInsight,
} from './types';

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function createInitials(displayName: string) {
  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'ST';
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

function mapStaffItem(record: StaffRecord): StaffDirectoryItem {
  return {
    id: record.id,
    userId: record.userId,
    displayName: record.displayName,
    email: record.email,
    phone: record.phone,
    role: record.role,
    roleLabel: STAFF_ROLE_LABELS[record.role],
    bio: record.bio,
    photoUrl: record.photoUrl,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdAtLabel: formatDateLabel(record.createdAt),
    updatedAtLabel: formatDateLabel(record.updatedAt),
    initials: createInitials(record.displayName),
    permissionHighlights: STAFF_PERMISSION_HIGHLIGHTS[record.role],
  };
}

function computeOverview(items: StaffDirectoryItem[]): StaffOverview {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return {
    total: items.length,
    barberCount: items.filter((item) => item.role === 'barber').length,
    receptionistCount: items.filter((item) => item.role === 'receptionist').length,
    recentlyAdded: items.filter((item) => new Date(item.createdAt).getTime() >= thirtyDaysAgo).length,
  };
}

function toRoleInsights(items: StaffDirectoryItem[]): StaffRoleInsight[] {
  const counts = items.reduce<Record<StaffRole, number>>(
    (accumulator, item) => {
      accumulator[item.role] += 1;
      return accumulator;
    },
    { barber: 0, receptionist: 0 },
  );

  return (Object.keys(counts) as StaffRole[]).map((role) => ({
    role,
    label: STAFF_ROLE_LABELS[role],
    description: STAFF_ROLE_DESCRIPTIONS[role],
    actionLabel: STAFF_ROLE_ACTION_LABELS[role],
    count: counts[role],
    highlights: STAFF_PERMISSION_HIGHLIGHTS[role],
  }));
}

function sortStaffItems(items: StaffDirectoryItem[]) {
  return [...items].sort((left, right) => {
    if (left.role !== right.role) {
      return left.role === 'barber' ? -1 : 1;
    }

    return left.displayName.localeCompare(right.displayName, 'tr');
  });
}

function sanitizeOptionalValue(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export interface BarberStaffState {
  salon: OwnedSalonSummary | null;
  items: StaffDirectoryItem[];
  filteredItems: StaffDirectoryItem[];
  overview: StaffOverview;
  roleInsights: StaffRoleInsight[];
  roleFilter: StaffRoleFilter;
  setRoleFilter: (value: StaffRoleFilter) => void;
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  error: string | null;
  mutating: boolean;
  refresh: () => Promise<void>;
  createStaffAccess: (values: StaffEditorValues) => Promise<void>;
  updateStaffAccess: (staffId: string, values: StaffEditorValues) => Promise<void>;
  removeStaffAccess: (staffId: string) => Promise<void>;
}

export function useBarberStaff(): BarberStaffState {
  const [salon, setSalon] = useState<OwnedSalonSummary | null>(null);
  const [staffRecords, setStaffRecords] = useState<StaffRecord[]>([]);
  const [roleFilter, setRoleFilter] = useState<StaffRoleFilter>('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ownedSalons = await getOwnedSalons();
      const managedSalon = ownedSalons[0];

      if (!managedSalon) {
        setSalon(null);
        setStaffRecords([]);
        setError('Yonetebileceginiz aktif bir salon bulunamadi.');
        return;
      }

      setSalon(managedSalon);
      const staff = await getStaffBySalon(managedSalon.id);
      setStaffRecords(staff);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Personel listesi yuklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const items = useMemo(() => sortStaffItems(staffRecords.map(mapStaffItem)), [staffRecords]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('tr');

    return items.filter((item) => {
      if (roleFilter !== 'all' && item.role !== roleFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        item.displayName,
        item.email,
        item.phone,
        item.roleLabel,
        item.bio ?? '',
        item.permissionHighlights.join(' '),
      ]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(normalizedQuery);
    });
  }, [deferredQuery, items, roleFilter]);

  const overview = useMemo(() => computeOverview(items), [items]);
  const roleInsights = useMemo(() => toRoleInsights(items), [items]);

  const createStaffAccess = async (values: StaffEditorValues) => {
    if (!salon) {
      throw new Error('Salon bilgisi hazir degil.');
    }

    setMutating(true);
    setError(null);

    try {
      const createdStaff = await createStaffMember(salon.id, {
        role: values.role,
        bio: sanitizeOptionalValue(values.bio),
        employee: {
          name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: sanitizeOptionalValue(values.password),
        },
      });

      let nextStaff = createdStaff;

      if (values.photoFile) {
        try {
          nextStaff = await uploadStaffMemberPhoto(
            salon.id,
            createdStaff.id,
            values.photoFile,
          );
        } catch (uploadError) {
          const uploadMessage =
            uploadError instanceof Error
              ? uploadError.message
              : 'Personel kaydi olusturuldu ancak fotograf yuklenemedi.';
          setError(uploadMessage);
        }
      }

      setStaffRecords((currentItems) => [...currentItems, nextStaff]);
    } catch (mutationError) {
      const nextError =
        mutationError instanceof Error ? mutationError.message : 'Personel yetkisi verilemedi.';
      setError(nextError);
      throw new Error(nextError);
    } finally {
      setMutating(false);
    }
  };

  const updateStaffAccess = async (staffId: string, values: StaffEditorValues) => {
    if (!salon) {
      throw new Error('Salon bilgisi hazir degil.');
    }

    setMutating(true);
    setError(null);

    try {
      const updatedStaff = await updateStaffMember(salon.id, staffId, {
        account: {
          name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: sanitizeOptionalValue(values.password),
        },
        role: values.role,
        bio: values.bio.trim() ? values.bio.trim() : null,
      });

      let nextStaff = updatedStaff;
      setStaffRecords((currentItems) =>
        currentItems.map((item) => (item.id === updatedStaff.id ? updatedStaff : item)),
      );

      try {
        if (values.removePhoto && updatedStaff.photoUrl) {
          nextStaff = await removeStaffMemberPhoto(salon.id, staffId);
        }

        if (values.photoFile) {
          nextStaff = await uploadStaffMemberPhoto(salon.id, staffId, values.photoFile);
        }
      } catch (uploadError) {
        const uploadMessage =
          uploadError instanceof Error
            ? uploadError.message
            : 'Kayit guncellendi ancak fotograf islemi tamamlanamadi.';
        setError(uploadMessage);
        throw new Error(uploadMessage);
      }

      setStaffRecords((currentItems) =>
        currentItems.map((item) => (item.id === nextStaff.id ? nextStaff : item)),
      );
    } catch (mutationError) {
      const nextError =
        mutationError instanceof Error ? mutationError.message : 'Personel kaydi guncellenemedi.';
      setError(nextError);
      throw new Error(nextError);
    } finally {
      setMutating(false);
    }
  };

  const removeStaffAccess = async (staffId: string) => {
    if (!salon) {
      throw new Error('Salon bilgisi hazir degil.');
    }

    setMutating(true);
    setError(null);

    try {
      await deleteStaffMember(salon.id, staffId);
      setStaffRecords((currentItems) => currentItems.filter((item) => item.id !== staffId));
    } catch (mutationError) {
      const nextError =
        mutationError instanceof Error ? mutationError.message : 'Personel kaydi kaldirilamadi.';
      setError(nextError);
      throw new Error(nextError);
    } finally {
      setMutating(false);
    }
  };

  return {
    salon,
    items,
    filteredItems,
    overview,
    roleInsights,
    roleFilter,
    setRoleFilter,
    query,
    setQuery,
    loading,
    error,
    mutating,
    refresh: fetchData,
    createStaffAccess,
    updateStaffAccess,
    removeStaffAccess,
  };
}
