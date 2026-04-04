import React from 'react';
import { View } from 'react-native';

import StatsCard from '@/components/panel/StatsCard';
import type { DashboardMetric } from '@/components/panel/super-admin/data';

import { styles } from './styles';

export default function DashboardMetricsSection({
  metrics,
  metricsBasis,
}: {
  metrics: DashboardMetric[];
  metricsBasis: string;
}) {
  return (
    <View style={styles.metricsGrid}>
      {metrics.map((metric) => (
        <View key={metric.id} style={[styles.metricItem, { width: metricsBasis as any }]}>
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
