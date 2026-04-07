import { Text, View } from 'react-native';

import type { CustomerAuthNotice } from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

interface CustomerAccessNoticeStripProps {
  notice: CustomerAuthNotice;
}

function getAccentColor(
  tone: CustomerAuthNotice['tone'],
  theme: ReturnType<typeof useAuthAccessTheme>
) {
  switch (tone) {
    case 'error':
      return theme.error;
    case 'success':
      return theme.primary;
    case 'warning':
      return theme.primaryContainer;
    case 'neutral':
    default:
      return theme.tertiary;
  }
}

export default function CustomerAccessNoticeStrip({
  notice,
}: CustomerAccessNoticeStripProps) {
  const theme = useAuthAccessTheme();
  const accent = getAccentColor(notice.tone, theme);

  return (
    <View
      className="rounded-md border px-4 py-3"
      style={{
        backgroundColor: hexToRgba(accent, 0.09),
        borderColor: hexToRgba(accent, 0.18),
      }}>
      <View style={{ gap: 5 }}>
        <Text className="font-label text-[10px] uppercase tracking-[2px]" style={{ color: accent }}>
          {notice.badge}
        </Text>
        <Text className="font-body text-sm font-semibold" style={{ color: theme.onSurface }}>
          {notice.title}
        </Text>
        <Text className="font-body text-[12px] leading-5" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.8) }}>
          {notice.description}
        </Text>
      </View>
    </View>
  );
}
