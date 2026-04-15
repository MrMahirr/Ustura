import React from 'react';

import { useAuth } from '@/hooks/use-auth';
import type { SalonRecord, WorkingHoursEntry } from '@/services/salon.service';
import {
  getSalonById,
  getOwnedSalons,
  getOwnedSalonDetail,
  removeOwnedSalonGalleryPhoto,
  removeOwnedSalonPhoto,
  updateOwnedSalon,
  uploadOwnedSalonGalleryPhotos,
  uploadOwnedSalonPhoto,
} from '@/services/salon.service';
import {
  createOwnedSalonService,
  deleteOwnedSalonService,
  getSalonServices,
  getOwnedSalonServices,
  type CreateSalonServicePayload,
  type SalonServiceRecord,
  updateOwnedSalonService,
} from '@/services/salon-service.service';
import { getMyStaffAssignments, type StaffRecord } from '@/services/staff.service';

import type { BarberSettingsTab, BarberSettingsTabId, SalonFormData } from './types';

export const BARBER_SETTINGS_TABS: BarberSettingsTab[] = [
  { id: 'salon-info', label: 'Salon Bilgileri', icon: 'storefront' },
  { id: 'storefront', label: 'Vitrin & Medya', icon: 'photo-library' },
  { id: 'services', label: 'Hizmetlerim', icon: 'content-cut' },
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
  isOwnerView: boolean;
  salon: SalonRecord | null;
  services: SalonServiceRecord[];
  activeAssignment: StaffRecord | null;
  availableTabs: BarberSettingsTab[];
  activeTab: BarberSettingsTabId;
  setActiveTab: (tab: BarberSettingsTabId) => void;
  refresh: () => void;
  updateSalonInfo: (data: Partial<SalonFormData>) => Promise<void>;
  updatePhotoUrl: (url: string | null) => Promise<void>;
  uploadPhotoFile: (file: File) => Promise<void>;
  removePhoto: () => Promise<void>;
  uploadGalleryFiles: (files: File[]) => Promise<void>;
  removeGalleryPhoto: (photoUrl: string) => Promise<void>;
  createService: (payload: CreateSalonServicePayload) => Promise<void>;
  updateService: (
    serviceId: string,
    payload: Partial<CreateSalonServicePayload>,
  ) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  updateWorkingHours: (hours: Record<string, WorkingHoursEntry | null>) => Promise<void>;
}

