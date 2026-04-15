import React from 'react';
import { Text, View } from 'react-native';

import type { BarberStaffRecord } from './data';
import {
  barberAdminClassNames,
  getBarberPanelShadow,
} from './presentation';
import { useBarberAdminTheme } from './theme';
import BarberStaffStatusCard from './BarberStaffStatusCard';

export default function StaffStatusPanel({
  staff,
}: {
  staff: BarberStaffRecord[];
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className={`${barberAdminClassNames.panelSection} px-5 py-5 md:px-6 md:py-6`}
      style={{
        backgroundColor: theme.panelBackground,
        borderColor: theme.borderSubtle,
        ...getBarberPanelShadow(theme),
      }}>
      <View className={barberAdminClassNames.panelHeader}>
        <Text
          className="font-headline text-[28px]"
          style={{ color: theme.onSurface, fontFamily: 'NotoSerif-Bold' }}>
          Personel Durumu
        </Text>
      </View>

      <View className={barberAdminClassNames.staffList}>
        {staff.map((member) => (
          <BarberStaffStatusCard key={member.id} staff={member} />
        ))}
      </View>
    </View>
  );
}
