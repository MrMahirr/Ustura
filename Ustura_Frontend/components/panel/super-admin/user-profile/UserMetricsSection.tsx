import React from 'react';
import { View } from 'react-native';

import type { UserProfileMetric } from '@/components/panel/super-admin/user-profile/data';

import UserMetricCard from './UserMetricCard';
import { styles } from './styles';

export default function UserMetricsSection({
  metrics,
  metricBasis,
}: {
  metrics: UserProfileMetric[];
  metricBasis: string;
}) {
  return (
    <View style={styles.metricsGrid}>
      {metrics.map((metric) => (
        <UserMetricCard key={metric.id} metric={metric} basis={metricBasis} />
      ))}
    </View>
  );
}
