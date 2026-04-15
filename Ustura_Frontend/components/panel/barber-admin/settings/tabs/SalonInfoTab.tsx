import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { hexToRgba } from '@/utils/color';
import type { SalonRecord } from '@/services/salon.service';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import {
  getBarberInputStyle,
  getBarberInputWebStyle,
  getBarberWebTransition,
} from '../presentation';
import type { SalonFormData } from '../types';

interface SalonInfoTabProps {
  salon: SalonRecord;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSave: (data: Partial<SalonFormData>) => Promise<void>;
}

export default function SalonInfoTab({
  salon,
  saving,
  saveSuccess,
  saveError,
  onSave,
}: SalonInfoTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [name, setName] = React.useState(salon.name);
  const [address, setAddress] = React.useState(salon.address);
  const [city, setCity] = React.useState(salon.city);
  const [district, setDistrict] = React.useState(salon.district ?? '');

  React.useEffect(() => {
    setName(salon.name);
    setAddress(salon.address);
    setCity(salon.city);
    setDistrict(salon.district ?? '');
  }, [salon]);

  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();

  const hasChanges =
    name !== salon.name ||
    address !== salon.address ||
    city !== salon.city ||
    (district || '') !== (salon.district || '');

  const handleSave = () => {
    const data: Partial<SalonFormData> = {};
    if (name !== salon.name) data.name = name;
    if (address !== salon.address) data.address = address;
    if (city !== salon.city) data.city = city;
    if ((district || '') !== (salon.district || '')) data.district = district || '';
    void onSave(data);
  };

  return (
    <View className="gap-5">
      <SettingsSection
        title="Salon Kimliği"
        icon="storefront"
        description="Salonunuzun temel bilgilerini düzenleyin.">
        <FormField label="Salon Adı" theme={theme}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Salonunuzun adı"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            style={[inputStyle, webStyle]}
          />
        </FormField>

        <FormField label="Adres" theme={theme}>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Tam adres"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            multiline
            numberOfLines={3}
            style={[inputStyle, webStyle, { minHeight: 72, textAlignVertical: 'top' }]}
          />
        </FormField>

        <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Şehir" theme={theme}>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Şehir"
                placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
                style={[inputStyle, webStyle]}
              />
            </FormField>
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="İlçe" theme={theme}>
              <TextInput
                value={district}
                onChangeText={setDistrict}
                placeholder="İlçe (opsiyonel)"
                placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
                style={[inputStyle, webStyle]}
              />
            </FormField>
          </View>
        </View>
      </SettingsSection>

      <SettingsSection title="Salon Durumu" icon="toggle-on">
        <View className="flex-row items-center gap-3">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: salon.isActive ? theme.success : theme.error }}
          />
          <Text style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold', fontSize: 14 }}>
            {salon.isActive ? 'Salon Aktif' : 'Salon Pasif'}
          </Text>
        </View>
        <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.6), fontSize: 12 }}>
          Salon durumu platform yöneticisi tarafından yönetilmektedir.
        </Text>
      </SettingsSection>

      {(hasChanges || saveError || saveSuccess) && (
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {saveError && (
              <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                {saveError}
              </Text>
            )}
            {saveSuccess && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={16} color={theme.success} />
                <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                  Değişiklikler kaydedildi.
                </Text>
              </View>
            )}
          </View>

          {hasChanges && (
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="flex-row items-center gap-2 rounded-lg px-6 py-3"
              style={({ hovered }) => [
                { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 },
                Platform.OS === 'web' && hovered
                  ? ({ transform: [{ scale: 1.02 }], cursor: 'pointer' } as any)
                  : Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
              ]}>
              {saving ? (
                <ActivityIndicator size="small" color={theme.onPrimary} />
              ) : (
                <MaterialIcons name="save" size={16} color={theme.onPrimary} />
              )}
              <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
                Kaydet
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function FormField({
  label,
  theme,
  children,
}: {
  label: string;
  theme: ReturnType<typeof useBarberAdminTheme>;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.8),
          fontFamily: 'Manrope-Bold',
          fontSize: 12,
          letterSpacing: 0.4,
          textTransform: 'uppercase' as const,
        }}>
        {label}
      </Text>
      {children}
    </View>
  );
}
