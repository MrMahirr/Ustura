import React from 'react';
import { View } from 'react-native';

import PendingApprovalsPanel from '@/components/panel/super-admin/PendingApprovalsPanel';
import RecentSalonsPanel from '@/components/panel/super-admin/RecentSalonsPanel';
import SystemLogsPanel from '@/components/panel/super-admin/SystemLogsPanel';
import type { ApprovalRequest, LogEntry, RecentSalon } from '@/components/panel/super-admin/data';
import { cn } from '@/utils/cn';

import { dashboardClassNames } from './presentation';

export default function DashboardBottomPanels({
  isRowLayout,
  salons,
  approvals,
  logs,
}: {
  isRowLayout: boolean;
  salons: RecentSalon[];
  approvals: ApprovalRequest[];
  logs: LogEntry[];
}) {
  return (
    <View className={cn(dashboardClassNames.bottomGrid, isRowLayout ? 'flex-row' : 'flex-col')}>
      <RecentSalonsPanel salons={salons} />
      <PendingApprovalsPanel approvals={approvals} />
      <SystemLogsPanel logs={logs} />
    </View>
  );
}
