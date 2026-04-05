import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import type { GroupedSalonRecord } from '@/components/panel/super-admin/user-management.data';

import { userClassNames } from './presentation';
import UserSalonGroupSection from './UserSalonGroupSection';

export default function UserSalonGroupedView({
  groupedSalons,
  onOpenSalon,
  onOpenUser,
  onAddUser,
}: {
  groupedSalons: GroupedSalonRecord[];
  onOpenSalon?: (salonId: string) => void;
  onOpenUser?: (userId: string) => void;
  onAddUser?: (salonId?: string) => void;
}) {
  const { width } = useWindowDimensions();
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  const memberCardBasis = width >= 1440 ? '24%' : width >= 1040 ? '31.7%' : width >= 760 ? '48.7%' : '100%';

  return (
    <View className={userClassNames.groupedContainer}>
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
          onOpenUser={onOpenUser}
          onAddUser={() => onAddUser?.(group.salonId)}
        />
      ))}
    </View>
  );
}
