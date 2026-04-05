import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
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
    <View className="self-start rounded-sm px-2 py-1" style={{ backgroundColor: hexToRgba(color, 0.12) }}>
      <Text className="font-label text-[10px] uppercase tracking-[0.4px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

function RowAction({ icon }: { icon: IconName }) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <Pressable
      className="h-9 w-9 items-center justify-center rounded-sm"
      style={({ hovered }) => [
        { backgroundColor: hovered ? hexToRgba(primary, 0.08) : 'transparent' },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
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
    <View className="overflow-hidden rounded-sm" style={{ backgroundColor: adminTheme.cardBackground }}>
      <View className="flex-row items-center justify-between border-b px-7 py-[22px]" style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <Text className="font-headline text-xl" style={{ color: adminTheme.onSurface }}>
          {title}
        </Text>
        <Text className="font-label text-[11px] uppercase tracking-wide" style={{ color: adminTheme.primary }}>
          {actionLabel}
        </Text>
      </View>

      {isDesktop ? (
        <View>
          <View className="flex-row items-center px-7 py-[14px]" style={{ backgroundColor: adminTheme.tableHeaderBackground }}>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ flex: 1.35, color: adminTheme.onSurfaceVariant }}>
              Salon
            </Text>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ flex: 1.1, color: adminTheme.onSurfaceVariant }}>
              Kullanici
            </Text>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ flex: 1.1, color: adminTheme.onSurfaceVariant }}>
              Berber
            </Text>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ flex: 0.9, color: adminTheme.onSurfaceVariant }}>
              Saat
            </Text>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ flex: 0.9, color: adminTheme.onSurfaceVariant }}>
              Durum
            </Text>
            <Text className="font-label text-[10px] uppercase tracking-wide" style={{ width: 56, color: adminTheme.onSurfaceVariant }}>
              Islem
            </Text>
          </View>

          {rows.map((row, index) => (
            <View
              key={row.id}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 28,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                },
                {
                  borderBottomColor: index === rows.length - 1 ? 'transparent' : adminTheme.borderSubtle,
                },
                Platform.OS === 'web' ? ({ transition: 'background-color 160ms ease' } as any) : null,
              ]}>
              <Text className="font-body text-sm font-bold" style={{ flex: 1.35, color: adminTheme.onSurface }}>
                {row.salon}
              </Text>
              <Text className="font-body text-sm" style={{ flex: 1.1, color: adminTheme.onSurfaceVariant }}>
                {row.user}
              </Text>
              <Text className="font-body text-sm" style={{ flex: 1.1, color: adminTheme.onSurfaceVariant }}>
                {row.barber}
              </Text>
              <Text className="font-body text-sm" style={{ flex: 0.9, color: adminTheme.onSurfaceVariant }}>
                {row.time}
              </Text>
              <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                <StatusBadge label={row.status} tone={row.statusTone} />
              </View>
              <View style={{ width: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                <RowAction icon="more-vert" />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-3 p-4">
          {rows.map((row) => (
            <View key={row.id} className="gap-3 rounded-sm border p-4" style={{ borderColor: adminTheme.borderSubtle }}>
              <View className="flex-row justify-between gap-3">
                <Text className="flex-1 font-body text-lg font-bold" style={{ color: adminTheme.onSurface }}>
                  {row.salon}
                </Text>
                <StatusBadge label={row.status} tone={row.statusTone} />
              </View>
              <View className="gap-0.5">
                <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                  Kullanici
                </Text>
                <Text className="font-body text-sm" style={{ color: adminTheme.onSurface }}>
                  {row.user}
                </Text>
              </View>
              <View className="gap-0.5">
                <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                  Berber
                </Text>
                <Text className="font-body text-sm" style={{ color: adminTheme.onSurface }}>
                  {row.barber}
                </Text>
              </View>
              <View className="gap-0.5">
                <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                  Saat
                </Text>
                <Text className="font-body text-sm" style={{ color: adminTheme.onSurface }}>
                  {row.time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
