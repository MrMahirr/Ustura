import React, { useState } from 'react';
import { View, Text, useWindowDimensions, Platform, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getLandingLayout } from '@/components/landing/layout';
import { submitOwnerApplication } from '@/services/platform-admin.service';
import { hexToRgba } from '@/utils/color';

type RegistrationFormProps = {
  onLayout?: ViewProps['onLayout'];
};

export default function RegistrationForm({ onLayout }: RegistrationFormProps) {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = width >= 980;

  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const errorColor = '#B3261E';
  const successColor = '#2E7D32';

  const [form, setForm] = useState({
    salonName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    district: '',
    address: '',
    notes: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormValue = <TKey extends keyof typeof form,>(
    key: TKey,
    value: (typeof form)[TKey],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      setIsSubmitting(true);
      await submitOwnerApplication({
        applicantName: form.ownerName,
        applicantEmail: form.email,
        applicantPhone: form.phone,
        password: form.password,
        salonName: form.salonName,
        salonAddress: form.address,
        salonCity: form.city,
        salonDistrict: form.district,
        notes: form.notes,
      });

      setSubmitSuccess(
        'Basvurunuz alindi. Super admin onayindan sonra sizinle iletisime gecilecek.',
      );
      setForm({
        salonName: '',
        ownerName: '',
        phone: '',
        email: '',
        password: '',
        city: '',
        district: '',
        address: '',
        notes: '',
      });
    } catch (submissionError) {
      setSubmitError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Basvuru gonderilemedi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      onLayout={onLayout}
      className=""
      style={{
        backgroundColor: surfaceContainerLowest,
        paddingVertical: layout.sectionPaddingVertical,
        paddingHorizontal: layout.horizontalPadding,
      }}>
      <View className="w-full self-center" style={{ maxWidth: Math.min(layout.contentMaxWidth, 1040) }}>
        <View className="mb-16 items-center">
          <Text className="mb-4 font-label text-base uppercase tracking-[4px]" style={{ color: primary }}>
            SALONLAR
          </Text>
          <Text className="mb-6 text-center font-headline text-5xl font-bold" style={{ color: onSurface }}>
            Salonunu Platforma Ekle
          </Text>
          <Text className="max-w-[680px] text-center font-body text-lg" style={{ color: onSurfaceVariant }}>
            Ustura topluluguna katilarak isini buyut. Kayit tamamen ucretsizdir.
          </Text>
        </View>

        <View
          className="overflow-hidden rounded-xl border"
          style={[
            {
              backgroundColor: surface,
              borderColor: outlineVariant,
              padding: width < 768 ? 24 : width < 1200 ? 32 : 48,
            },
            Platform.OS === 'web'
              ? ({ boxShadow: '0 20px 50px rgba(27, 27, 32, 0.08)' } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: 0.10,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 8,
                },
          ]}>
          <View className="mb-7 h-2 rounded-full" style={{ backgroundColor: hexToRgba(primaryContainer, 0.9) }} />

          <View className="mb-8" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: width < 868 ? 20 : 32 }}>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="SALON ADI"
                value={form.salonName}
                onChangeText={(value) => updateFormValue('salonName', value)}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="SAHIBI"
                value={form.ownerName}
                onChangeText={(value) => updateFormValue('ownerName', value)}
              />
            </View>
          </View>

          <View className="mb-8" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }}>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="TELEFON"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(value) => updateFormValue('phone', value)}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="E-POSTA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(value) => updateFormValue('email', value)}
              />
            </View>
          </View>

          <View className="mb-8" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }}>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="SIFRE"
                secureTextEntry
                autoCapitalize="none"
                value={form.password}
                onChangeText={(value) => updateFormValue('password', value)}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="SEHIR"
                value={form.city}
                onChangeText={(value) => updateFormValue('city', value)}
              />
            </View>
          </View>

          <View className="mb-8" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }}>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="ILCE"
                value={form.district}
                onChangeText={(value) => updateFormValue('district', value)}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="ADRES"
                value={form.address}
                onChangeText={(value) => updateFormValue('address', value)}
              />
            </View>
          </View>

          <View className="mb-6">
            <Input
              label="NOTLAR"
              value={form.notes}
              onChangeText={(value) => updateFormValue('notes', value)}
              multiline
              numberOfLines={4}
              style={{ minHeight: 96, textAlignVertical: 'top' }}
            />
          </View>

          {submitError ? (
            <Text className="mb-4 font-body text-sm" style={{ color: errorColor }}>
              {submitError}
            </Text>
          ) : null}

          {submitSuccess ? (
            <Text className="mb-4 font-body text-sm" style={{ color: successColor }}>
              {submitSuccess}
            </Text>
          ) : null}

          <View className="mt-4">
            <Button
              title={isSubmitting ? 'Basvuru Gonderiliyor' : 'Hemen Basvur'}
              interactionPreset="subtle"
              style={{ width: '100%' }}
              onPress={() => {
                void handleSubmit();
              }}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
