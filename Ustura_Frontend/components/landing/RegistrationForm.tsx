import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getLandingLayout } from '@/components/landing/layout';

export default function RegistrationForm() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = width >= 980;

  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
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
          ]}>
          <View style={[styles.inputRow, { flexDirection: isDesktop ? 'row' : 'column', gap: width < 768 ? 20 : 32 }]}>
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
            <Button title="Hemen Basvur" style={{ width: '100%' }} />
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
    borderRadius: 4,
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
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
