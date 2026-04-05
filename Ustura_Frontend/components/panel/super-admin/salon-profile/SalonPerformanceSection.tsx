import React from 'react';
import { View } from 'react-native';

import type { SalonProfileMetric } from '@/components/panel/super-admin/salon-profile/data';

import SalonMetricCard from './SalonMetricCard';
import { styles } from './styles';

export default function SalonPerformanceSection({
  metrics,
  metricBasis,
}: {
  metrics: SalonProfileMetric[];
  metricBasis: string;
}) {
  return (
    <View style={styles.metricsGrid}>
      {metrics.map((metric) => (
        <View key={metric.id} style={[styles.metricItem, { width: metricBasis as any }]}>
          <SalonMetricCard metric={metric} />
        </View>
      ))}
    </View>
  );
}
