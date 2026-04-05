import React from 'react';
import { View } from 'react-native';

import ActivityChart from '@/components/panel/super-admin/ActivityChart';
import ActiveSalonList from '@/components/panel/super-admin/ActiveSalonList';
import type { ActiveSalon, ActivitySnapshot } from '@/components/panel/super-admin/data';
import { cn } from '@/utils/cn';

import { dashboardClassNames } from './presentation';

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
    <View className={cn(dashboardClassNames.middleGrid, isLg ? 'flex-row' : 'flex-col')}>
      <View className="min-w-0" style={{ flex: 1.85 }}>
        <ActivityChart snapshots={snapshots} />
      </View>
      <View className="min-w-0 flex-1">
        <ActiveSalonList salons={salons} />
      </View>
    </View>
  );
}
