import React from 'react';

import type {
  AdminSalonDetailRecord,
  AdminSalonUpdatePayload,
} from '@/services/salon.service';
import {
  deleteAdminSalon,
  getAdminSalonById,
  patchAdminSalon,
} from '@/services/salon.service';

export type SalonProfileLoadStatus = 'idle' | 'loading' | 'error' | 'ready';

export type SalonProfileMutationResult =
  | { ok: true }
  | { ok: false; message: string };

export function useSalonProfile(salonId?: string) {
  const [detail, setDetail] = React.useState<AdminSalonDetailRecord | null>(null);
  const [status, setStatus] = React.useState<SalonProfileLoadStatus>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!salonId) {
      setDetail(null);
      setStatus('idle');
      setErrorMessage(null);
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const data = await getAdminSalonById(salonId);
      setDetail(data);
      setStatus('ready');
    } catch (err) {
      setDetail(null);
      setErrorMessage(
        err instanceof Error ? err.message : 'Salon bilgileri yuklenemedi.',
      );
      setStatus('error');
    }
  }, [salonId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const updateSalon = React.useCallback(
    async (body: AdminSalonUpdatePayload): Promise<SalonProfileMutationResult> => {
      if (!salonId) {
        return { ok: false, message: 'Salon secili degil.' };
      }

      setIsSaving(true);
      try {
        await patchAdminSalon(salonId, body);
        const fresh = await getAdminSalonById(salonId);
        setDetail(fresh);
        return { ok: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Salon guncellenemedi.';
        return { ok: false, message };
      } finally {
        setIsSaving(false);
      }
    },
    [salonId],
  );

  const removeSalon = React.useCallback(async (): Promise<SalonProfileMutationResult> => {
    if (!salonId) {
      return { ok: false, message: 'Salon secili degil.' };
    }

    setIsDeleting(true);
    try {
      await deleteAdminSalon(salonId);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Salon silinemedi.';
      return { ok: false, message };
    } finally {
      setIsDeleting(false);
    }
  }, [salonId]);

  return {
    detail,
    status,
    errorMessage,
    reload: load,
    updateSalon,
    removeSalon,
    isSaving,
    isDeleting,
  };
}
