import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ApprovalRequest } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export default function PendingApprovalsPanel({ approvals }: { approvals: ApprovalRequest[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: adminTheme.cardBackground,
          borderTopWidth: 1,
          borderTopColor: hexToRgba(adminTheme.primary, 0.2),
        },
      ]}>
      <Text style={[styles.title, { color: adminTheme.onSurface }]}>Bekleyen Onaylar</Text>

      <View style={styles.list}>
        {approvals.length === 0 ? (
          <Text style={[styles.empty, { color: adminTheme.onSurfaceVariant }]}>Bekleyen onay kaydi bulunamadi.</Text>
        ) : (
          approvals.map((approval) => (
            <View
              key={approval.id}
              style={[styles.requestCard, { backgroundColor: hexToRgba(adminTheme.surfaceContainerHighest, 0.3) }]}>
              <View style={styles.requestHeader}>
                <Text style={[styles.requestName, { color: adminTheme.onSurface }]}>{approval.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: hexToRgba(adminTheme.primary, 0.2) }]}>
                  <Text style={[styles.statusLabel, { color: adminTheme.primary }]}>{approval.status}</Text>
                </View>
              </View>

              <Text style={[styles.summary, { color: adminTheme.onSurfaceVariant }]}>{approval.summary}</Text>

              <View style={styles.actions}>
                <Pressable style={styles.actionFlex}>
                  <LinearGradient
                    colors={adminTheme.goldGradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.approveGradient}>
                    <Text style={[styles.actionLabel, { color: adminTheme.onPrimary }]}>Onayla</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  style={({ hovered }) => [
                    styles.rejectBtn,
                    {
                      backgroundColor: hovered
                        ? hexToRgba(adminTheme.error, 0.16)
                        : hexToRgba(adminTheme.error, 0.1),
                    },
                  ]}>
                  <Text style={[styles.rejectLabel, { color: adminTheme.error }]}>Reddet</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    padding: 28,
    minHeight: 260,
    flex: 1,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 18,
    marginBottom: 22,
  },
  list: {
    gap: 14,
  },
  requestCard: {
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  requestName: {
    fontSize: 12,
    fontFamily: 'Manrope-Bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusLabel: {
    fontSize: 9,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summary: {
    fontSize: 10,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionFlex: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  approveGradient: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectLabel: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    ...Typography.bodyMd,
  },
});
