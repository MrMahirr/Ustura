import { Text, View } from 'react-native';

import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

export type AuthStatusTone = 'neutral' | 'success' | 'warning' | 'error';

interface AuthStatusNoticeProps {
  badge: string;
  title: string;
  description: string;
  tone: AuthStatusTone;
}

function getToneColor(tone: AuthStatusTone, colors: ReturnType<typeof useAuthAccessTheme>) {
  switch (tone) {
    case 'error':
      return colors.error;
    case 'success':
      return colors.primary;
    case 'warning':
      return colors.primaryContainer;
    case 'neutral':
    default:
      return colors.tertiary;
  }
}

export default function AuthStatusNotice({
  badge,
  title,
  description,
  tone,
}: AuthStatusNoticeProps) {
  const theme = useAuthAccessTheme();
  const accent = getToneColor(tone, theme);

  return (
    <View
      className="rounded-md border px-4 py-3"
      style={{
        backgroundColor: hexToRgba(accent, 0.08),
        borderColor: hexToRgba(accent, 0.2),
      }}>
      <View style={{ gap: 6 }}>
        <Text className="font-label text-[10px] uppercase tracking-[2px]" style={{ color: accent }}>
          {badge}
        </Text>
        <Text className="font-body text-sm font-semibold" style={{ color: theme.onSurface }}>
          {title}
        </Text>
        <Text className="font-body text-[12px] leading-5" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.84) }}>
          {description}
        </Text>
      </View>
    </View>
  );
}
