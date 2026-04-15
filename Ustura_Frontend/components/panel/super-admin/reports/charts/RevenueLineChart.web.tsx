import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';

export interface RevenueLineChartProps {
  data: { day: number; current: number; previous: number }[];
  primary: string;
  track: string;
  height?: number;
}

function projectPoints(
  data: RevenueLineChartProps['data'],
  width: number,
  height: number,
  key: 'current' | 'previous',
): { x: number; y: number }[] {
  if (width <= 0 || data.length === 0) return [];
  const padX = 16;
  const padY = 20;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const days = data.map((d) => d.day);
  const minDay = Math.min(...days);
  const maxDay = Math.max(...days);
  const vals = data.map((d) => d[key]);
  const minY = Math.min(...vals) * 0.92;
  const maxY = Math.max(...vals) * 1.08;
  const spanDay = maxDay - minDay || 1;
  const spanY = maxY - minY || 1;

  return data.map((d) => {
    const x = padX + ((d.day - minDay) / spanDay) * innerW;
    const y = padY + (1 - (d[key] - minY) / spanY) * innerH;
    return { x, y };
  });
}

function Segments({
  points,
  color,
  thickness,
  opacity = 1,
}: {
  points: { x: number; y: number }[];
  color: string;
  thickness: number;
  opacity?: number;
}) {
  const segs: React.ReactNode[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p = points[i]!;
    const q = points[i + 1]!;
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    segs.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          left: p.x,
          top: p.y - thickness / 2,
          width: len,
          height: thickness,
          backgroundColor: color,
          opacity,
          transform: [{ rotate: `${angle}deg` }],
          transformOrigin: '0% 50%' as any,
        }}
      />,
    );
  }
  return <>{segs}</>;
}

export default function RevenueLineChart({
  data,
  primary,
  track,
  height = 220,
}: RevenueLineChartProps) {
  const [w, setW] = React.useState(0);
  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    setW(e.nativeEvent.layout.width);
  }, []);

  const prevPts = React.useMemo(() => projectPoints(data, w, height, 'previous'), [data, w, height]);
  const curPts = React.useMemo(() => projectPoints(data, w, height, 'current'), [data, w, height]);

  return (
    <View style={{ height, width: '100%' }} onLayout={onLayout}>
      <View style={{ flex: 1, position: 'relative' }}>
        <Segments points={prevPts} color={track} thickness={2} opacity={0.85} />
        <Segments points={curPts} color={primary} thickness={3} />
      </View>
    </View>
  );
}
