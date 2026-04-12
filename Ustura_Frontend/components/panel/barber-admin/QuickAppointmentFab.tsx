import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable } from 'react-native';

import { barberAdminClassNames, getInteractiveWebStyle } from './presentation';
import { useBarberAdminTheme } from './theme';

export default function QuickAppointmentFab() {
  const theme = useBarberAdminTheme();

  return (
    <Pressable
      className={barberAdminClassNames.fab}
      style={({ hovered, pressed }) => [
        {
          transform: [{ scale: pressed ? 0.96 : hovered ? 1.06 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              ...getInteractiveWebStyle(),
              boxShadow: `0 20px 50px rgba(230, 195, 100, 0.30)`,
            } as any)
          : null,
      ]}>
      <LinearGradient
        colors={theme.goldGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons name="add" size={30} color={theme.onPrimary} />
      </LinearGradient>
    </Pressable>
  );
}
