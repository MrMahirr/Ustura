import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfileActivity } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserActivityLogCard({
  activities,
}: {
  activities: UserProfileActivity[];
}) {
  const adminTheme = useSuperAdminTheme();
  const cardShadowStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            adminTheme.theme === 'dark'
              ? '0 18px 40px rgba(0, 0, 0, 0.24)'
              : '0 18px 40px rgba(27, 27, 32, 0.08)',
        } as any)
      : {
          shadowColor: '#000000',
          shadowOpacity: adminTheme.theme === 'dark' ? 0.18 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        };

  return (
    <View
      style={[
        styles.panelCard,
        {
          backgroundColor: adminTheme.cardBackground,
          ...cardShadowStyle,
        },
      ]}>
      <Text style={[styles.panelTitleSm, { color: adminTheme.onSurface }]}>Activity Log</Text>

      <View style={styles.activityTimeline}>
        <View style={[styles.activityTimelineLine, { backgroundColor: hexToRgba(adminTheme.outlineVariant, 0.22) }]} />

        {activities.map((item) => (
          <View key={item.id} style={[styles.activityItem, item.subdued ? { opacity: 0.62 } : null]}>
            <View
              style={[
                styles.activityDot,
                {
                  backgroundColor: item.highlighted ? adminTheme.primary : adminTheme.surfaceContainerHighest,
                  borderColor: adminTheme.surface,
                  ...(item.highlighted && adminTheme.theme === 'dark'
                    ? ({ boxShadow: `0 0 8px ${hexToRgba(adminTheme.primary, 0.5)}` } as any)
                    : null),
                },
              ]}
            />
            <Text style={[styles.activityTitle, { color: adminTheme.onSurface }]}>{item.title}</Text>
            <Text style={[styles.activityDetail, { color: adminTheme.onSurfaceVariant }]}>{item.detail}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.activityFooterButton}>
        <Text style={[styles.activityFooterText, { color: adminTheme.onSurfaceVariant }]}>View All Activities</Text>
      </Pressable>
    </View>
  );
}
