import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import NotificationsMenu from '@/components/panel/super-admin/NotificationsMenu';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCWYaMniv6v5fvJlBzzTSKt09kQNGA6YDye7v8aPsYAWHTPYcT-WhWAHjk3f6d0ni8jX6_-aAVdrNAmMorMXAIWhGgZRw9tWlucStisjiPw0wOR9wtTR5ss8VBorojbYXYONu0oOu0lh6oSKYfQapZo2ba2RCc4mLiQbbzmMf-IDT5Rn-fvXRgkNiqH8fqnZClD-cg4JJvfu5nsXDw05w3f8xT0kzo7aMPFc8k7dNyjh8bkxUTOZa2q-rpY0P5_3QP1eofWLJ3NhOs';

function TopBarIconButton({
  icon,
  onPress,
  showIndicator,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
  showIndicator?: boolean;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      style={styles.iconButton}>
      {({ hovered }) => (
        <>
          <MaterialIcons
            name={icon}
            size={22}
            color={hovered ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.75)}
          />
          {showIndicator ? (
            <View
              style={[
                styles.iconIndicator,
                { backgroundColor: adminTheme.primary, borderColor: adminTheme.surface },
              ]}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export interface PanelTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function PanelTopBar({ query, onQueryChange }: PanelTopBarProps) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();

  const headerChrome = [
    styles.header,
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
    <View style={headerChrome}>
      <View style={[styles.searchWrap, { maxWidth: width < 768 ? undefined : 560, flex: width < 768 ? undefined : 1 }]}>
        <View style={[styles.searchInner, { backgroundColor: adminTheme.searchBackground }]}>
          <MaterialIcons name="search" size={20} color={adminTheme.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Salon, kullanici veya islem ara..."
            placeholderTextColor={hexToRgba(adminTheme.onSurfaceVariant, 0.65)}
            selectionColor={adminTheme.primary}
            style={[styles.searchInput, { color: adminTheme.onSurface }]}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <ThemeToggleButton />
        <NotificationsMenu />
        <TopBarIconButton icon="dns" />
        <View style={styles.profile}>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: adminTheme.onSurface }]}>Super Admin</Text>
            <Text style={[styles.profileRole, { color: adminTheme.onSurfaceVariant }]}>Sistem Yoneticisi</Text>
          </View>
          <Image
            source={{ uri: AVATAR_URI }}
            style={[styles.avatarImg, { borderColor: hexToRgba(adminTheme.primary, 0.2) }]}
            contentFit="cover"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    zIndex: 40,
  },
  searchWrap: {
    minWidth: 200,
    flexGrow: 1,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 14,
    minHeight: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMd,
    paddingVertical: Platform.OS === 'web' ? 8 : 6,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineStyle: 'none',
          borderWidth: 0,
        } as any)
      : {}),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  iconIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 999,
    borderWidth: 2,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  profileText: {
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: 12,
    fontFamily: 'Manrope-Bold',
  },
  profileRole: {
    ...Typography.labelSm,
    fontSize: 10,
    marginTop: 2,
    opacity: 0.85,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
  },
});
