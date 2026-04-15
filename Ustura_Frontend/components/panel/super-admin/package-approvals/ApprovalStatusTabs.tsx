import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { PackageApprovalCounts, PackageApprovalStatus } from './types';

interface ApprovalStatusTabsProps {
  value: PackageApprovalStatus;
  counts: PackageApprovalCounts;
  onChange: (status: PackageApprovalStatus) => void;
}

const ITEMS: {
  key: PackageApprovalStatus;
  label: string;
}[] = [
  { key: 'pending', label: 'Bekleyenler' },
  { key: 'approved', label: 'Onaylananlar' },
  { key: 'rejected', label: 'Reddedilenler' },
];

export default function ApprovalStatusTabs({
  value,
  counts,
  onChange,
}: ApprovalStatusTabsProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3">
        {ITEMS.map((item) => {
          const isActive = item.key === value;
          const count = counts[item.key];

          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              onPress={() => onChange(item.key)}
              style={({ hovered, pressed }) => ({
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderRadius: 999,
                paddingHorizontal: 16,
                backgroundColor: isActive
                  ? hexToRgba(adminTheme.primary, 0.14)
                  : hovered || pressed
                    ? adminTheme.cardBackgroundStrong
                    : adminTheme.cardBackground,
                borderWidth: 1,
                borderColor: isActive
                  ? hexToRgba(adminTheme.primary, 0.3)
                  : adminTheme.borderSubtle,
              })}>
              <Text
                className="font-label text-[11px] uppercase tracking-[2px]"
                style={{
                  color: isActive
                    ? adminTheme.primary
                    : adminTheme.onSurfaceVariant,
                  fontFamily: 'Manrope-Bold',
                }}>
                {item.label}
              </Text>
              <View
                className="min-w-[28px] rounded-full px-2 py-1"
                style={{
                  backgroundColor: isActive
                    ? hexToRgba(adminTheme.primary, 0.16)
                    : adminTheme.cardBackgroundStrong,
                }}>
                <Text
                  className="text-center font-label text-[10px]"
                  style={{
                    color: isActive
                      ? adminTheme.primary
                      : adminTheme.onSurfaceVariant,
                    fontFamily: 'Manrope-Bold',
                  }}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
