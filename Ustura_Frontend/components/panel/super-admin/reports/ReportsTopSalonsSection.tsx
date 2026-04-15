import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { TopSalonRow } from './types';
import ReportsSectionTitle from './ReportsSectionTitle';

const BLUE = '#60a5fa';

interface ReportsTopSalonsSectionProps {
  rows: TopSalonRow[];
  primary: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
}

function rankBadge(rank: number) {
  if (rank === 1) return { bg: '#eab308', fg: '#000000' };
  if (rank === 2) return { bg: '#9ca3af', fg: '#000000' };
  if (rank === 3) return { bg: '#c2410c', fg: '#ffffff' };
  return { bg: hexToRgba('#9ca3af', 0.35), fg: '#000000' };
}

export default function ReportsTopSalonsSection({
  rows,
  primary,
  onSurface,
  onSurfaceVariant,
  surfaceContainerLow,
  surfaceContainerLowest,
}: ReportsTopSalonsSectionProps) {
  const { width } = useWindowDimensions();
  const scrollTable = width < 720;

  const header = (
    <View
      className="flex-row border-b px-4 py-3"
      style={{ backgroundColor: surfaceContainerLowest, borderBottomColor: hexToRgba(onSurface, 0.06) }}>
      {['#', 'Salon', 'Lokasyon', 'Gelir', 'Doluluk', 'Puan', 'Durum'].map((h) => (
        <Text
          key={h}
          className="font-label px-2 text-[10px] font-bold uppercase tracking-widest"
          style={{
            color: onSurfaceVariant,
            width: h === '#' ? 40 : h === 'Salon' ? 160 : h === 'Lokasyon' ? 140 : h === 'Gelir' ? 88 : h === 'Doluluk' ? 120 : h === 'Puan' ? 72 : 80,
            flexShrink: 0,
          }}>
          {h}
        </Text>
      ))}
    </View>
  );

  const Row = ({ row }: { row: TopSalonRow }) => {
    const badge = rankBadge(row.rank);
    const statusIsElite = row.status === 'Elite';
    return (
      <View
        className="flex-row items-center border-b px-4 py-3"
        style={{ borderBottomColor: hexToRgba(onSurface, 0.04) }}>
        <View style={{ width: 40 }} className="px-2">
          <View
            className="h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: badge.bg }}>
            <Text className="text-xs font-bold" style={{ color: badge.fg }}>
              {row.rank}
            </Text>
          </View>
        </View>
        <Text className="font-headline px-2 text-sm italic" style={{ color: onSurface, width: 160 }} numberOfLines={1}>
          {row.name}
        </Text>
        <Text className="px-2 text-xs" style={{ color: onSurfaceVariant, width: 140 }} numberOfLines={1}>
          {row.location}
        </Text>
        <Text className="px-2 text-sm font-bold" style={{ color: primary, width: 88 }}>
          {row.revenue}
        </Text>
        <View className="w-[120px] flex-row items-center gap-2 px-2">
          <View className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: surfaceContainerLowest, maxWidth: 64 }}>
            <View className="h-full rounded-full" style={{ width: `${row.occupancyPct}%`, backgroundColor: '#22c55e' }} />
          </View>
          <Text className="font-label text-[10px] font-bold" style={{ color: '#22c55e' }}>
            {row.occupancyPct}%
          </Text>
        </View>
        <View className="w-[72px] flex-row items-center gap-0.5 px-2">
          <MaterialIcons name="star" size={14} color={primary} />
          <Text className="text-sm font-medium" style={{ color: onSurface }}>
            {row.rating}
          </Text>
        </View>
        <View className="w-[80px] px-2">
          <Text
            className="self-start rounded-sm px-2 py-1 font-label text-[10px] font-bold uppercase"
            style={{
              backgroundColor: statusIsElite ? hexToRgba(primary, 0.12) : hexToRgba(BLUE, 0.12),
              color: statusIsElite ? primary : BLUE,
            }}>
            {row.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="overflow-hidden rounded-sm" style={{ backgroundColor: surfaceContainerLow }}>
      <View className="border-b p-6" style={{ borderBottomColor: hexToRgba(onSurface, 0.06) }}>
        <ReportsSectionTitle title="En Basarili 10 Salon" borderColor={primary} onSurface={onSurface} />
      </View>
      {scrollTable ? (
        <View>
          {rows.map((row) => (
            <View key={row.rank} className="gap-2 border-b p-4" style={{ borderBottomColor: hexToRgba(onSurface, 0.04) }}>
              <Text className="font-headline text-base font-bold italic" style={{ color: onSurface }}>
                {row.name}
              </Text>
              <Text className="text-xs" style={{ color: onSurfaceVariant }}>
                {row.location}
              </Text>
              <Text className="text-sm font-bold" style={{ color: primary }}>
                {row.revenue} · %{row.occupancyPct}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View>
          {header}
          {rows.map((row) => (
            <Row key={row.rank} row={row} />
          ))}
        </View>
      )}
      <Pressable className="items-center py-5">
        <Text className="font-label text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>
          Tumunu Goruntule
        </Text>
      </Pressable>
    </View>
  );
}
