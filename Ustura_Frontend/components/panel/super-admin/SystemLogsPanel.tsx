import { Platform, StyleSheet, Text, View } from 'react-native';

import type { LogEntry } from '@/components/panel/super-admin/data';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export default function SystemLogsPanel({ logs }: { logs: LogEntry[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: adminTheme.logBackground,
          borderColor: adminTheme.borderSubtle,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: adminTheme.onSurface }]}>Sistem Loglari</Text>
        <View style={[styles.liveDot, { backgroundColor: adminTheme.success }]} />
      </View>

      <View style={styles.logList}>
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
            <Text key={log.id} style={[styles.logLine, { color }]}>
              <Text style={[styles.logTime, { color: adminTheme.onSurfaceVariant }]}>{`[${log.time}] `}</Text>
              {log.message}
            </Text>
          );
        })}

        <Text style={[styles.fetching, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.5) }]}>
          Fetching more logs...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 260,
    flex: 1,
    borderRadius: 4,
    padding: 28,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 18,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  logList: {
    gap: 10,
  },
  logLine: {
    fontFamily: Platform.select({ web: 'monospace', ios: 'Courier', android: 'monospace' }),
    fontSize: 11,
    lineHeight: 17,
  },
  logTime: {
    fontFamily: Platform.select({ web: 'monospace', ios: 'Courier', android: 'monospace' }),
  },
  fetching: {
    fontFamily: Platform.select({ web: 'monospace', ios: 'Courier', android: 'monospace' }),
    fontSize: 11,
    marginTop: 4,
  },
});
