import React, { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import {
  SALON_PROFILE_COPY,
  salonProfileClassNames,
} from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import type { AdminSalonUpdatePayload } from '@/services/salon.service';
import type { AdminSalonDetailRecord } from '@/services/salon.service';
import { hexToRgba } from '@/utils/color';

import type { SalonProfileMutationResult } from './use-salon-profile';

interface SalonProfileEditSectionProps {
  detail: AdminSalonDetailRecord;
  onSave: (body: AdminSalonUpdatePayload) => Promise<SalonProfileMutationResult>;
  isSaving: boolean;
}

function buildFormState(d: AdminSalonDetailRecord) {
  return {
    name: d.name,
    address: d.address,
    city: d.city,
    district: d.district ?? '',
    photoUrl: d.photoUrl ?? '',
    isActive: d.isActive,
  };
}

export default function SalonProfileEditSection({
  detail,
  onSave,
  isSaving,
}: SalonProfileEditSectionProps) {
  const adminTheme = useSuperAdminTheme();
  const [form, setForm] = useState(() => buildFormState(detail));
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildFormState(detail));
    setLocalError(null);
  }, [detail.id, detail.updatedAt]);

  const submit = async () => {
    if (!form.name.trim() || !form.address.trim() || !form.city.trim()) {
      setLocalError('Salon adi, adres ve sehir zorunludur.');
      return;
    }

    setLocalError(null);
    const body: AdminSalonUpdatePayload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      district: form.district.trim() || undefined,
      photoUrl: form.photoUrl.trim() ? form.photoUrl.trim() : null,
      isActive: form.isActive,
    };

    const result = await onSave(body);
    if (!result.ok) {
      setLocalError(result.message);
    }
  };

  return (
    <View
      className={salonProfileClassNames.glassCard}
      style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <Text className={salonProfileClassNames.cardEyebrow} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
        {SALON_PROFILE_COPY.editSectionTitle}
      </Text>
      <Text className="mb-5 text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
        {SALON_PROFILE_COPY.editSectionHint}
      </Text>

      <View className="gap-4">
        <Input label={SALON_PROFILE_COPY.fieldName} value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} />
        <Input
          label={SALON_PROFILE_COPY.fieldAddress}
          value={form.address}
          onChangeText={(t) => setForm((f) => ({ ...f, address: t }))}
          multiline
        />
        <Input label={SALON_PROFILE_COPY.fieldCity} value={form.city} onChangeText={(t) => setForm((f) => ({ ...f, city: t }))} />
        <Input
          label={SALON_PROFILE_COPY.fieldDistrict}
          value={form.district}
          onChangeText={(t) => setForm((f) => ({ ...f, district: t }))}
        />
        <Input
          label={SALON_PROFILE_COPY.fieldPhotoUrl}
          value={form.photoUrl}
          onChangeText={(t) => setForm((f) => ({ ...f, photoUrl: t }))}
          autoCapitalize="none"
        />

        <View className="flex-row items-center justify-between gap-3 py-1">
          <Text className="max-w-[85%] flex-1 text-sm" style={{ color: adminTheme.onSurface }}>
            {SALON_PROFILE_COPY.fieldActive}
          </Text>
          <Switch
            value={form.isActive}
            onValueChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            disabled={isSaving}
            trackColor={{ false: adminTheme.outlineVariant, true: hexToRgba(adminTheme.primary, 0.45) }}
            thumbColor={form.isActive ? adminTheme.primary : adminTheme.surfaceContainerHighest}
          />
        </View>

        {localError ? (
          <Text className="text-sm" style={{ color: adminTheme.error }}>
            {localError}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void submit()}
          disabled={isSaving}
          className="items-center rounded-lg py-3.5"
          style={{
            backgroundColor: adminTheme.primary,
            opacity: isSaving ? 0.65 : 1,
          }}>
          <Text className="font-label text-sm font-bold" style={{ color: adminTheme.onPrimary }}>
            {isSaving ? SALON_PROFILE_COPY.saving : SALON_PROFILE_COPY.save}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
