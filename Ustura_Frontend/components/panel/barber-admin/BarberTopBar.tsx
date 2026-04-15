import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, TextInput, View, useWindowDimensions } from 'react-native';

import BarberNotificationsMenu from '@/components/panel/barber-admin/BarberNotificationsMenu';
import UserAccountMenu from '@/components/panel/shared/UserAccountMenu';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { staffRoutes } from '@/constants/routes';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from './theme';

export interface BarberTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
}

export default function BarberTopBar({
  query,
  onQueryChange,
  placeholder = 'Randevu, musteri veya personel ara...',
}: BarberTopBarProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();

  const headerChrome = [
    {
      backgroundColor: Platform.OS === 'web' ? theme.topBarBackground : theme.surface,
      borderBottomColor: theme.borderSubtle,
    },
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any)
      : null,
  ];

  return (
    <View
      className="z-40 min-h-16 flex-row flex-wrap items-center justify-between gap-4 border-b px-6 py-3"
      style={headerChrome}>
      <View className="min-w-[200px] grow" style={{ maxWidth: width < 768 ? undefined : 560, flex: width < 768 ? undefined : 1 }}>
        <View className="min-h-10 flex-row items-center rounded-sm pl-3 pr-[14px]" style={{ backgroundColor: theme.searchBackground }}>
          <MaterialIcons name="search" size={20} color={theme.onSurfaceVariant} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder={placeholder}
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.65)}
            selectionColor={theme.primary}
            className="flex-1 font-body text-sm"
            style={[
              { color: theme.onSurface, paddingVertical: Platform.OS === 'web' ? 8 : 6 },
              Platform.OS === 'web'
                ? ({
                    outlineWidth: 0,
                    outlineStyle: 'none',
                    borderWidth: 0,
                  } as any)
                : null,
            ]}
          />
        </View>
      </View>

      <View className="shrink-0 flex-row items-center gap-5">
        <ThemeToggleButton />
        <BarberNotificationsMenu />
        <View className="ml-2">
          <UserAccountMenu
            profileHref={staffRoutes.ayarlar}
            palette={{
              theme: theme.theme,
              cardBackground: theme.cardBackground,
              cardBackgroundMuted: theme.cardBackgroundMuted,
              borderSubtle: theme.borderSubtle,
              onSurface: theme.onSurface,
              onSurfaceVariant: theme.onSurfaceVariant,
              primary: theme.primary,
              error: theme.error,
            }}
          />
        </View>
      </View>
    </View>
  );
}
