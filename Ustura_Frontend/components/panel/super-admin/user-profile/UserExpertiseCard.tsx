import React from 'react';
import { Platform, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import { styles } from './styles';

export default function UserExpertiseCard({ expertise }: { expertise: string[] }) {
  const adminTheme = useSuperAdminTheme();
  const cardShadowStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            adminTheme.theme === 'dark'
              ? '0 18px 40px rgba(0, 0, 0, 0.24)'
              : '0 18px 40px rgba(27, 27, 32, 0.08)',
        } as any)
      : {
          shadowColor: '#000000',
          shadowOpacity: adminTheme.theme === 'dark' ? 0.18 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        };

  return (
    <View
      style={[
        styles.panelCard,
        {
          backgroundColor: adminTheme.cardBackground,
          ...cardShadowStyle,
        },
      ]}>
      <Text style={[styles.panelTitleSm, { color: adminTheme.onSurface }]}>Expertise</Text>

      <View style={styles.tagWrap}>
        {expertise.map((item) => (
          <View
            key={item}
            style={[
              styles.tagPill,
              {
                backgroundColor: adminTheme.surfaceContainerHighest,
                borderColor: adminTheme.borderSubtle,
              },
            ]}>
            <Text style={[styles.tagText, { color: adminTheme.onSurface }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
