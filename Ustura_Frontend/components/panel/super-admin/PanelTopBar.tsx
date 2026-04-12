import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Text, TextInput, View, useWindowDimensions } from 'react-native';

import NotificationsMenu from '@/components/panel/super-admin/NotificationsMenu';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCWYaMniv6v5fvJlBzzTSKt09kQNGA6YDye7v8aPsYAWHTPYcT-WhWAHjk3f6d0ni8jX6_-aAVdrNAmMorMXAIWhGgZRw9tWlucStisjiPw0wOR9wtTR5ss8VBorojbYXYONu0oOu0lh6oSKYfQapZo2ba2RCc4mLiQbbzmMf-IDT5Rn-fvXRgkNiqH8fqnZClD-cg4JJvfu5nsXDw05w3f8xT0kzo7aMPFc8k7dNyjh8bkxUTOZa2q-rpY0P5_3QP1eofWLJ3NhOs';

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
        <View className="ml-2 flex-row items-center gap-3">
          <View className="items-end">
            <Text className="font-body text-xs font-bold" style={{ color: adminTheme.onSurface }}>
              Ana Yonetici
            </Text>
            <Text className="mt-0.5 font-label text-[10px]" style={{ color: adminTheme.onSurfaceVariant, opacity: 0.85 }}>
              Sistem Yoneticisi
            </Text>
          </View>
          <Image
            source={{ uri: AVATAR_URI }}
            style={{ width: 40, height: 40, borderRadius: 4, borderWidth: 1, borderColor: hexToRgba(adminTheme.primary, 0.2) }}
            contentFit="cover"
          />
        </View>
      </View>
    </View>
  );
}
