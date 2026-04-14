import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import LogDetailModal from './logs/LogDetailModal';
import LogFilters from './logs/LogFilters';
import LogListSection from './logs/LogListSection';
import LogPageHeader from './logs/LogPageHeader';
import LogStatsRow from './logs/LogStatsRow';
import { logClassNames } from './logs/presentation';
import type { LogListItem } from './logs/types';
import { useLogManagement } from './logs/use-log-management';

export default function SuperAdminLogs() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const mgmt = useLogManagement();

  const [selectedLog, setSelectedLog] = React.useState<LogListItem | null>(null);

  const isWide = width >= 1080;
  const useDesktopTable = width >= 1180;
  const paddingH = width < 768 ? 16 : 32;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  return (
    <View
      className={logClassNames.page}
      style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={mgmt.query} onQueryChange={mgmt.setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={logClassNames.content}>
          <LogPageHeader isWide={isWide} />

          <LogStatsRow overview={mgmt.overview} />

          <LogFilters
            selectedActionLabel={mgmt.selectedActionLabel}
            selectedEntityLabel={mgmt.selectedEntityLabel}
            actionOptions={mgmt.actionFilterOptions}
            entityOptions={mgmt.entityFilterOptions}
            onActionChange={mgmt.onActionFilterChange}
            onEntityChange={mgmt.onEntityFilterChange}
            onReset={mgmt.resetFilters}
          />

          <LogListSection
            logs={mgmt.logItems}
            filteredLogsCount={mgmt.total}
            page={mgmt.page}
            totalPages={mgmt.totalPages}
            startRow={mgmt.startRow}
            endRow={mgmt.endRow}
            useDesktopTable={useDesktopTable}
            isLoading={mgmt.isLoading}
            error={mgmt.error}
            onPageChange={mgmt.setPage}
            onRetry={mgmt.refresh}
            onLogPress={setSelectedLog}
          />
        </View>
      </ScrollView>

      <LogDetailModal
        log={selectedLog}
        visible={selectedLog != null}
        onClose={() => setSelectedLog(null)}
      />
    </View>
  );
}
