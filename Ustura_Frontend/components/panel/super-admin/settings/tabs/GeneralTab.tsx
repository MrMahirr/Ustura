import React from 'react';
import { View } from 'react-native';

import type { PlatformGeneralSettings } from '@/services/platform-settings.service';

import ConfigCard from '../ConfigCard';
import type { ConfigGroup } from '../types';

interface GeneralTabProps {
  settings: PlatformGeneralSettings;
}

function buildGroups(s: PlatformGeneralSettings): ConfigGroup[] {
  return [
    {
      title: 'Platform Bilgileri',
      icon: 'business',
      items: [
        { label: 'Platform Adı', value: s.platformName, status: 'configured' },
        { label: 'Ortam', value: s.nodeEnv.toUpperCase(), status: s.nodeEnv === 'production' ? 'configured' : 'info' },
        { label: 'API Prefiksi', value: s.apiPrefix || '/', status: 'configured' },
        { label: 'Port', value: String(s.port), status: 'configured' },
      ],
    },
    {
      title: 'Frontend & CORS',
      icon: 'language',
      items: [
        { label: 'Frontend URL', value: s.frontendUrl || 'Ayarlanmadı', status: s.frontendUrl ? 'configured' : 'missing' },
        { label: 'CORS Kaynakları', value: s.corsOrigins?.join(', ') || 'Tüm kaynaklar', status: 'configured' },
        { label: 'CORS Kimlik Bilgileri', value: s.corsCredentials ? 'Aktif' : 'Pasif', status: 'info' },
      ],
    },
  ];
}

export default function GeneralTab({ settings }: GeneralTabProps) {
  const groups = React.useMemo(() => buildGroups(settings), [settings]);

  return (
    <View className="gap-5">
      {groups.map((group) => (
        <ConfigCard key={group.title} group={group} />
      ))}
    </View>
  );
}
