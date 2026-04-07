import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import {
  SUPER_ADMIN_ACCESS_COPY,
  SUPER_ADMIN_SUPPORT_LINKS,
} from '@/components/auth/super-admin-access/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface SuperAdminAccessLegalFooterProps {
  onSystemStatusPress: () => void;
}

interface FooterLinkProps {
  label: string;
  href?: (typeof SUPER_ADMIN_SUPPORT_LINKS)[number]['href'];
  onPress?: () => void;
}

function FooterLink({ label, href, onPress }: FooterLinkProps) {
  const adminTheme = useSuperAdminTheme();

  const content = (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ hovered, pressed }) => (
        <Text
          className="font-label text-[10px] uppercase tracking-[1.6px]"
          style={{
            color: hovered || pressed ? adminTheme.primaryContainer : hexToRgba(adminTheme.onSurfaceVariant, 0.58),
          }}>
          {label}
        </Text>
      )}
    </Pressable>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} asChild>
      {content}
    </Link>
  );
}

export default function SuperAdminAccessLegalFooter({ onSystemStatusPress }: SuperAdminAccessLegalFooterProps) {
  const adminTheme = useSuperAdminTheme();
  const currentYear = new Date().getFullYear();

  return (
    <View className="w-full px-6 py-8" style={{ gap: 16 }}>
      <View className="items-center justify-between" style={{ gap: 16 }}>
        <Text className="font-headline text-lg font-bold" style={{ color: adminTheme.primary }}>
          {SUPER_ADMIN_ACCESS_COPY.brand}
        </Text>

        <View className="flex-row flex-wrap items-center justify-center" style={{ gap: 20 }}>
          {SUPER_ADMIN_SUPPORT_LINKS.map((link) => (
            <FooterLink
              key={link.label}
              label={link.label}
              href={link.href}
              onPress={link.href ? undefined : onSystemStatusPress}
            />
          ))}
        </View>

        <Text
          className="text-center font-label text-[10px] uppercase tracking-[1.6px]"
          style={{ color: hexToRgba(adminTheme.primaryContainer, 0.82) }}>
          {`© ${currentYear} USTURA. ${SUPER_ADMIN_ACCESS_COPY.legalFooterSuffix}`}
        </Text>
      </View>
    </View>
  );
}
