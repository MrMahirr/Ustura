import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import type { ApprovalRequest } from '@/components/panel/super-admin/data';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export default function PendingApprovalsPanel({ approvals }: { approvals: ApprovalRequest[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="min-h-[260px] flex-1 rounded-sm p-7"
      style={{
        backgroundColor: adminTheme.cardBackground,
        borderTopWidth: 1,
        borderTopColor: hexToRgba(adminTheme.primary, 0.2),
      }}>
      <Text className="mb-[22px] font-headline text-lg" style={{ color: adminTheme.onSurface }}>
        Bekleyen Onaylar
      </Text>

      <View className="gap-[14px]">
        {approvals.length === 0 ? (
          <Text className="font-body text-sm" style={{ color: adminTheme.onSurfaceVariant }}>
            Bekleyen onay kaydi bulunamadi.
          </Text>
        ) : (
          approvals.map((approval) => (
            <View
              key={approval.id}
              className="gap-3 rounded-sm p-4"
              style={{ backgroundColor: hexToRgba(adminTheme.surfaceContainerHighest, 0.3) }}>
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 font-body text-xs font-bold" style={{ color: adminTheme.onSurface }}>
                  {approval.name}
                </Text>
                <View className="rounded-full px-2 py-1" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.2) }}>
                  <Text className="font-label text-[9px] uppercase tracking-[0.6px]" style={{ color: adminTheme.primary }}>
                    {approval.status}
                  </Text>
                </View>
              </View>

              <Text className="font-body text-[10px] leading-4" style={{ color: adminTheme.onSurfaceVariant }}>
                {approval.summary}
              </Text>

              <View className="flex-row gap-2">
                <Pressable className="flex-1 overflow-hidden rounded-sm">
                  <LinearGradient
                    colors={adminTheme.goldGradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="items-center justify-center py-2.5">
                    <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onPrimary }}>
                      Onayla
                    </Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  className="flex-1 items-center justify-center rounded-sm py-2.5"
                  style={({ hovered }) => [
                    {
                      backgroundColor: hovered
                        ? hexToRgba(adminTheme.error, 0.16)
                        : hexToRgba(adminTheme.error, 0.1),
                    },
                  ]}>
                  <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.error }}>
                    Reddet
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
