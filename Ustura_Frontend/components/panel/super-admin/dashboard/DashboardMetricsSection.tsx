import React from 'react';
import { View } from 'react-native';

import StatsCard from '@/components/panel/StatsCard';
import type { DashboardMetric } from '@/components/panel/super-admin/data';

import { dashboardClassNames } from './presentation';

export default function DashboardMetricsSection({
  metrics,
  metricsBasis,
}: {
  metrics: DashboardMetric[];
  metricsBasis: string;
}) {
  return (
    <View className={dashboardClassNames.metricsGrid}>
      {metrics.map((metric) => (
        <View key={metric.id} className={dashboardClassNames.metricItem} style={{ width: metricsBasis as any }}>
          <StatsCard
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trendLabel={metric.trendLabel}
            trendTone={metric.trendTone}
            highlight={metric.highlight}
          />
        </View>
      ))}
    </View>
  );
}
