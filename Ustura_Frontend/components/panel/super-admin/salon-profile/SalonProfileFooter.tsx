import React from 'react';
import { Text, View } from 'react-native';

import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

const footerLinks = ['Belgeler', 'Sunucu Durumu', 'API Erisimi'];

export default function SalonProfileFooter() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="flex-row flex-wrap items-center justify-between gap-4 border-t pt-2" style={{ borderTopColor: adminTheme.borderSubtle }}>
      <Text className={salonProfileClassNames.footerText} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.56), fontFamily: 'Manrope-Bold' }}>
        (c) 2026 USTURA Ana Yonetici Konsolu
      </Text>

      <View className="flex-row flex-wrap gap-5">
        {footerLinks.map((link) => (
          <Text
            key={link}
            className={salonProfileClassNames.footerText}
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            {link}
          </Text>
        ))}
      </View>
    </View>
  );
}
