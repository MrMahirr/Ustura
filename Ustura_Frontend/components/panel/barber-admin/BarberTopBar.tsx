import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Text, TextInput, View, useWindowDimensions } from 'react-native';

import BarberNotificationsMenu from '@/components/panel/barber-admin/BarberNotificationsMenu';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from './theme';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD5TG1SCRsdanIRb29jkidKaCYRyWNOCPhs0Z83ZEdB9dog7982BcNVqcyEtQxmsgtZbq61oBZegP-cGFcGHX0ytY_xwvK_kl9fziX43ZK6_VZ46u9QogUpHG0U0LT2ymLfOsynMqL4bvrkpM2lxPVl7N_FT-B3BWSELFJsgveHIjzcubvx10MszyLIdHQIPMUqktpZQZkgHzdvd6_xJHMabI3klMyEQwEuVZ3GcWZ7SA98oio9SgLAU8yjqw8OCnLYwwhbXmRK3Co';

export interface BarberTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function BarberTopBar({ query, onQueryChange }: BarberTopBarProps) {
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
            placeholder="Randevu, musteri veya personel ara..."
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
        <View className="ml-2 flex-row items-center gap-3">
          <View className="items-end">
            <Text className="font-body text-xs font-bold" style={{ color: theme.onSurface }}>
              Kemal Yilmaz
            </Text>
            <Text className="mt-0.5 font-label text-[10px]" style={{ color: theme.onSurfaceVariant, opacity: 0.85 }}>
              Salon Sahibi
            </Text>
          </View>
          <Image
            source={{ uri: AVATAR_URI }}
            style={{ width: 40, height: 40, borderRadius: 4, borderWidth: 1, borderColor: hexToRgba(theme.primary, 0.2) }}
            contentFit="cover"
          />
        </View>
      </View>
    </View>
  );
}
