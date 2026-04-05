import React, { useState } from 'react';
import { View, Text, useWindowDimensions, Platform, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getLandingLayout } from '@/components/landing/layout';
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

  const [form, setForm] = useState({
    salonName: '',
    ownerName: '',
    phone: '',
    email: '',
  });

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
                onChangeText={(val) => setForm({ ...form, salonName: val })}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="SAHIBI"
                value={form.ownerName}
                onChangeText={(val) => setForm({ ...form, ownerName: val })}
              />
            </View>
          </View>

          <View className="mb-8" style={{ flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }}>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="TELEFON"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(val) => setForm({ ...form, phone: val })}
              />
            </View>
            <View className="w-full" style={{ flex: isDesktop ? 1 : undefined }}>
              <Input
                label="E-POSTA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(val) => setForm({ ...form, email: val })}
              />
            </View>
          </View>

          <View className="mt-4">
            <Button title="Hemen Basvur" interactionPreset="subtle" style={{ width: '100%' }} />
          </View>
        </View>
      </View>
    </View>
  );
}
