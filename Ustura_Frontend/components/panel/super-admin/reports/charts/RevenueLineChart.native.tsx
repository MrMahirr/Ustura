import React from 'react';
import { View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

export interface RevenueLineChartProps {
  data: { day: number; current: number; previous: number }[];
  primary: string;
  track: string;
  height?: number;
}

export default function RevenueLineChart({
  data,
  primary,
  track,
  height = 220,
}: RevenueLineChartProps) {
  return (
    <View style={{ height, width: '100%' }}>
      <CartesianChart
        data={data}
        xKey="day"
        yKeys={['previous', 'current']}
        padding={{ left: 12, right: 12, top: 16, bottom: 8 }}
        domainPadding={{ left: 20, right: 20, top: 24, bottom: 8 }}>
        {({ points }) => (
          <>
            <Line
              points={points.previous}
              color={track}
              strokeWidth={2}
              curveType="natural"
              opacity={0.85}
            />
            <Line
              points={points.current}
              color={primary}
              strokeWidth={3}
              curveType="natural"
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
