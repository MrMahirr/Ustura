import React from 'react';
import { View } from 'react-native';

import ActivityChart from '@/components/panel/super-admin/ActivityChart';
import ActiveSalonList from '@/components/panel/super-admin/ActiveSalonList';
import type { ActiveSalon, ActivitySnapshot } from '@/components/panel/super-admin/data';

import { styles } from './styles';

export default function DashboardMiddleSection({
  isLg,
  snapshots,
  salons,
}: {
  isLg: boolean;
  snapshots: ActivitySnapshot[];
  salons: ActiveSalon[];
}) {
  return (
    <View style={[styles.middleGrid, { flexDirection: isLg ? 'row' : 'column' }]}>
      <View style={styles.middlePrimary}>
        <ActivityChart snapshots={snapshots} />
      </View>
      <View style={styles.middleSecondary}>
        <ActiveSalonList salons={salons} />
      </View>
    </View>
  );
}
