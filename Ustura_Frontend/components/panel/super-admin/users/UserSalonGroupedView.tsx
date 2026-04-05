import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import type { GroupedSalonRecord } from '@/components/panel/super-admin/user-management.data';

import { salonGroupedStyles as styles } from './salon-grouped.styles';
import UserSalonGroupSection from './UserSalonGroupSection';

export default function UserSalonGroupedView({
  groupedSalons,
  onOpenSalon,
  onAddUser,
}: {
  groupedSalons: GroupedSalonRecord[];
  onOpenSalon?: (salonId: string) => void;
  onAddUser?: (salonId?: string) => void;
}) {
  const { width } = useWindowDimensions();
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  const memberCardBasis = width >= 1440 ? '24%' : width >= 1040 ? '31.7%' : width >= 760 ? '48.7%' : '100%';

  return (
    <View style={styles.container}>
      {groupedSalons.map((group) => (
        <UserSalonGroupSection
          key={group.id}
          group={group}
          memberCardBasis={memberCardBasis}
          collapsed={Boolean(collapsedGroups[group.id])}
          onToggle={() =>
            setCollapsedGroups((current) => ({
              ...current,
              [group.id]: !current[group.id],
            }))
          }
          onOpenSalon={onOpenSalon}
          onAddUser={() => onAddUser?.(group.salonId)}
        />
      ))}
    </View>
  );
}
