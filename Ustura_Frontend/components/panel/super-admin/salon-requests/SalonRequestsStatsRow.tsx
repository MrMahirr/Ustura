import React from 'react';
import { Platform, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import {
  SALON_REQUEST_COPY,
  salonRequestClassNames,
} from './presentation';
import type { SalonRequestStats } from './types';

interface StatCardProps {
  label: string;
  value: number;
  borderColor: string;
  pulse?: boolean;
}

function StatCard({ label, value, borderColor, pulse }: StatCardProps) {
  const t = useSuperAdminTheme();

  return (
    <View
      className={salonRequestClassNames.statCard}
      style={{
        backgroundColor: t.pageBackgroundAccent,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
      }}>
      <Text
        className={salonRequestClassNames.statLabel}
        style={{ color: t.onSurfaceVariant, marginBottom: 8 }}>
        {label}
      </Text>
      <View className="flex-row items-end justify-between">
        <Text
          className={salonRequestClassNames.statValue}
          style={{ color: t.onSurface }}>
          {value}
        </Text>
        {pulse ? (
          <View
            style={[
              {
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: borderColor,
                marginBottom: 8,
              },
              Platform.OS === 'web'
                ? ({ animation: 'pulse 2s infinite' } as any)
                : null,
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

export default function SalonRequestsStatsRow({
  stats,
}: {
  stats: SalonRequestStats;
}) {
  const t = useSuperAdminTheme();

  return (
    <View className={salonRequestClassNames.statsGrid}>
      <StatCard
        label={SALON_REQUEST_COPY.totalLabel}
        value={stats.total}
        borderColor={t.primary}
      />
      <StatCard
        label={SALON_REQUEST_COPY.pendingLabel}
        value={stats.pending}
        borderColor={t.warning}
        pulse
      />
      <StatCard
        label={SALON_REQUEST_COPY.todayLabel}
        value={stats.todayCount}
        borderColor="#3b82f6"
      />
      <StatCard
        label={SALON_REQUEST_COPY.approvedWeekLabel}
        value={stats.approvedThisWeek}
        borderColor={t.success}
      />
      <StatCard
        label={SALON_REQUEST_COPY.rejectedLabel}
        value={stats.rejected}
        borderColor={t.error}
      />
    </View>
  );
}
