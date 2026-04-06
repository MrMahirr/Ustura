import { Text, View } from 'react-native';

import type { SuperAdminConsoleEntry } from '@/components/auth/super-admin-access/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface SuperAdminAccessConsoleProps {
  entries: SuperAdminConsoleEntry[];
}

function getConsoleToneColor(
  tone: SuperAdminConsoleEntry['tone'],
  colors: ReturnType<typeof useSuperAdminTheme>
) {
  switch (tone) {
    case 'error':
      return colors.error;
    case 'success':
      return colors.primaryContainer;
    case 'warning':
      return colors.primary;
    case 'neutral':
    default:
      return hexToRgba(colors.onSurfaceVariant, 0.84);
  }
}

export default function SuperAdminAccessConsole({ entries }: SuperAdminAccessConsoleProps) {
  const adminTheme = useSuperAdminTheme();

  if (entries.length === 0) {
    return null;
  }

  return (
    <View
      className="mt-8 rounded-sm border px-3 py-3"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
        borderColor: hexToRgba(adminTheme.onSurfaceVariant, 0.1),
      }}>
      <View style={{ gap: 6 }}>
        {entries.map((entry) => (
          <View key={entry.id} className="flex-row items-center" style={{ gap: 8, opacity: entry.dimmed ? 0.52 : 1 }}>
            <Text className="font-body text-[10px]" style={{ color: adminTheme.primaryContainer }}>
              &gt;
            </Text>
            <Text
              className="font-body text-[10px]"
              style={{
                color: getConsoleToneColor(entry.tone, adminTheme),
                fontFamily: adminTheme.monoFont,
                opacity: entry.pulse ? 0.92 : 0.76,
              }}>
              {entry.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
