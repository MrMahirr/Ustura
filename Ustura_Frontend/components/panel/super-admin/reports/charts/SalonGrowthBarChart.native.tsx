import React from 'react';
import { Text, View } from 'react-native';
import { BarGroup, CartesianChart } from 'victory-native';

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
      <View style={{ height: chartHeight, width: '100%' }}>
        <CartesianChart
          data={data}
          xKey="month"
          yKeys={['basvuru', 'onay']}
          padding={{ left: 8, right: 8, top: 12, bottom: 4 }}
          domain={{ y: [0, 100] }}
          domainPadding={{ left: 16, right: 16, top: 8, bottom: 0 }}>
          {({ chartBounds, points }) => (
            <BarGroup chartBounds={chartBounds} betweenGroupPadding={0.32} withinGroupPadding={0.12}>
              <BarGroup.Bar points={points.basvuru} color={primaryContainer} />
              <BarGroup.Bar points={points.onay} color={primary} />
            </BarGroup>
          )}
        </CartesianChart>
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
