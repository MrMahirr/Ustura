import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import ReservationTable from '@/components/panel/ReservationTable';
import StatsCard from '@/components/panel/StatsCard';
import ActivityChart from '@/components/panel/super-admin/ActivityChart';
import ActiveSalonList from '@/components/panel/super-admin/ActiveSalonList';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import PendingApprovalsPanel from '@/components/panel/super-admin/PendingApprovalsPanel';
import RecentSalonsPanel from '@/components/panel/super-admin/RecentSalonsPanel';
import SystemLogsPanel from '@/components/panel/super-admin/SystemLogsPanel';
import {
  activeSalons,
  activitySnapshots,
  approvalRequests,
  dashboardMetrics,
  logEntries,
  recentAppointments,
  recentSalons,
} from '@/components/panel/super-admin/data';
import Button from '@/components/ui/Button';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';
import { matchesQuery } from '@/utils/matches-query';

import { useSuperAdminTheme } from './theme';

export default function SuperAdminDashboard() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = React.useState('');

  const adminTheme = useSuperAdminTheme();

  const isLg = width >= 1240;
  const paddingH = width < 768 ? 16 : 32;
  const metricsBasis = width >= 1440 ? '15.5%' : width >= 1024 ? '31%' : width >= 640 ? '47.5%' : '100%';

  const filteredActiveSalons = activeSalons.filter((salon) => matchesQuery(query, [salon.name, salon.appointments]));
  const filteredAppointments = recentAppointments.filter((appointment) =>
    matchesQuery(query, [appointment.salon, appointment.user, appointment.barber, appointment.time, appointment.status])
  );
  const filteredRecentSalons = recentSalons.filter((salon) => matchesQuery(query, [salon.name, salon.addedAt]));
  const filteredApprovals = approvalRequests.filter((approval) =>
    matchesQuery(query, [approval.name, approval.summary, approval.status])
  );

  return (
    <View style={[styles.page, { backgroundColor: adminTheme.pageBackground }]}>
      <View
        style={[
          styles.gridOverlay,
          Platform.OS === 'web'
            ? ({
                backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
              } as any)
            : null,
        ]}
      />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.headerSection, { flexDirection: isLg ? 'row' : 'column', alignItems: isLg ? 'flex-end' : 'flex-start' }]}>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: adminTheme.onSurface }]}>Platform Genel Bakis</Text>
              <Text style={[styles.description, { color: adminTheme.onSurfaceVariant }]}>
                Sistem genelindeki operasyonel veriler, abone performansi ve teknik loglarin canli takibi.
              </Text>
            </View>

            <View style={[styles.headerActions, { width: isLg ? 'auto' : '100%' }]}>
              <Pressable
                style={({ hovered }) => [
                  styles.secondaryCta,
                  {
                    backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundMuted,
                    marginRight: isLg ? 14 : 0,
                    marginBottom: isLg ? 0 : 12,
                    width: isLg ? 'auto' : '100%',
                  },
                ]}>
                <Text style={[styles.secondaryCtaText, { color: adminTheme.onSurface }]}>Raporu Indir</Text>
              </Pressable>
              <Button
                title="Yeni Salon Ekle"
                interactionPreset="cta"
                icon="add-business"
                style={isLg ? undefined : { width: '100%' }}
              />
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {dashboardMetrics.map((metric) => (
              <View key={metric.id} style={[styles.metricItem, { width: metricsBasis as any }]}>
                <StatsCard
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  trendLabel={metric.trendLabel}
                  trendTone={metric.trendTone}
                  highlight={metric.highlight}
                />
              </View>
            ))}
          </View>

          <View style={[styles.middleGrid, { flexDirection: isLg ? 'row' : 'column' }]}>
            <View style={styles.middlePrimary}>
              <ActivityChart snapshots={activitySnapshots} />
            </View>
            <View style={styles.middleSecondary}>
              <ActiveSalonList salons={filteredActiveSalons} />
            </View>
          </View>

          <ReservationTable rows={filteredAppointments} />

          <View style={[styles.bottomGrid, { flexDirection: width >= 1200 ? 'row' : 'column' }]}>
            <RecentSalonsPanel salons={filteredRecentSalons} />
            <PendingApprovalsPanel approvals={filteredApprovals} />
            <SystemLogsPanel logs={logEntries} />
          </View>

          <View style={[styles.footerRule, { borderTopColor: adminTheme.borderSubtle }]} />
          <Text style={[styles.footer, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.45) }]}>
            Copyright 2026 USTURA SaaS Enterprise Platform. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: Platform.OS === 'web' ? 1 : 0,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  } as any,
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    gap: 36,
  },
  headerSection: {
    justifyContent: 'space-between',
    gap: 20,
  },
  headerCopy: {
    flex: 1,
    maxWidth: 640,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 36,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  description: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Regular',
    fontWeight: '300',
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  secondaryCta: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any) : {}),
  },
  secondaryCtaText: {
    ...Typography.labelMd,
    fontSize: 11,
    fontFamily: 'Manrope-Bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metricItem: {
    minWidth: 160,
  },
  middleGrid: {
    gap: 24,
  },
  middlePrimary: {
    flex: 1.85,
    minWidth: 0,
  },
  middleSecondary: {
    flex: 1,
    minWidth: 0,
  },
  bottomGrid: {
    gap: 24,
    alignItems: 'stretch',
  },
  footerRule: {
    borderTopWidth: 1,
    marginTop: 8,
  },
  footer: {
    ...Typography.labelSm,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    paddingBottom: 8,
  },
});
