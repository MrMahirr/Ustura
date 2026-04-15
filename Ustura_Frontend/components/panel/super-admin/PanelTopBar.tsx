import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, TextInput, View, useWindowDimensions } from 'react-native';

import NotificationsMenu from '@/components/panel/super-admin/NotificationsMenu';
import UserAccountMenu from '@/components/panel/shared/UserAccountMenu';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { panelRoutes } from '@/constants/routes';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export interface PanelTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function PanelTopBar({ query, onQueryChange }: PanelTopBarProps) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();

  const headerChrome = [
    {
      backgroundColor: Platform.OS === 'web' ? adminTheme.topBarBackground : adminTheme.surface,
      borderBottomColor: adminTheme.borderSubtle,
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
        <View className="min-h-10 flex-row items-center rounded-sm pl-3 pr-[14px]" style={{ backgroundColor: adminTheme.searchBackground }}>
          <MaterialIcons name="search" size={20} color={adminTheme.onSurfaceVariant} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Salon, kullanici veya islem ara..."
            placeholderTextColor={hexToRgba(adminTheme.onSurfaceVariant, 0.65)}
            selectionColor={adminTheme.primary}
            className="flex-1 font-body text-sm"
            style={[
              { color: adminTheme.onSurface, paddingVertical: Platform.OS === 'web' ? 8 : 6 },
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
        <NotificationsMenu />
        <View className="ml-2">
          <UserAccountMenu
            profileHref={panelRoutes.ayarlar}
            palette={{
              theme: adminTheme.theme,
              cardBackground: adminTheme.cardBackground,
              cardBackgroundMuted: adminTheme.cardBackgroundMuted,
              borderSubtle: adminTheme.borderSubtle,
              onSurface: adminTheme.onSurface,
              onSurfaceVariant: adminTheme.onSurfaceVariant,
              primary: adminTheme.primary,
              error: adminTheme.error,
            }}
          />
        </View>
      </View>
    </View>
  );
}
