import React from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import ReportsAppBar from './reports/ReportsAppBar';
import ReportsGrowthGeo from './reports/ReportsGrowthGeo';
import ReportsHeatmapSection from './reports/ReportsHeatmapSection';
import ReportsKpiSection from './reports/ReportsKpiSection';
import { reportsClassNames } from './reports/presentation';
import ReportsRevenuePanels from './reports/ReportsRevenuePanels';
import ReportsSystemLiveSection from './reports/ReportsSystemLiveSection';
import ReportsTopSalonsSection from './reports/ReportsTopSalonsSection';
import type { ReportKpi, TopSalonRow } from './reports/types';
import { useReportDashboard } from './reports/use-report-dashboard';

function mapKpisFromApi(
  kpis: {
    id: string;
    label: string;
    valueFormatted: string;
    deltaLabel: string;
    deltaPositive: boolean;
    progress: number;
    accent: ReportKpi['accent'];
  }[],
): ReportKpi[] {
  return kpis.map((k) => ({
    id: k.id,
    label: k.label,
    value: k.valueFormatted,
    deltaLabel: k.deltaLabel,
    deltaPositive: k.deltaPositive,
    progress: k.progress,
    accent: k.accent,
  }));
}

function mapTopSalonsFromApi(
  rows: {
    rank: number;
    name: string;
    location: string;
    revenueFormatted: string;
    occupancyPct: number;
    rating: string;
    status: TopSalonRow['status'];
  }[],
): TopSalonRow[] {
  return rows.map((r) => ({
    rank: r.rank,
    name: r.name,
    location: r.location,
    revenue: r.revenueFormatted,
    occupancyPct: r.occupancyPct,
    rating: r.rating,
    status: r.status,
  }));
}

export default function SuperAdminReports() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const outlineAccent = adminTheme.onSurfaceVariant;
  const [query, setQuery] = React.useState('');
  const { period, setPeriod, dashboard, isLoading, error, refresh } = useReportDashboard('month');

  const paddingH = width < 768 ? 16 : 32;
  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as const)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  return (
    <View className={reportsClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}>
        <ReportsAppBar
          period={period}
          onPeriodChange={setPeriod}
          primary={adminTheme.primary}
          onSurface={adminTheme.onSurface}
          onSurfaceVariant={adminTheme.onSurfaceVariant}
          surfaceContainerLowest={adminTheme.surfaceContainerLowest}
          surfaceContainerHighest={adminTheme.surfaceContainerHighest}
          topBarBackground={adminTheme.topBarBackground}
          borderSubtle={adminTheme.borderSubtle}
        />

        <View className={reportsClassNames.content} style={{ paddingHorizontal: paddingH, paddingTop: 24, gap: 28 }}>
          <View>
            <Text className="font-headline text-[34px] font-bold tracking-tight" style={{ color: adminTheme.onSurface }}>
              Raporlar
            </Text>
            <Text className="font-body mt-2 max-w-[720px] text-base" style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
              Platform geliri, salon buyumesi ve operasyonel saglik metriklerinin ozeti. Veriler canli API uzerinden yuklenir.
            </Text>
          </View>

          {isLoading && !dashboard ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color={adminTheme.primary} />
            </View>
          ) : null}

          {error && !dashboard ? (
            <View
              className="rounded-sm p-5"
              style={{ backgroundColor: adminTheme.surfaceContainerLow, borderLeftWidth: 4, borderLeftColor: adminTheme.error }}>
              <Text className="font-body text-sm" style={{ color: adminTheme.onSurface }}>
                {error}
              </Text>
              <Pressable onPress={() => void refresh()} className="mt-3 self-start">
                <Text className="font-label text-xs font-bold uppercase" style={{ color: adminTheme.primary }}>
                  Tekrar dene
                </Text>
              </Pressable>
            </View>
          ) : null}

          {dashboard ? (
            <>
              <ReportsKpiSection
                items={mapKpisFromApi(dashboard.kpis)}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                primary={adminTheme.primary}
                primaryContainer={adminTheme.primaryContainer}
                outline={outlineAccent}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
              />

              <ReportsRevenuePanels
                revenueSeries={dashboard.revenueSeries}
                revenueXLabels={dashboard.revenueXLabels}
                packageShare={dashboard.packageShare}
                primary={adminTheme.primary}
                primaryContainer={adminTheme.primaryContainer}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                surfaceContainerHighest={adminTheme.surfaceContainerHighest}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
              />

              <ReportsGrowthGeo
                salonGrowth={dashboard.salonGrowth}
                cities={dashboard.cities}
                primary={adminTheme.primary}
                primaryContainer={adminTheme.primaryContainer}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                surfaceContainerHighest={adminTheme.surfaceContainerHighest}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
              />

              <ReportsHeatmapSection
                heatmapLevels={dashboard.heatmap}
                hourly={dashboard.hourly}
                primary={adminTheme.primary}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                surfaceContainerHighest={adminTheme.surfaceContainerHighest}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
              />

              <ReportsTopSalonsSection
                rows={mapTopSalonsFromApi(dashboard.topSalons)}
                primary={adminTheme.primary}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
                surfaceContainerLowest={adminTheme.surfaceContainerLowest}
              />

              <ReportsSystemLiveSection
                feed={dashboard.liveFeed}
                system={dashboard.system}
                primary={adminTheme.primary}
                success={adminTheme.success}
                error={adminTheme.error}
                onSurface={adminTheme.onSurface}
                onSurfaceVariant={adminTheme.onSurfaceVariant}
                surfaceContainerHighest={adminTheme.surfaceContainerHighest}
                surfaceContainerLow={adminTheme.surfaceContainerLow}
              />
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
