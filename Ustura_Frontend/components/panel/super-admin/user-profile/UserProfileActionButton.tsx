import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserProfileActionButton({
  icon,
  label,
  variant = 'secondary',
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  variant?: 'secondary' | 'danger';
  onPress?: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.actionButton,
        {
          backgroundColor:
            variant === 'danger'
              ? hovered
                ? hexToRgba(adminTheme.error, 0.18)
                : hexToRgba(adminTheme.error, 0.12)
              : hovered
                ? adminTheme.cardBackgroundStrong
                : adminTheme.surfaceContainerHighest,
          borderColor:
            variant === 'danger'
              ? hexToRgba(adminTheme.error, 0.18)
              : hovered
                ? adminTheme.borderStrong
                : adminTheme.borderSubtle,
          transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
        },
      ]}>
      <View style={styles.actionButtonInner}>
        <MaterialIcons
          name={icon}
          size={18}
          color={variant === 'danger' ? adminTheme.error : adminTheme.onSurface}
        />
        <Text
          style={[
            styles.actionButtonText,
            { color: variant === 'danger' ? adminTheme.error : adminTheme.onSurface },
          ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
