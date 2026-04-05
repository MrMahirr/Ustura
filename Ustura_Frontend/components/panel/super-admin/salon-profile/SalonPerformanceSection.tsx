import React from 'react';
import { View } from 'react-native';

import type { SalonProfileMetric } from '@/components/panel/super-admin/salon-profile/data';

import SalonMetricCard from './SalonMetricCard';

export default function SalonPerformanceSection({
  metrics,
  metricBasis,
}: {
  metrics: SalonProfileMetric[];
  metricBasis: string;
}) {
  return (
    <View className="flex-row flex-wrap gap-[14px]">
      {metrics.map((metric) => (
        <View key={metric.id} className="min-w-[180px]" style={{ width: metricBasis as any }}>
          <SalonMetricCard metric={metric} />
        </View>
      ))}
    </View>
  );
}
