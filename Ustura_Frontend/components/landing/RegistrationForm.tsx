import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
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
      style={[
        styles.container,
        {
          backgroundColor: surfaceContainerLowest,
          paddingVertical: layout.sectionPaddingVertical,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View style={[styles.content, { maxWidth: Math.min(layout.contentMaxWidth, 1040) }]}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: primary }]}>SALONLAR</Text>
          <Text style={[styles.headline, { color: onSurface }]}>Salonunu Platforma Ekle</Text>
          <Text style={[styles.description, { color: onSurfaceVariant }]}>
            Ustura topluluguna katilarak isini buyut. Kayit tamamen ucretsizdir.
          </Text>
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: surface,
              borderColor: outlineVariant,
              padding: width < 768 ? 24 : width < 1200 ? 32 : 48,
            },
            Platform.OS === 'web'
              ? ({
                  boxShadow: '0 20px 50px rgba(27, 27, 32, 0.08)',
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: 0.10,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 8,
                },
          ]}>
          <View style={[styles.formAccent, { backgroundColor: hexToRgba(primaryContainer, 0.9) }]} />

          <View style={[styles.inputRow, { flexDirection: isDesktop ? 'row' : 'column', gap: width < 868 ? 20 : 32 }]}>
            <View style={[styles.inputWrapper, { flex: isDesktop ? 1 : undefined }]}>
              <Input
                label="SALON ADI"
                value={form.salonName}
                onChangeText={(val) => setForm({ ...form, salonName: val })}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: isDesktop ? 1 : undefined }]}>
              <Input
                label="SAHIBI"
                value={form.ownerName}
                onChangeText={(val) => setForm({ ...form, ownerName: val })}
              />
            </View>
          </View>

          <View style={[styles.inputRow, { flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }]}>
            <View style={[styles.inputWrapper, { flex: isDesktop ? 1 : undefined }]}>
              <Input
                label="TELEFON"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(val) => setForm({ ...form, phone: val })}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: isDesktop ? 1 : undefined }]}>
              <Input
                label="E-POSTA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(val) => setForm({ ...form, email: val })}
              />
            </View>
          </View>

          <View style={styles.submitRow}>
            <Button title="Hemen Basvur" interactionPreset="subtle" style={{ width: '100%' }} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  label: {
    ...Typography.labelLg,
    letterSpacing: 4,
    marginBottom: 16,
  },
  headline: {
    ...Typography.displayMd,
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    ...Typography.bodyLg,
    fontSize: 18,
    textAlign: 'center',
    maxWidth: 680,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease' } as any)
      : {}),
  },
  formAccent: {
    height: 8,
    borderRadius: 999,
    marginBottom: 28,
  },
  inputRow: {
    marginBottom: 32,
  },
  inputWrapper: {
    width: '100%',
  },
  submitRow: {
    marginTop: 16,
  },
});
