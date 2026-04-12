import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import SalonRequestDrawer from '@/components/panel/super-admin/salon-requests/SalonRequestDrawer';
import SalonRequestsFilters from '@/components/panel/super-admin/salon-requests/SalonRequestsFilters';
import SalonRequestsPageHeader from '@/components/panel/super-admin/salon-requests/SalonRequestsPageHeader';
import SalonRequestsStatsRow from '@/components/panel/super-admin/salon-requests/SalonRequestsStatsRow';
import SalonRequestsTable from '@/components/panel/super-admin/salon-requests/SalonRequestsTable';
import { salonRequestClassNames } from '@/components/panel/super-admin/salon-requests/presentation';
import { useSalonRequests } from '@/components/panel/super-admin/salon-requests/use-salon-requests';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function SuperAdminSalonRequests() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const requests = useSalonRequests();

  const isWide = width >= 1100;
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
      className={salonRequestClassNames.page}
      style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar
        query={requests.query}
        onQueryChange={requests.setQuery}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={salonRequestClassNames.content}>
          <SalonRequestsPageHeader isWide={isWide} />

          <SalonRequestsStatsRow stats={requests.stats} />

          <SalonRequestsFilters
            statusFilter={requests.statusFilter}
            cityFilter={requests.cityFilter}
            cities={requests.cities}
            onStatusChange={requests.setStatusFilter}
            onCityChange={requests.setCityFilter}
          />

          <SalonRequestsTable
            items={requests.filteredItems}
            selectedId={requests.selectedId}
            isLoading={requests.isLoading}
            errorMessage={requests.errorMessage}
            onSelect={requests.setSelectedId}
            onRetry={requests.reload}
          />
        </View>
      </ScrollView>

      {requests.selectedItem && requests.selectedRaw ? (
        <SalonRequestDrawer
          item={requests.selectedItem}
          raw={requests.selectedRaw}
          onClose={() => requests.setSelectedId(null)}
          onApprove={requests.handleApprove}
          onReject={requests.handleReject}
          mutating={requests.mutating}
        />
      ) : null}
    </View>
  );
}
