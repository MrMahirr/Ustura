import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

const footerLinks = ['Dokumantasyon', 'Sunucu Durumu', 'API Erisimi'];

export default function SalonProfileFooter() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View style={[styles.footer, { borderTopColor: adminTheme.borderSubtle }]}>
      <Text style={[styles.footerText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.56) }]}>
        © 2026 USTURA Super Admin Console
      </Text>

      <View style={styles.footerLinks}>
        {footerLinks.map((link) => (
          <Text
            key={link}
            style={[styles.footerText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
            {link}
          </Text>
        ))}
      </View>
    </View>
  );
}
