import React from 'react';

import type { SalonRecord, WorkingHoursEntry } from '@/services/salon.service';
import {
  getOwnedSalons,
  getOwnedSalonDetail,
  removeOwnedSalonPhoto,
  updateOwnedSalon,
  uploadOwnedSalonPhoto,
} from '@/services/salon.service';

import type { BarberSettingsTab, BarberSettingsTabId, SalonFormData } from './types';

export const BARBER_SETTINGS_TABS: BarberSettingsTab[] = [
  { id: 'salon-info', label: 'Salon Bilgileri', icon: 'storefront' },
  { id: 'storefront', label: 'Vitrin & Medya', icon: 'photo-library' },
  { id: 'working-hours', label: 'Calisma Saatleri', icon: 'schedule' },
  { id: 'notifications', label: 'Bildirimler', icon: 'notifications-none' },
  { id: 'account', label: 'Hesap', icon: 'person-outline' },
];

export interface BarberSettingsState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
  salon: SalonRecord | null;
  activeTab: BarberSettingsTabId;
  setActiveTab: (tab: BarberSettingsTabId) => void;
  refresh: () => void;
  updateSalonInfo: (data: Partial<SalonFormData>) => Promise<void>;
  updatePhotoUrl: (url: string | null) => Promise<void>;
  uploadPhotoFile: (file: File) => Promise<void>;
  removePhoto: () => Promise<void>;
  updateWorkingHours: (hours: Record<string, WorkingHoursEntry | null>) => Promise<void>;
}

export function useBarberSettings(): BarberSettingsState {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [salon, setSalon] = React.useState<SalonRecord | null>(null);
  const [activeTab, setActiveTab] = React.useState<BarberSettingsTabId>('salon-info');

  const fetchSalon = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const salons = await getOwnedSalons();
      if (salons.length === 0) {
        setError('Bu hesaba bagli salon bulunamadi.');
        return;
      }
      const detail = await getOwnedSalonDetail(salons[0].id);
      setSalon(detail);
    } catch (err: any) {
      setError(err?.message ?? 'Salon bilgileri yuklenirken hata olustu.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchSalon();
  }, [fetchSalon]);

  const markSaveSuccess = React.useCallback(() => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, []);

  const runSalonMutation = React.useCallback(
    async (operation: (currentSalon: SalonRecord) => Promise<SalonRecord>) => {
      if (!salon) return;

      try {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        const updated = await operation(salon);
        setSalon(updated);
        markSaveSuccess();
      } catch (err: any) {
        setSaveError(err?.message ?? 'Guncelleme sirasinda hata olustu.');
      } finally {
        setSaving(false);
      }
    },
    [markSaveSuccess, salon],
  );

  const updateSalonInfo = React.useCallback(
    async (data: Partial<SalonFormData>) => {
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, data),
      );
    },
    [runSalonMutation],
  );

  const updatePhotoUrl = React.useCallback(
    async (url: string | null) => {
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, { photoUrl: url }),
      );
    },
    [runSalonMutation],
  );

  const uploadPhotoFile = React.useCallback(
    async (file: File) => {
      await runSalonMutation((currentSalon) =>
        uploadOwnedSalonPhoto(currentSalon.id, file),
      );
    },
    [runSalonMutation],
  );

  const removePhoto = React.useCallback(
    async () => {
      await runSalonMutation((currentSalon) =>
        removeOwnedSalonPhoto(currentSalon.id),
      );
    },
    [runSalonMutation],
  );

  const updateWorkingHours = React.useCallback(
    async (hours: Record<string, WorkingHoursEntry | null>) => {
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, { workingHours: hours }),
      );
    },
    [runSalonMutation],
  );

  return {
    loading,
    saving,
    error,
    saveError,
    saveSuccess,
    salon,
    activeTab,
    setActiveTab,
    refresh: fetchSalon,
    updateSalonInfo,
    updatePhotoUrl,
    uploadPhotoFile,
    removePhoto,
    updateWorkingHours,
  };
}
