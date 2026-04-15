import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  CreateSalonServicePayload,
  SalonServiceRecord,
} from '@/services/salon-service.service';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';

interface ServiceItemCardProps {
  service: SalonServiceRecord;
  disabled: boolean;
  inputStyle: any;
  webStyle: any;
  onSave: (
    serviceId: string,
    payload: Partial<CreateSalonServicePayload>,
  ) => Promise<void>;
  onDelete: (serviceId: string) => Promise<void>;
}

interface ServiceDraft {
  name: string;
  description: string;
  durationMinutes: number;
  priceAmount: number;
  isActive: boolean;
}

function createDraft(service: SalonServiceRecord): ServiceDraft {
  return {
    name: service.name,
    description: service.description ?? '',
    durationMinutes: service.durationMinutes,
    priceAmount: service.priceAmount,
    isActive: service.isActive,
  };
}

function hasChanges(service: SalonServiceRecord, draft: ServiceDraft) {
  return (
    service.name !== draft.name ||
    (service.description ?? '') !== draft.description ||
    service.durationMinutes !== draft.durationMinutes ||
    service.priceAmount !== draft.priceAmount ||
    service.isActive !== draft.isActive
  );
}

export default function ServiceItemCard({
  service,
  disabled,
  inputStyle,
  webStyle,
  onSave,
  onDelete,
}: ServiceItemCardProps) {
  const theme = useBarberAdminTheme();
  const [draft, setDraft] = React.useState<ServiceDraft>(() => createDraft(service));

  React.useEffect(() => {
    setDraft(createDraft(service));
  }, [service]);

  const dirty = hasChanges(service, draft);

  const handleSave = React.useCallback(() => {
    void onSave(service.id, {
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      durationMinutes: draft.durationMinutes,
      priceAmount: draft.priceAmount,
      isActive: draft.isActive,
    });
  }, [draft, onSave, service.id]);

  return (
    <View
      className="rounded-[26px] border p-5"
      style={{
        backgroundColor: theme.panelBackground,
        borderColor: service.isActive
          ? hexToRgba(theme.primary, 0.18)
          : theme.borderSubtle,
      }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text
            className="font-headline text-[22px] font-bold"
            style={{ color: theme.onSurface }}>
            {service.name}
          </Text>
          <Text
            className="mt-2 text-sm leading-6"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
            Kayit tarihi: {new Date(service.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Switch
            value={draft.isActive}
            onValueChange={(value) => {
              setDraft((previous) => ({ ...previous, isActive: value }));
            }}
            trackColor={{
              false: hexToRgba(theme.onSurfaceVariant, 0.16),
              true: hexToRgba(theme.primary, 0.42),
            }}
            thumbColor={draft.isActive ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.42)}
          />
          <Text
            style={{
              color: draft.isActive ? theme.onSurface : theme.onSurfaceVariant,
              fontFamily: 'Manrope-Bold',
              fontSize: 12,
            }}>
            {draft.isActive ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>

      <View className="mt-5 gap-3">
        <TextInput
          value={draft.name}
          onChangeText={(text) => {
            setDraft((previous) => ({ ...previous, name: text }));
          }}
          placeholder="Hizmet adi"
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
          style={[inputStyle, webStyle]}
        />

        <TextInput
          value={draft.description}
          onChangeText={(text) => {
            setDraft((previous) => ({ ...previous, description: text }));
          }}
          placeholder="Hizmet aciklamasi"
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
          multiline
          style={[
            inputStyle,
            webStyle,
            {
              minHeight: 84,
              textAlignVertical: 'top',
            },
          ]}
        />

        <View className="flex-row gap-3">
          <TextInput
            value={String(draft.durationMinutes)}
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text.replace(/\D/g, ''), 10);
              setDraft((previous) => ({
                ...previous,
                durationMinutes: Number.isNaN(parsedValue) ? 0 : parsedValue,
              }));
            }}
            keyboardType="number-pad"
            placeholder="Sure (dk)"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            style={[inputStyle, webStyle, { flex: 1 }]}
          />

          <TextInput
            value={String(draft.priceAmount)}
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text.replace(/\D/g, ''), 10);
              setDraft((previous) => ({
                ...previous,
                priceAmount: Number.isNaN(parsedValue) ? 0 : parsedValue,
              }));
            }}
            keyboardType="number-pad"
            placeholder="Fiyat (TL)"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            style={[inputStyle, webStyle, { flex: 1 }]}
          />
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between gap-3">
        <Text
          className="flex-1 text-sm"
          style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
          Public vitrin ve ileride rezervasyon akisi bu hizmet kaydini kullanabilir.
        </Text>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => {
              void onDelete(service.id);
            }}
            disabled={disabled}
            className="flex-row items-center gap-2 rounded-lg border px-4 py-3"
            style={{
              borderColor: hexToRgba(theme.error, 0.24),
              opacity: disabled ? 0.6 : 1,
            }}>
            <MaterialIcons name="delete-outline" size={16} color={theme.error} />
            <Text style={{ color: theme.error, fontFamily: 'Manrope-Bold', fontSize: 12 }}>
              Kaldir
            </Text>
          </Pressable>

          {dirty && (
            <Pressable
              onPress={handleSave}
              disabled={disabled}
              className="flex-row items-center gap-2 rounded-lg px-4 py-3"
              style={{ backgroundColor: theme.primary, opacity: disabled ? 0.6 : 1 }}>
              {disabled ? (
                <ActivityIndicator size="small" color={theme.onPrimary} />
              ) : (
                <MaterialIcons name="save" size={16} color={theme.onPrimary} />
              )}
              <Text
                style={{
                  color: theme.onPrimary,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 12,
                }}>
                Guncelle
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
