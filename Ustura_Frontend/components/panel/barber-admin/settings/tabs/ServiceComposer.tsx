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

import type { CreateSalonServicePayload } from '@/services/salon-service.service';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';

interface ServiceComposerProps {
  disabled: boolean;
  errorText: string | null;
  inputStyle: any;
  webStyle: any;
  onCreate: (payload: CreateSalonServicePayload) => Promise<void>;
}

const EMPTY_FORM: CreateSalonServicePayload = {
  name: '',
  description: '',
  durationMinutes: 45,
  priceAmount: 0,
  isActive: true,
};

export default function ServiceComposer({
  disabled,
  errorText,
  inputStyle,
  webStyle,
  onCreate,
}: ServiceComposerProps) {
  const theme = useBarberAdminTheme();
  const [form, setForm] = React.useState<CreateSalonServicePayload>(EMPTY_FORM);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleCreate = React.useCallback(() => {
    const name = form.name.trim();
    const description = form.description?.trim() ?? '';

    if (!name) {
      setLocalError('Hizmet adi bos olamaz.');
      return;
    }

    if (!Number.isInteger(form.durationMinutes) || form.durationMinutes < 5) {
      setLocalError('Sure en az 5 dakika olmali.');
      return;
    }

    if (!Number.isInteger(form.priceAmount) || form.priceAmount < 0) {
      setLocalError('Fiyat 0 veya daha buyuk olmali.');
      return;
    }

    setLocalError(null);
    void onCreate({
      name,
      description: description || null,
      durationMinutes: form.durationMinutes,
      priceAmount: form.priceAmount,
      isActive: form.isActive,
    });
  }, [form, onCreate]);

  return (
    <View
      className="rounded-[26px] border p-5"
      style={{
        backgroundColor: theme.panelBackground,
        borderColor: theme.borderSubtle,
      }}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text
            className="font-headline text-[24px] font-bold"
            style={{ color: theme.onSurface }}>
            Yeni hizmet ekle
          </Text>
          <Text
            className="mt-2 text-sm leading-6"
            style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72) }}>
            Ad, sure, fiyat ve aktiflik durumuyla salon menunu buradan olustur.
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Switch
            value={Boolean(form.isActive)}
            onValueChange={(value) => {
              setForm((previous) => ({ ...previous, isActive: value }));
            }}
            trackColor={{
              false: hexToRgba(theme.onSurfaceVariant, 0.16),
              true: hexToRgba(theme.primary, 0.42),
            }}
            thumbColor={form.isActive ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.42)}
          />
          <Text
            style={{
              color: form.isActive ? theme.onSurface : theme.onSurfaceVariant,
              fontFamily: 'Manrope-Bold',
              fontSize: 12,
            }}>
            {form.isActive ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>

      <View className="mt-5 gap-3">
        <TextInput
          value={form.name}
          onChangeText={(text) => {
            setForm((previous) => ({ ...previous, name: text }));
            setLocalError(null);
          }}
          placeholder="Ornek: Premium sakal tasarimi"
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
          style={[inputStyle, webStyle]}
        />

        <TextInput
          value={form.description ?? ''}
          onChangeText={(text) => {
            setForm((previous) => ({ ...previous, description: text }));
          }}
          placeholder="Hizmet aciklamasi"
          placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
          multiline
          style={[
            inputStyle,
            webStyle,
            {
              minHeight: 88,
              textAlignVertical: 'top',
            },
          ]}
        />

        <View className="flex-row gap-3">
          <TextInput
            value={String(form.durationMinutes)}
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text.replace(/\D/g, ''), 10);
              setForm((previous) => ({
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
            value={String(form.priceAmount)}
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text.replace(/\D/g, ''), 10);
              setForm((previous) => ({
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

      {(localError || errorText) && (
        <Text
          className="mt-4 text-xs"
          style={{ color: theme.error, fontFamily: 'Manrope-Bold' }}>
          {localError ?? errorText}
        </Text>
      )}

      <Pressable
        onPress={handleCreate}
        disabled={disabled}
        className="mt-5 flex-row items-center justify-center gap-2 rounded-xl px-5 py-3"
        style={{ backgroundColor: theme.primary, opacity: disabled ? 0.6 : 1 }}>
        {disabled ? (
          <ActivityIndicator size="small" color={theme.onPrimary} />
        ) : (
          <MaterialIcons name="add" size={18} color={theme.onPrimary} />
        )}
        <Text
          style={{
            color: theme.onPrimary,
            fontFamily: 'Manrope-Bold',
            fontSize: 13,
          }}>
          Hizmeti ekle
        </Text>
      </Pressable>
    </View>
  );
}
