import React from 'react';
import { View } from 'react-native';

import type { PlatformSecuritySettings } from '@/services/platform-settings.service';

import ConfigCard from '../ConfigCard';
import type { ConfigGroup } from '../types';

interface SecurityTabProps {
  settings: PlatformSecuritySettings;
}

function buildGroups(s: PlatformSecuritySettings): ConfigGroup[] {
  return [
    {
      title: 'JWT Yapılandırması',
      icon: 'vpn-key',
      items: [
        { label: 'Access Token Süresi', value: s.jwtAccessExpiration, status: 'configured' },
        { label: 'Refresh Token Süresi', value: s.jwtRefreshExpiration, status: 'configured' },
      ],
    },
    {
      title: 'İstek Sınırlama',
      icon: 'speed',
      items: [
        { label: 'Zaman Penceresi', value: `${s.rateLimitTtl} saniye`, status: 'info' },
        { label: 'Maks. İstek Sayısı', value: `${s.rateLimitMax} istek / dakika`, status: 'info' },
      ],
    },
    {
      title: 'Güvenlik Politikaları',
      icon: 'security',
      items: [
        { label: 'Helmet Koruması', value: 'Aktif', status: 'configured' },
        { label: 'CSRF Koruması', value: 'CORS tabanlı', status: 'info' },
        { label: 'Giriş Doğrulama', value: 'Whitelist + Transform', status: 'configured' },
        { label: 'Şifre Değişikliği Zorunluluğu', value: 'Aktif (must_change_password)', status: 'configured' },
      ],
    },
  ];
}

export default function SecurityTab({ settings }: SecurityTabProps) {
  const groups = React.useMemo(() => buildGroups(settings), [settings]);

  return (
    <View className="gap-5">
      {groups.map((group) => (
        <ConfigCard key={group.title} group={group} />
      ))}
    </View>
  );
}