export function useBarberSettings(): BarberSettingsState {
  const { role } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [salon, setSalon] = React.useState<SalonRecord | null>(null);
  const [services, setServices] = React.useState<SalonServiceRecord[]>([]);
  const [activeAssignment, setActiveAssignment] = React.useState<StaffRecord | null>(null);
  const isOwnerView = role === 'owner';
  const [activeTab, setActiveTab] = React.useState<BarberSettingsTabId>(
    isOwnerView ? 'salon-info' : 'account',
  );
  const availableTabs = React.useMemo(
    () =>
      isOwnerView
        ? BARBER_SETTINGS_TABS
        : BARBER_SETTINGS_TABS.filter((tab) =>
            ['notifications', 'account'].includes(tab.id),
          ),
    [isOwnerView],
  );

  React.useEffect(() => {
    if (availableTabs.some((tab) => tab.id === activeTab)) {
      return;
    }

    setActiveTab(availableTabs[0]?.id ?? 'account');
  }, [activeTab, availableTabs]);

  const fetchSalon = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveAssignment(null);

      if (isOwnerView) {
        const salons = await getOwnedSalons();
        if (salons.length === 0) {
          setSalon(null);
          setServices([]);
          setError('Bu hesaba bagli salon bulunamadi.');
          return;
        }

        const [detail, ownedServices] = await Promise.all([
          getOwnedSalonDetail(salons[0].id),
          getOwnedSalonServices(salons[0].id),
        ]);
        setSalon(detail);
        setServices(ownedServices);
        return;
      }

      const assignments = await getMyStaffAssignments();
      const primaryAssignment = assignments[0];

      if (!primaryAssignment) {
        setSalon(null);
        setServices([]);
        setError('Aktif personel atamasi bulunamadi.');
        return;
      }

      const [detail, publicServices] = await Promise.all([
        getSalonById(primaryAssignment.salonId),
        getSalonServices(primaryAssignment.salonId),
      ]);

      setActiveAssignment(primaryAssignment);
      setSalon(detail);
      setServices(publicServices);
    } catch (err: any) {
      setSalon(null);
      setServices([]);
      setError(err?.message ?? 'Salon bilgileri yuklenirken hata olustu.');
    } finally {
      setLoading(false);
    }
  }, [isOwnerView]);

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

  const runServiceMutation = React.useCallback(
    async (
      operation: (
        currentSalon: SalonRecord,
        currentServices: SalonServiceRecord[],
      ) => Promise<SalonServiceRecord[]>,
    ) => {
      if (!salon) return;

      try {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        const nextServices = await operation(salon, services);
        setServices(nextServices);
        markSaveSuccess();
      } catch (err: any) {
        setSaveError(err?.message ?? 'Hizmetler guncellenirken hata olustu.');
      } finally {
        setSaving(false);
      }
    },
    [markSaveSuccess, salon, services],
  );

  const updateSalonInfo = React.useCallback(
    async (data: Partial<SalonFormData>) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, data),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const updatePhotoUrl = React.useCallback(
    async (url: string | null) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, { photoUrl: url }),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const uploadPhotoFile = React.useCallback(
    async (file: File) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        uploadOwnedSalonPhoto(currentSalon.id, file),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const removePhoto = React.useCallback(
    async () => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        removeOwnedSalonPhoto(currentSalon.id),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const uploadGalleryFiles = React.useCallback(
    async (files: File[]) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        uploadOwnedSalonGalleryPhotos(currentSalon.id, files),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const removeGalleryPhoto = React.useCallback(
    async (photoUrl: string) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        removeOwnedSalonGalleryPhoto(currentSalon.id, photoUrl),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  const createService = React.useCallback(
    async (payload: CreateSalonServicePayload) => {
      if (!isOwnerView) return;
      await runServiceMutation(async (currentSalon, currentServices) => {
        const createdService = await createOwnedSalonService(
          currentSalon.id,
          payload,
        );

        return [...currentServices, createdService];
      });
    },
    [isOwnerView, runServiceMutation],
  );

  const updateService = React.useCallback(
    async (
      serviceId: string,
      payload: Partial<CreateSalonServicePayload>,
    ) => {
      if (!isOwnerView) return;
      await runServiceMutation(async (currentSalon, currentServices) => {
        const updatedService = await updateOwnedSalonService(
          currentSalon.id,
          serviceId,
          payload,
        );

        return currentServices.map((service) =>
          service.id === updatedService.id ? updatedService : service,
        );
      });
    },
    [isOwnerView, runServiceMutation],
  );

  const deleteService = React.useCallback(
    async (serviceId: string) => {
      if (!isOwnerView) return;
      await runServiceMutation(async (currentSalon, currentServices) => {
        await deleteOwnedSalonService(currentSalon.id, serviceId);

        return currentServices.filter((service) => service.id !== serviceId);
      });
    },
    [isOwnerView, runServiceMutation],
  );

  const updateWorkingHours = React.useCallback(
    async (hours: Record<string, WorkingHoursEntry | null>) => {
      if (!isOwnerView) return;
      await runSalonMutation((currentSalon) =>
        updateOwnedSalon(currentSalon.id, { workingHours: hours }),
      );
    },
    [isOwnerView, runSalonMutation],
  );

  return {
    loading,
    saving,
    error,
    saveError,
    saveSuccess,
    isOwnerView,
    salon,
    services,
    activeAssignment,
    availableTabs,
    activeTab,
    setActiveTab,
    refresh: fetchSalon,
    updateSalonInfo,
    updatePhotoUrl,
    uploadPhotoFile,
    removePhoto,
    uploadGalleryFiles,
    removeGalleryPhoto,
    createService,
    updateService,
    deleteService,
    updateWorkingHours,
  };
}
