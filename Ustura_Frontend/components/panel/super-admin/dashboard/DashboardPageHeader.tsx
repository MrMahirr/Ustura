import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import { styles } from './styles';

export default function DashboardPageHeader({ isLg }: { isLg: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.headerSection,
        {
          flexDirection: isLg ? 'row' : 'column',
          alignItems: isLg ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View style={styles.headerCopy}>
        <Text style={[styles.title, { color: adminTheme.onSurface }]}>Platform Genel Bakis</Text>
        <Text style={[styles.description, { color: adminTheme.onSurfaceVariant }]}>
          Sistem genelindeki operasyonel veriler, abone performansi ve teknik loglarin canli takibi.
        </Text>
      </View>

      <View style={[styles.headerActions, { width: isLg ? 'auto' : '100%' }]}>
        <Pressable
          style={({ hovered }) => [
            styles.secondaryCta,
            {
              backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundMuted,
              marginRight: isLg ? 14 : 0,
              marginBottom: isLg ? 0 : 12,
              width: isLg ? 'auto' : '100%',
            },
          ]}>
          <Text style={[styles.secondaryCtaText, { color: adminTheme.onSurface }]}>Raporu Indir</Text>
        </Pressable>
        <Button
          title="Yeni Salon Ekle"
          interactionPreset="cta"
          icon="add-business"
          style={isLg ? undefined : { width: '100%' }}
        />
      </View>
    </View>
  );
}
