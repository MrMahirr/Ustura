import React from 'react';
import { Switch, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';

interface NotificationPref {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_PREFS: NotificationPref[] = [
  {
    key: 'new_reservation',
    label: 'Yeni Randevu',
    description: 'Müşteri yeni randevu oluşturduğunda bildirim al.',
    enabled: true,
  },
  {
    key: 'cancelled_reservation',
    label: 'İptal Edilen Randevu',
    description: 'Bir randevu iptal edildiğinde bildirim al.',
    enabled: true,
  },
  {
    key: 'subscription_update',
    label: 'Abonelik Güncellemesi',
    description: 'Paket onayı veya değişikliklerinde bildirim al.',
    enabled: true,
  },
  {
    key: 'staff_activity',
    label: 'Personel Etkinliği',
    description: 'Personel giriş/çıkış ve durum değişikliklerinde bildirim al.',
    enabled: false,
  },
  {
    key: 'system_announcement',
    label: 'Sistem Duyuruları',
    description: 'Platform güncellemeleri ve bakım duyuruları.',
    enabled: true,
  },
];

const EMAIL_PREFS: NotificationPref[] = [
  {
    key: 'email_daily_summary',
    label: 'Günlük Özet',
    description: 'Her gün sonunda randevu özetini e-posta olarak al.',
    enabled: false,
  },
  {
    key: 'email_weekly_report',
    label: 'Haftalık Rapor',
    description: 'Haftalık performans raporunu e-posta olarak al.',
    enabled: false,
  },
];

export default function NotificationTab() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [prefs, setPrefs] = React.useState(DEFAULT_PREFS);
  const [emailPrefs, setEmailPrefs] = React.useState(EMAIL_PREFS);

  const togglePref = (key: string) => {
    setPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const toggleEmailPref = (key: string) => {
    setEmailPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  return (
    <View className="gap-5">
      <SettingsSection
        title="Uygulama İçi Bildirimler"
        icon="notifications-active"
        description="Hangi olaylarda uygulama içi bildirim almak istediğinizi seçin.">
        <View className="gap-4">
          {prefs.map((pref) => (
            <NotificationRow
              key={pref.key}
              pref={pref}
              onToggle={() => togglePref(pref.key)}
              theme={theme}
              isMobile={isMobile}
            />
          ))}
        </View>
      </SettingsSection>

      <SettingsSection
        title="E-posta Bildirimleri"
        icon="mail-outline"
        description="E-posta ile almak istediğiniz bildirimleri yönetin.">
        <View className="gap-4">
          {emailPrefs.map((pref) => (
            <NotificationRow
              key={pref.key}
              pref={pref}
              onToggle={() => toggleEmailPref(pref.key)}
              theme={theme}
              isMobile={isMobile}
            />
          ))}
        </View>
      </SettingsSection>

      <View
        className="rounded-lg border p-4"
        style={{
          borderColor: hexToRgba(theme.warning, 0.2),
          backgroundColor: hexToRgba(theme.warning, 0.04),
        }}>
        <Text style={{ color: hexToRgba(theme.onSurface, 0.7), fontSize: 12, lineHeight: 18 }}>
          Bildirim tercihleri şu an yerel olarak saklanmaktadır. Sunucu tarafı entegrasyonu
          yakında eklenecektir.
        </Text>
      </View>
    </View>
  );
}

function NotificationRow({
  pref,
  onToggle,
  theme,
  isMobile,
}: {
  pref: NotificationPref;
  onToggle: () => void;
  theme: ReturnType<typeof useBarberAdminTheme>;
  isMobile: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 8 : 12,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.06),
      }}>
      <View className="flex-1 gap-1">
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-Bold',
            fontSize: 13,
          }}>
          {pref.label}
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.55),
            fontSize: 12,
          }}>
          {pref.description}
        </Text>
      </View>
      <Switch
        value={pref.enabled}
        onValueChange={onToggle}
        trackColor={{
          false: hexToRgba(theme.onSurfaceVariant, 0.15),
          true: hexToRgba(theme.primary, 0.4),
        }}
        thumbColor={pref.enabled ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.4)}
      />
    </View>
  );
}
