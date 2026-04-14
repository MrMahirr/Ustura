import React, { useLayoutEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type {
  OwnerApplicationRecord,
  UpdateOwnerApplicationInput,
} from '@/services/platform-admin.service';
import { hexToRgba } from '@/utils/color';

import { SALON_REQUEST_COPY } from './presentation';
import type { SaveOwnerApplicationResult } from './types';

interface SalonRequestEditInfoModalProps {
  visible: boolean;
  application: OwnerApplicationRecord | null;
  onClose: () => void;
  onSave: (payload: UpdateOwnerApplicationInput) => Promise<SaveOwnerApplicationResult>;
  isSubmitting?: boolean;
}

function buildInitialState(app: OwnerApplicationRecord): UpdateOwnerApplicationInput {
  return {
    applicantName: app.applicantName,
    applicantEmail: app.applicantEmail,
    applicantPhone: app.applicantPhone,
    salonName: app.salonName,
    salonAddress: app.salonAddress,
    salonCity: app.salonCity,
    salonDistrict: app.salonDistrict ?? undefined,
    notes: app.notes ?? undefined,
  };
}

function validatePayload(values: UpdateOwnerApplicationInput): string | null {
  if (!values.applicantName.trim()) {
    return 'Yetkili adi zorunludur.';
  }
  if (!values.applicantEmail.trim()) {
    return 'E-posta zorunludur.';
  }
  if (!values.applicantPhone.trim()) {
    return 'Telefon zorunludur.';
  }
  if (!values.salonName.trim()) {
    return 'Salon adi zorunludur.';
  }
  if (!values.salonAddress.trim()) {
    return 'Adres zorunludur.';
  }
  if (!values.salonCity.trim()) {
    return 'Sehir zorunludur.';
  }
  return null;
}

export default function SalonRequestEditInfoModal({
  visible,
  application,
  onClose,
  onSave,
  isSubmitting = false,
}: SalonRequestEditInfoModalProps) {
  const adminTheme = useSuperAdminTheme();
  const [values, setValues] = useState<UpdateOwnerApplicationInput | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (visible && application) {
      setValues(buildInitialState(application));
      setLocalError(null);
    } else if (!visible) {
      setValues(null);
    }
  }, [visible, application]);

  const handleSave = async () => {
    if (!values) {
      return;
    }

    const validationError = validatePayload(values);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    const result = await onSave(values);
    if (result.ok) {
      onClose();
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <Modal visible={visible && !!application} onClose={onClose}>
      <View
        className="flex-row items-center justify-between border-b px-6 py-5"
        style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <Text
          className="pr-8 font-headline text-xl"
          style={{ color: adminTheme.onSurface }}>
          {SALON_REQUEST_COPY.editInfoModalTitle}
        </Text>
        <Pressable
          onPress={onClose}
          disabled={isSubmitting}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={({ hovered }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurfaceVariant, 0.1)
                : 'transparent',
              opacity: isSubmitting ? 0.5 : 1,
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 150ms ease' } as object)
              : null,
          ]}>
          <MaterialIcons name="close" size={22} color={adminTheme.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        className="max-h-[70vh]"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {!values ? (
          <View className="px-6 py-8">
            <Text style={{ color: adminTheme.onSurfaceVariant }}>{SALON_REQUEST_COPY.loading}</Text>
          </View>
        ) : (
        <View className="gap-4 px-6 py-5">
          <Text
            className="font-label text-[10px] font-bold uppercase tracking-widest"
            style={{ color: adminTheme.primary }}>
            {SALON_REQUEST_COPY.ownerInfoTitle}
          </Text>
          <Input
            label={SALON_REQUEST_COPY.ownerName}
            value={values.applicantName}
            onChangeText={(text) => setValues((v) => (v ? { ...v, applicantName: text } : v))}
          />
          <Input
            label={SALON_REQUEST_COPY.ownerEmail}
            value={values.applicantEmail}
            onChangeText={(text) => setValues((v) => (v ? { ...v, applicantEmail: text } : v))}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label={SALON_REQUEST_COPY.ownerPhone}
            value={values.applicantPhone}
            onChangeText={(text) => setValues((v) => (v ? { ...v, applicantPhone: text } : v))}
            keyboardType="phone-pad"
          />

          <Text
            className="mt-2 font-label text-[10px] font-bold uppercase tracking-widest"
            style={{ color: adminTheme.primary }}>
            {SALON_REQUEST_COPY.editInfoSalonSection}
          </Text>
          <Input
            label={SALON_REQUEST_COPY.colSalon}
            value={values.salonName}
            onChangeText={(text) => setValues((v) => (v ? { ...v, salonName: text } : v))}
          />
          <Input
            label={SALON_REQUEST_COPY.salonAddress}
            value={values.salonAddress}
            onChangeText={(text) => setValues((v) => (v ? { ...v, salonAddress: text } : v))}
            multiline
          />
          <Input
            label={SALON_REQUEST_COPY.colCity}
            value={values.salonCity}
            onChangeText={(text) => setValues((v) => (v ? { ...v, salonCity: text } : v))}
          />
          <Input
            label={SALON_REQUEST_COPY.districtLabel}
            value={values.salonDistrict ?? ''}
            onChangeText={(text) =>
              setValues((v) => (v ? { ...v, salonDistrict: text || undefined } : v))
            }
          />
          <Input
            label={SALON_REQUEST_COPY.applicationNotes}
            value={values.notes ?? ''}
            onChangeText={(text) =>
              setValues((v) => (v ? { ...v, notes: text || undefined } : v))
            }
            multiline
          />

          {localError ? (
            <Text className="text-sm" style={{ color: adminTheme.error }}>
              {localError}
            </Text>
          ) : null}
        </View>
        )}
      </ScrollView>

      <View
        className="flex-row justify-end gap-3 border-t px-6 py-4"
        style={{ borderTopColor: adminTheme.borderSubtle }}>
        <Pressable
          onPress={onClose}
          disabled={isSubmitting}
          className="rounded-md px-5 py-3"
          style={{ opacity: isSubmitting ? 0.6 : 1 }}>
          <Text className="font-label text-sm font-bold" style={{ color: adminTheme.onSurfaceVariant }}>
            {SALON_REQUEST_COPY.editInfoCancel}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void handleSave()}
          disabled={isSubmitting}
          className="rounded-md px-6 py-3"
          style={{
            backgroundColor: adminTheme.primary,
            opacity: isSubmitting ? 0.65 : 1,
          }}>
          <Text className="font-label text-sm font-bold" style={{ color: adminTheme.onPrimary }}>
            {SALON_REQUEST_COPY.editInfoSave}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
