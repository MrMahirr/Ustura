import { Platform, Text, View } from 'react-native';

import type { LogEntry } from '@/components/panel/super-admin/data';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export default function SystemLogsPanel({ logs }: { logs: LogEntry[] }) {
  const adminTheme = useSuperAdminTheme();
  const monoFont = Platform.select({ web: 'monospace', ios: 'Courier', android: 'monospace' });

  return (
    <View
      className="min-h-[260px] flex-1 rounded-sm border p-7"
      style={{ backgroundColor: adminTheme.logBackground, borderColor: adminTheme.borderSubtle }}>
      <View className="mb-[22px] flex-row items-center justify-between">
        <Text className="font-headline text-lg" style={{ color: adminTheme.onSurface }}>
          Sistem Loglari
        </Text>
        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: adminTheme.success }} />
      </View>

      <View className="gap-2.5">
        {logs.map((log) => {
          const color =
            log.tone === 'success'
              ? hexToRgba(adminTheme.success, 0.85)
              : log.tone === 'error'
                ? hexToRgba(adminTheme.error, 0.85)
                : log.tone === 'primary'
                  ? hexToRgba(adminTheme.primary, 0.85)
                  : adminTheme.onSurfaceVariant;

          return (
            <Text key={log.id} style={{ color, fontFamily: monoFont, fontSize: 11, lineHeight: 17 }}>
              <Text style={{ color: adminTheme.onSurfaceVariant, fontFamily: monoFont }}>{`[${log.time}] `}</Text>
              {log.message}
            </Text>
          );
        })}

        <Text
          style={{
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.5),
            fontFamily: monoFont,
            fontSize: 11,
            marginTop: 4,
          }}>
          Fetching more logs...
        </Text>
      </View>
    </View>
  );
}
