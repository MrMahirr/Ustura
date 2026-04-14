import React from 'react';
import { Text, View } from 'react-native';
import { PolarChart, Pie } from 'victory-native';

export interface PackageSlice {
  label: string;
  value: number;
  color: string;
}

export interface PackageDonutChartProps {
  slices: PackageSlice[];
  centerTitle: string;
  centerValue: string;
  titleColor: string;
  valueColor: string;
  /** Native: unused. Web: donut delik rengi (kart zemini). */
  centerHoleColor?: string;
  size?: number;
}

export default function PackageDonutChart({
  slices,
  centerTitle,
  centerValue,
  titleColor,
  valueColor,
  size = 200,
}: PackageDonutChartProps) {
  const data = React.useMemo(
    () =>
      slices.map((s) => ({
        label: s.label,
        value: s.value,
        color: s.color,
      })),
    [slices],
  );

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        <PolarChart data={data} labelKey="label" valueKey="value" colorKey="color">
          <Pie.Chart innerRadius="52%" startAngle={-90} />
        </PolarChart>
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
          style={{ width: size, height: size }}>
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: titleColor }}>
            {centerTitle}
          </Text>
          <Text className="mt-0.5 font-headline text-xl font-bold" style={{ color: valueColor }}>
            {centerValue}
          </Text>
        </View>
      </View>
    </View>
  );
}
