import React from 'react';
import { View } from 'react-native';

import PendingApprovalsPanel from '@/components/panel/super-admin/PendingApprovalsPanel';
import RecentSalonsPanel from '@/components/panel/super-admin/RecentSalonsPanel';
import SystemLogsPanel from '@/components/panel/super-admin/SystemLogsPanel';
import type { ApprovalRequest, LogEntry, RecentSalon } from '@/components/panel/super-admin/data';

import { styles } from './styles';

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
    <View style={[styles.bottomGrid, { flexDirection: isRowLayout ? 'row' : 'column' }]}>
      <RecentSalonsPanel salons={salons} />
      <PendingApprovalsPanel approvals={approvals} />
      <SystemLogsPanel logs={logs} />
    </View>
  );
}
