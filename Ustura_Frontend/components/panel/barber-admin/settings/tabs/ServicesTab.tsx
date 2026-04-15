import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import type {
  CreateSalonServicePayload,
  SalonServiceRecord,
} from '@/services/salon-service.service';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import { getBarberInputStyle, getBarberInputWebStyle } from '../presentation';
import ServiceComposer from './ServiceComposer';
import ServiceItemCard from './ServiceItemCard';
import ServicesSummaryRow from './ServicesSummaryRow';

interface ServicesTabProps {
  services: SalonServiceRecord[];
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onCreate: (payload: CreateSalonServicePayload) => Promise<void>;
  onUpdate: (
    serviceId: string,
    payload: Partial<CreateSalonServicePayload>,
  ) => Promise<void>;
  onDelete: (serviceId: string) => Promise<void>;
}

export default function ServicesTab({
  services,
  saving,
  saveSuccess,
  saveError,
  onCreate,
  onUpdate,
  onDelete,
}: ServicesTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;
  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();

  return (
    <View className="gap-5">
      <ServicesSummaryRow services={services} isMobile={isMobile} />

      <SettingsSection
        title="Hizmetlerim"
        icon="content-cut"
        description="Salon menunu yonetin, aktif hizmetleri acik tutun ve gerektiginde kaldirin.">
        <ServiceComposer
          disabled={saving}
          errorText={saveError}
          inputStyle={inputStyle}
          webStyle={webStyle}
          onCreate={onCreate}
        />
      </SettingsSection>

      <SettingsSection
        title="Kayitli Hizmetler"
        icon="tune"
        description="Mevcut hizmetleri satir bazinda duzenleyin, pasife alin veya tamamen kaldirin.">
        {services.length === 0 ? (
          <View
            className="rounded-[24px] border px-5 py-8"
            style={{
              backgroundColor: theme.panelBackground,
              borderColor: theme.borderSubtle,
            }}>
            <Text
              className="font-headline text-[22px] font-bold"
              style={{ color: theme.onSurface }}>
              Henuz hizmet eklenmedi
            </Text>
            <Text
              className="mt-3 text-sm leading-6"
              style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
              Ustteki form ile salonun sundugu ilk hizmeti ekleyebilirsin.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {services.map((service) => (
              <ServiceItemCard
                key={service.id}
                service={service}
                disabled={saving}
                inputStyle={inputStyle}
                webStyle={webStyle}
                onSave={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </View>
        )}

        {saveSuccess && (
          <Text
            className="mt-3 text-xs"
            style={{ color: theme.success, fontFamily: 'Manrope-Bold' }}>
            Hizmet listesi guncellendi.
          </Text>
        )}
      </SettingsSection>
    </View>
  );
}
