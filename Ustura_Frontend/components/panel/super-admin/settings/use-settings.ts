import React from 'react';

import type { PlatformSettings } from '@/services/platform-settings.service';
import { PlatformSettingsService } from '@/services/platform-settings.service';

import type { SettingsTab, SettingsTabId } from './types';

export const SETTINGS_TABS: SettingsTab[] = [
  { id: 'general', label: 'Genel', icon: 'tune' },
  { id: 'security', label: 'Güvenlik', icon: 'shield' },
  { id: 'email', label: 'E-posta', icon: 'mail-outline' },
  { id: 'reservation', label: 'Randevu', icon: 'event-note' },
  { id: 'system', label: 'Sistem', icon: 'dns' },
];

export interface SettingsState {
  loading: boolean;
  error: string | null;
  settings: PlatformSettings | null;
  activeTab: SettingsTabId;
  setActiveTab: (tab: SettingsTabId) => void;
  refresh: () => void;
}

export function useSettings(): SettingsState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<PlatformSettings | null>(null);
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>('general');

  const fetchSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformSettingsService.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err?.message ?? 'Ayarlar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  return {
    loading,
    error,
    settings,
    activeTab,
    setActiveTab,
    refresh: fetchSettings,
  };
}
