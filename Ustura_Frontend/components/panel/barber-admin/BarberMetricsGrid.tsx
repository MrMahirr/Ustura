import React from 'react';
import { View } from 'react-native';

import type { BarberDashboardMetric } from './data';
import BarberMetricCard from './BarberMetricCard';
import { barberAdminClassNames } from './presentation';

export default function BarberMetricsGrid({
  metrics,
  columns,
}: {
  metrics: BarberDashboardMetric[];
  columns: 1 | 2 | 4;
}) {
  const rowWrapClass =
    columns === 4
      ? 'flex-row flex-wrap'
      : columns === 2
        ? 'flex-row flex-wrap'
        : 'flex-col';
  const basis =
    columns === 4 ? '24%' : columns === 2 ? '48.7%' : '100%';

  return (
    <View className={`${barberAdminClassNames.metricGrid} ${rowWrapClass}`}>
      {metrics.map((metric) => (
        <View key={metric.id} style={{ width: basis as any }}>
          <BarberMetricCard metric={metric} />
        </View>
      ))}
    </View>
  );
}
