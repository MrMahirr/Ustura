import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import type { GroupedSalonRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { salonGroupedStyles as styles } from './salon-grouped.styles';
import UserSalonActionButton from './UserSalonActionButton';
import UserSalonAddCard from './UserSalonAddCard';
import UserSalonMemberCard from './UserSalonMemberCard';

function getPlanBadgeColors(
  plan: GroupedSalonRecord['plan'],
  theme: ReturnType<typeof useSuperAdminTheme>
) {
  if (plan === 'Premium') {
    return {
      backgroundColor: hexToRgba(theme.primary, 0.14),
      borderColor: hexToRgba(theme.primary, 0.22),
      color: theme.primary,
    };
  }

  if (plan === 'Pro') {
    return {
      backgroundColor: hexToRgba(theme.secondary, 0.14),
      borderColor: hexToRgba(theme.secondary, 0.22),
      color: theme.onSurface,
    };
  }

  return {
    backgroundColor: theme.cardBackgroundStrong,
    borderColor: theme.borderStrong,
    color: hexToRgba(theme.onSurfaceVariant, 0.9),
  };
}

export default function UserSalonGroupSection({
  group,
  memberCardBasis,
  collapsed,
  onToggle,
  onOpenSalon,
  onAddUser,
}: {
  group: GroupedSalonRecord;
  memberCardBasis: string;
  collapsed: boolean;
  onToggle: () => void;
  onOpenSalon?: (salonId: string) => void;
  onAddUser: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const planColors = getPlanBadgeColors(group.plan, adminTheme);
  const isMutedSection = group.salonStatus === 'Beklemede' || group.salonStatus === 'Askiya Alindi';

  return (
    <View
      style={[
        styles.section,
        {
          opacity: group.salonStatus === 'Askiya Alindi' ? 0.86 : 1,
          backgroundColor: hexToRgba(adminTheme.cardBackground, 0.92),
          borderColor: adminTheme.borderSubtle,
          ...(Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(12px)',
                boxShadow:
                  adminTheme.theme === 'dark'
                    ? '0 22px 54px rgba(0, 0, 0, 0.26)'
                    : '0 22px 48px rgba(27, 27, 32, 0.08)',
                filter: isMutedSection ? 'grayscale(0.14)' : 'none',
              } as any)
            : {
                shadowColor: '#000000',
                shadowOpacity: adminTheme.theme === 'dark' ? 0.2 : 0.08,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: 7,
              }),
        },
      ]}>
      <View
        style={[
          styles.sectionHeader,
          {
            borderBottomColor: adminTheme.borderSubtle,
            backgroundColor: hexToRgba('#FFFFFF', adminTheme.theme === 'dark' ? 0.03 : 0.55),
          },
        ]}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionIdentity}>
            <View
              style={[
                styles.sectionIconFrame,
                {
                  backgroundColor: adminTheme.cardBackgroundStrong,
                  borderColor: group.plan === 'Premium' ? hexToRgba(adminTheme.primary, 0.22) : adminTheme.borderSubtle,
                },
              ]}>
              <MaterialIcons
                name="storefront"
                size={24}
                color={group.plan === 'Premium' ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.82)}
              />
            </View>

            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionTitleRow}>
                <Text style={[styles.sectionTitle, { color: adminTheme.onSurface }]} numberOfLines={1}>
                  {group.salonName}
                </Text>
                {group.plan ? (
                  <View
                    style={[
                      styles.planPill,
                      {
                        backgroundColor: planColors.backgroundColor,
                        borderColor: planColors.borderColor,
                      },
                    ]}>
                    <Text style={[styles.planPillText, { color: planColors.color }]}>{group.plan}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.sectionMetaRow}>
                <MaterialIcons name="location-on" size={14} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
                <Text style={[styles.sectionMetaText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }]}>
                  {group.salonLocation} • {group.totalUsers} Personel
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionActions}>
            <UserSalonActionButton
              icon="storefront"
              label="Salon Detayi"
              variant="secondary"
              onPress={group.salonId ? () => onOpenSalon?.(group.salonId as string) : undefined}
            />
            <UserSalonActionButton icon="add" label="Personel Ekle" variant="primary" onPress={onAddUser} />
            <UserSalonActionButton
              icon="expand-more"
              variant="icon"
              rotationDeg={collapsed ? 0 : 180}
              onPress={onToggle}
            />
          </View>
        </View>
      </View>

      {!collapsed ? (
        <View style={styles.sectionBody}>
          <View style={styles.membersGrid}>
            {group.users.map((user) => (
              <UserSalonMemberCard key={user.id} user={user} basis={memberCardBasis} />
            ))}
            <UserSalonAddCard basis={memberCardBasis} onPress={onAddUser} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
