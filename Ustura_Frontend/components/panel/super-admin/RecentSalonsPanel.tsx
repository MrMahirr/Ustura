import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { RecentSalon } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';

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
    <View style={[styles.card, { backgroundColor: adminTheme.cardBackground }]}>
      <Text style={[styles.title, { color: adminTheme.onSurface }]}>Son Eklenen Salonlar</Text>

      <View style={styles.list}>
        {salons.length === 0 ? (
          <Text style={[styles.empty, { color: adminTheme.onSurfaceVariant }]}>
            Arama ile eslesen yeni salon bulunamadi.
          </Text>
        ) : (
          salons.map((salon, index) => {
            const gold = index % 2 === 0;
            return (
              <View key={salon.id} style={styles.row}>
                {gold ? (
                  <LinearGradient
                    colors={adminTheme.goldGradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGold}>
                    <Text style={[styles.avatarText, { color: adminTheme.onPrimary }]}>{initials(salon.name)}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.avatarMuted, { backgroundColor: adminTheme.surfaceContainerHighest }]}>
                    <Text style={[styles.avatarText, { color: adminTheme.onSurface }]}>{initials(salon.name)}</Text>
                  </View>
                )}

                <View style={styles.meta}>
                  <Text style={[styles.name, { color: adminTheme.onSurface }]}>{salon.name}</Text>
                  <Text style={[styles.time, { color: adminTheme.onSurfaceVariant }]}>{salon.addedAt}</Text>
                </View>
              </View>
            );
          })
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
    gap: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarGold: {
    width: 48,
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMuted: {
    width: 48,
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 18,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
  },
  time: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  empty: {
    ...Typography.bodyMd,
  },
});
