import React from 'react';
import { View } from 'react-native';

import type { PlatformEmailSettings } from '@/services/platform-settings.service';

import ConfigCard from '../ConfigCard';
import type { ConfigGroup } from '../types';

interface EmailTabProps {
  settings: PlatformEmailSettings;
}

function buildGroups(s: PlatformEmailSettings): ConfigGroup[] {
  return [
    {
      title: 'EmailJS Yapılandırması',
      icon: 'email',
      items: [
        {
          label: 'Servis ID',
          value: s.serviceId || 'Ayarlanmadı',
          status: s.serviceId ? 'configured' : 'missing',
          masked: !!s.serviceId,
        },
        {
          label: 'Public Key',
          value: s.hasPublicKey ? 'Yapılandırıldı' : 'Ayarlanmadı',
          status: s.hasPublicKey ? 'configured' : 'missing',
        },
        {
          label: 'Private Key',
          value: s.hasPrivateKey ? 'Yapılandırıldı' : 'Ayarlanmadı',
          status: s.hasPrivateKey ? 'configured' : 'missing',
        },
      ],
    },
    {
      title: 'E-posta Şablonları',
      icon: 'description',
      items: [
        {
          label: 'Salon Onay Şablonu',
          value: s.templateApproval || 'Ayarlanmadı',
          status: s.templateApproval ? 'configured' : 'missing',
        },
        {
          label: 'Personel Hoşgeldin Şablonu',
          value: s.templateStaffWelcome || 'Ayarlanmadı',
          status: s.templateStaffWelcome ? 'configured' : 'missing',
        },
      ],
    },
    {
      title: 'Bildirim Kanalları',
      icon: 'notifications-active',
      items: [
        { label: 'Uygulama İçi Bildirimler', value: 'Aktif', status: 'configured' },
        { label: 'E-posta Bildirimleri', value: s.hasPublicKey ? 'Aktif' : 'Pasif', status: s.hasPublicKey ? 'configured' : 'missing' },
        { label: 'SMS Bildirimleri', value: 'Henüz Entegre Edilmedi', status: 'info' },
      ],
    },
  ];
}

export default function EmailTab({ settings }: EmailTabProps) {
  const groups = React.useMemo(() => buildGroups(settings), [settings]);

  return (
    <View className="gap-5">
      {groups.map((group) => (
        <ConfigCard key={group.title} group={group} />
      ))}
    </View>
  );
}
