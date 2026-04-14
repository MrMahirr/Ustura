import React from 'react';
import { Text, View } from 'react-native';

import { MONTH_SHORT_TR } from '../fixtures';

export interface SalonGrowthBarChartProps {
  data: { month: number; basvuru: number; onay: number }[];
  primary: string;
  primaryContainer: string;
  height?: number;
}

export default function SalonGrowthBarChart({
  data,
  primary,
  primaryContainer,
  height = 200,
}: SalonGrowthBarChartProps) {
  const chartHeight = Math.max(120, height - 22);
  return (
    <View style={{ width: '100%' }}>
      <View className="flex-row gap-1" style={{ height: chartHeight, alignItems: 'flex-end' }}>
        {data.map((d) => (
          <View
            key={d.month}
            className="min-w-0 flex-1 flex-row items-end justify-center gap-0.5"
            style={{ height: '100%', alignSelf: 'stretch' }}>
            <View
              style={{
                flex: 1,
                height: `${d.basvuru}%`,
                minHeight: 4,
                backgroundColor: primaryContainer,
              }}
            />
            <View
              style={{
                flex: 1,
                height: `${d.onay}%`,
                minHeight: 4,
                backgroundColor: primary,
              }}
            />
          </View>
        ))}
      </View>
      <View className="mt-1 flex-row justify-between px-0.5">
        {data.map((d) => (
          <Text
            key={d.month}
            className="font-label text-[10px] font-bold uppercase"
            style={{ color: primary, opacity: 0.45 }}>
            {MONTH_SHORT_TR[d.month] ?? String(d.month)}
          </Text>
        ))}
      </View>
    </View>
  );
}
