import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { RecentSalon } from '@/components/panel/super-admin/data';

import { useSuperAdminTheme } from './theme';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function RecentSalonsPanel({ salons }: { salons: RecentSalon[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="min-h-[260px] flex-1 rounded-sm p-7" style={{ backgroundColor: adminTheme.cardBackground }}>
      <Text className="mb-[22px] font-headline text-lg" style={{ color: adminTheme.onSurface }}>
        Son Eklenen Salonlar
      </Text>

      <View className="gap-[22px]">
        {salons.length === 0 ? (
          <Text className="font-body text-sm" style={{ color: adminTheme.onSurfaceVariant }}>
            Arama ile eslesen yeni salon bulunamadi.
          </Text>
        ) : (
          salons.map((salon, index) => {
            const gold = index % 2 === 0;
            return (
              <View key={salon.id} className="flex-row items-center gap-[14px]">
                {gold ? (
                  <LinearGradient
                    colors={adminTheme.goldGradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="h-12 w-12 items-center justify-center rounded-sm">
                    <Text className="font-headline text-lg" style={{ color: adminTheme.onPrimary }}>
                      {initials(salon.name)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="h-12 w-12 items-center justify-center rounded-sm" style={{ backgroundColor: adminTheme.surfaceContainerHighest }}>
                    <Text className="font-headline text-lg" style={{ color: adminTheme.onSurface }}>
                      {initials(salon.name)}
                    </Text>
                  </View>
                )}

                <View className="flex-1 gap-1">
                  <Text className="font-body text-sm font-bold" style={{ color: adminTheme.onSurface }}>
                    {salon.name}
                  </Text>
                  <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                    {salon.addedAt}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
