import React from 'react';
import { View } from 'react-native';

import type { PlatformIntegrationSettings } from '@/services/platform-settings.service';

import ConfigCard from '../ConfigCard';
import type { ConfigGroup } from '../types';

interface SystemTabProps {
  settings: PlatformIntegrationSettings;
}

function buildGroups(s: PlatformIntegrationSettings): ConfigGroup[] {
  return [
    {
      title: 'Veritabanı (PostgreSQL)',
      icon: 'storage',
      items: [
        { label: 'Host', value: s.databaseHost || 'Ayarlanmadı', status: s.databaseHost ? 'configured' : 'missing' },
        { label: 'Port', value: s.databasePort ? String(s.databasePort) : 'Ayarlanmadı', status: s.databasePort ? 'configured' : 'missing' },
        { label: 'Veritabanı Adı', value: s.databaseName || 'Ayarlanmadı', status: s.databaseName ? 'configured' : 'missing' },
      ],
    },
    {
      title: 'Redis',
      icon: 'memory',
      items: [
        { label: 'Host', value: s.redisHost || 'Ayarlanmadı', status: s.redisHost ? 'configured' : 'missing' },
        { label: 'Port', value: s.redisPort ? String(s.redisPort) : 'Ayarlanmadı', status: s.redisPort ? 'configured' : 'missing' },
        { label: 'Fallback', value: 'Bellek İçi Fallback Aktif', status: 'info' },
      ],
    },
    {
      title: 'Kimlik Doğrulama Entegrasyonları',
      icon: 'fingerprint',
      items: [
        {
          label: 'Firebase Project ID',
          value: s.firebaseProjectId || 'Ayarlanmadı',
          status: s.firebaseProjectId ? 'configured' : 'missing',
          masked: !!s.firebaseProjectId,
        },
        {
          label: 'Google Web Client ID',
          value: s.googleWebClientId || 'Ayarlanmadı',
          status: s.googleWebClientId ? 'configured' : 'missing',
          masked: !!s.googleWebClientId,
        },
      ],
    },
    {
      title: 'Sistem Modülleri',
      icon: 'extension',
      items: [
        { label: 'Auth Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Audit Log Modülü', value: 'Aktif', status: 'configured' },
        { label: 'E-posta Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Bildirim Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Paket Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Randevu Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Raporlama Modülü', value: 'Aktif', status: 'configured' },
        { label: 'Sağlık Kontrolü', value: 'Aktif', status: 'configured' },
      ],
    },
  ];
}

export default function SystemTab({ settings }: SystemTabProps) {
  const groups = React.useMemo(() => buildGroups(settings), [settings]);

  return (
    <View className="gap-5">
      {groups.map((group) => (
        <ConfigCard key={group.title} group={group} />
      ))}
    </View>
  );
}
