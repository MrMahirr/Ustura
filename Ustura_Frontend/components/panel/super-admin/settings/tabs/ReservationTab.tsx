import React from 'react';
import { View } from 'react-native';

import type { PlatformReservationSettings } from '@/services/platform-settings.service';

import ConfigCard from '../ConfigCard';
import type { ConfigGroup } from '../types';

interface ReservationTabProps {
  settings: PlatformReservationSettings;
}

function buildGroups(s: PlatformReservationSettings): ConfigGroup[] {
  return [
    {
      title: 'Randevu Slot Ayarları',
      icon: 'schedule',
      items: [
        { label: 'Slot Süresi', value: `${s.slotDurationMinutes} dakika`, status: 'configured' },
        { label: 'Slot Seçim Zaman Aşımı', value: `${s.slotSelectionTtlSeconds} saniye`, status: 'info' },
        { label: 'Slot Kilit Süresi', value: `${s.slotLockTtlSeconds} saniye`, status: 'info' },
      ],
    },
    {
      title: 'Zaman Dilimi',
      icon: 'public',
      items: [
        { label: 'İş Zaman Dilimi', value: s.businessTimeZone, status: 'configured' },
        { label: 'UTC Offset', value: s.businessUtcOffset, status: 'info' },
      ],
    },
    {
      title: 'Randevu Kuralları',
      icon: 'rule',
      items: [
        { label: 'Çakışma Kontrolü', value: 'Aktif (Unique Constraint)', status: 'configured' },
        { label: 'İptal Politikası', value: 'Serbest İptal', status: 'info' },
        { label: 'Durum Yaşam Döngüsü', value: 'pending → confirmed → completed / cancelled', status: 'configured' },
      ],
    },
  ];
}

export default function ReservationTab({ settings }: ReservationTabProps) {
  const groups = React.useMemo(() => buildGroups(settings), [settings]);

  return (
    <View className="gap-5">
      {groups.map((group) => (
        <ConfigCard key={group.title} group={group} />
      ))}
    </View>
  );
}
