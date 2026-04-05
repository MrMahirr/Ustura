import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { salonGroupedStyles as styles } from './salon-grouped.styles';

export default function UserSalonAddCard({
  basis,
  onPress,
}: {
  basis: string;
  onPress: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Yeni uye ekle"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.addCard,
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
        {
          width: basis as any,
          borderColor: hovered ? hexToRgba(adminTheme.primary, 0.38) : adminTheme.borderSubtle,
          backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.04) : 'transparent',
          transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
        },
      ]}>
      {({ hovered }) => (
        <>
          <View
            style={[
              styles.addCardIconWrap,
              { backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.12) : adminTheme.cardBackground },
            ]}>
            <MaterialIcons
              name="person-add"
              size={24}
              color={hovered ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.82)}
            />
          </View>
          <Text style={[styles.addCardText, { color: hovered ? adminTheme.onSurface : adminTheme.onSurfaceVariant }]}>
            Yeni Uye
          </Text>
        </>
      )}
    </Pressable>
  );
}
