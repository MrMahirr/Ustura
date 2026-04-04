import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { Typography } from '@/constants/typography';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface ReservationRecord {
  id: string;
  salon: string;
  user: string;
  barber: string;
  time: string;
  status: string;
  statusTone: 'success' | 'warning' | 'info';
}

export interface ReservationTableProps {
  title?: string;
  actionLabel?: string;
  rows: ReservationRecord[];
}

function StatusBadge({ label, tone }: { label: string; tone: ReservationRecord['statusTone'] }) {
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const tertiary = useThemeColor({}, 'tertiary');
  const color = tone === 'success' ? success : tone === 'warning' ? warning : tertiary;

  return (
    <View style={[styles.badge, { backgroundColor: hexToRgba(color, 0.12) }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function RowAction({ icon }: { icon: IconName }) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <Pressable
      style={({ hovered }) => [
        styles.actionButton,
        { backgroundColor: hovered ? hexToRgba(primary, 0.08) : 'transparent' },
      ]}>
      {({ hovered }) => (
        <MaterialIcons name={icon} size={20} color={hovered ? primary : onSurfaceVariant} />
      )}
    </Pressable>
  );
}

export default function ReservationTable({
  title = 'Son Randevular',
  actionLabel = 'Tamamini Goruntule',
  rows,
}: ReservationTableProps) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const isDesktop = width >= 960;

  return (
    <View style={[styles.wrapper, { backgroundColor: adminTheme.cardBackground }]}>
      <View style={[styles.tableHeader, { borderBottomColor: adminTheme.borderSubtle }]}>
        <Text style={[styles.tableTitle, { color: adminTheme.onSurface }]}>{title}</Text>
        <Text style={[styles.tableAction, { color: adminTheme.primary }]}>{actionLabel}</Text>
      </View>

      {isDesktop ? (
        <View>
          <View style={[styles.desktopHeadRow, { backgroundColor: adminTheme.tableHeaderBackground }]}>
            <Text style={[styles.columnHead, styles.salonColumn, { color: adminTheme.onSurfaceVariant }]}>Salon</Text>
            <Text style={[styles.columnHead, styles.userColumn, { color: adminTheme.onSurfaceVariant }]}>Kullanici</Text>
            <Text style={[styles.columnHead, styles.barberColumn, { color: adminTheme.onSurfaceVariant }]}>Berber</Text>
            <Text style={[styles.columnHead, styles.timeColumn, { color: adminTheme.onSurfaceVariant }]}>Saat</Text>
            <Text style={[styles.columnHead, styles.statusColumn, { color: adminTheme.onSurfaceVariant }]}>Durum</Text>
            <Text style={[styles.columnHead, styles.actionColumn, { color: adminTheme.onSurfaceVariant }]}>Islem</Text>
          </View>

          {rows.map((row, index) => (
            <View
              key={row.id}
              style={[
                styles.desktopRow,
                {
                  borderBottomColor: index === rows.length - 1 ? 'transparent' : adminTheme.borderSubtle,
                },
                Platform.OS === 'web' ? (styles.desktopRowWeb as any) : null,
              ]}>
              <Text style={[styles.desktopCellPrimary, styles.salonColumn, { color: adminTheme.onSurface }]}>
                {row.salon}
              </Text>
              <Text style={[styles.desktopCell, styles.userColumn, { color: adminTheme.onSurfaceVariant }]}>{row.user}</Text>
              <Text style={[styles.desktopCell, styles.barberColumn, { color: adminTheme.onSurfaceVariant }]}>
                {row.barber}
              </Text>
              <Text style={[styles.desktopCell, styles.timeColumn, { color: adminTheme.onSurfaceVariant }]}>
                {row.time}
              </Text>
              <View style={[styles.statusColumn, styles.desktopStatusWrap]}>
                <StatusBadge label={row.status} tone={row.statusTone} />
              </View>
              <View style={[styles.actionColumn, styles.desktopActionWrap]}>
                <RowAction icon="more-vert" />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.mobileRows}>
          {rows.map((row) => (
            <View key={row.id} style={[styles.mobileCard, { borderColor: adminTheme.borderSubtle }]}>
              <View style={styles.mobileHeader}>
                <Text style={[styles.mobileSalon, { color: adminTheme.onSurface }]}>{row.salon}</Text>
                <StatusBadge label={row.status} tone={row.statusTone} />
              </View>
              <View style={styles.mobileMeta}>
                <Text style={[styles.mobileLabel, { color: adminTheme.onSurfaceVariant }]}>Kullanici</Text>
                <Text style={[styles.mobileValue, { color: adminTheme.onSurface }]}>{row.user}</Text>
              </View>
              <View style={styles.mobileMeta}>
                <Text style={[styles.mobileLabel, { color: adminTheme.onSurfaceVariant }]}>Berber</Text>
                <Text style={[styles.mobileValue, { color: adminTheme.onSurface }]}>{row.barber}</Text>
              </View>
              <View style={styles.mobileMeta}>
                <Text style={[styles.mobileLabel, { color: adminTheme.onSurfaceVariant }]}>Saat</Text>
                <Text style={[styles.mobileValue, { color: adminTheme.onSurface }]}>{row.time}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderBottomWidth: 1,
  },
  tableTitle: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 20,
  },
  tableAction: {
    ...Typography.labelMd,
    fontSize: 11,
    fontFamily: 'Manrope-Bold',
  },
  desktopHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  columnHead: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  desktopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  desktopRowWeb: {
    transition: 'background-color 160ms ease',
  } as any,
  salonColumn: {
    flex: 1.35,
  },
  userColumn: {
    flex: 1.1,
  },
  barberColumn: {
    flex: 1.1,
  },
  timeColumn: {
    flex: 0.9,
  },
  statusColumn: {
    flex: 0.9,
  },
  actionColumn: {
    width: 56,
    alignItems: 'flex-end',
  },
  desktopCellPrimary: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
  },
  desktopCell: {
    ...Typography.bodyMd,
  },
  desktopStatusWrap: {
    alignItems: 'flex-start',
  },
  desktopActionWrap: {
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  mobileRows: {
    gap: 12,
    padding: 16,
  },
  mobileCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  mobileSalon: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Bold',
    flex: 1,
  },
  mobileMeta: {
    gap: 2,
  },
  mobileLabel: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  mobileValue: {
    ...Typography.bodyMd,
  },
});
