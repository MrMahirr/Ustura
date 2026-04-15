import React from 'react';
import { Text, View } from 'react-native';

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
  centerHoleColor?: string;
  size?: number;
}

/** Web: Skia/Victory yok; CSS conic-gradient ile donut. */
export default function PackageDonutChart({
  slices,
  centerTitle,
  centerValue,
  titleColor,
  valueColor,
  centerHoleColor = '#131318',
  size = 200,
}: PackageDonutChartProps) {
  const gradient = React.useMemo(() => {
    let start = -90;
    const parts: string[] = [];
    const total = slices.reduce((s, x) => s + x.value, 0) || 1;
    for (const sl of slices) {
      const sweep = (sl.value / total) * 360;
      const end = start + sweep;
      parts.push(`${sl.color} ${start}deg ${end}deg`);
      start = end;
    }
    return `conic-gradient(from -90deg, ${parts.join(', ')})`;
  }, [slices]);

  const hole = Math.round(size * 0.52);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <View
        style={
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            // RN ViewStyle has no `background`; conic-gradient is valid on web.
            background: gradient,
          } as import('react-native').StyleProp<import('react-native').ViewStyle>
        }>
        <View
          style={{
            width: hole,
            height: hole,
            borderRadius: hole / 2,
            backgroundColor: centerHoleColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
