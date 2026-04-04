import type { ComponentProps } from 'react';
import { Link, usePathname, type Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { panelRoutes } from '@/constants/routes';
import { Typography } from '@/constants/typography';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

/** Tailwind `text-gray-500` — HTML mock inactive nav color */
const INACTIVE_NAV_GRAY = '#6B7280';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface SidebarItem {
  label: string;
  icon: IconName;
  href?: Href;
  disabled?: boolean;
  badge?: string;
}

const defaultItems: SidebarItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: panelRoutes.home },
  { label: 'Salonlar', icon: 'storefront', disabled: true },
  { label: 'Kullanıcılar', icon: 'group', disabled: true },
  { label: 'Randevular', icon: 'event-available', href: panelRoutes.randevular },
  { label: 'Berber', icon: 'content-cut', href: panelRoutes.berber },
  { label: 'Personel', icon: 'badge', href: panelRoutes.personel },
  { label: 'Ödemeler', icon: 'payments', disabled: true },
  { label: 'Paketler', icon: 'inventory-2', disabled: true },
  { label: 'Raporlar', icon: 'analytics', disabled: true },
  { label: 'Bildirimler', icon: 'notifications', disabled: true },
  { label: 'Sistem Ayarları', icon: 'settings', href: panelRoutes.ayarlar },
];

function normalizePath(path: string) {
  let p = path.split('?')[0];
  p = p.replace(/\/\([^/]+\)/g, '');
  p = p.replace(/\/$/, '') || '/';
  return p;
}

function SidebarNavLink({
  item,
  isActive,
  isDesktop,
  primary,
  primaryContainer,
  surfaceContainerLow,
}: {
  item: SidebarItem;
  isActive: boolean;
  isDesktop: boolean;
  primary: string;
  primaryContainer: string;
  surfaceContainerLow: string;
}) {
  const content = (
    <Pressable
      disabled={item.disabled}
      style={({ hovered, pressed }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let bg = 'transparent';
        if (isActive) {
          bg = surfaceContainerLow;
        } else if (isHovered) {
          bg = surfaceContainerLow;
        }

        return [
          isDesktop ? styles.desktopLink : styles.mobileLink,
          {
            backgroundColor: bg,
            borderRightWidth: isActive && isDesktop ? 4 : 0,
            borderRightColor: isActive && isDesktop ? primaryContainer : 'transparent',
            transform: [{ scale: pressed && !item.disabled ? 0.995 : 1 }],
          },
        ];
      }}>
      {({ hovered }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let fg = INACTIVE_NAV_GRAY;
        if (item.disabled) {
          fg = hexToRgba(INACTIVE_NAV_GRAY, 0.55);
        } else if (isActive) {
          fg = primary;
        } else if (isHovered) {
          fg = primary;
        }

        return (
          <>
            <MaterialIcons name={item.icon} size={22} color={fg} />
            <Text
              style={[
                styles.linkLabel,
                {
                  color: fg,
                  fontFamily: isActive ? 'Manrope-SemiBold' : 'Manrope-Medium',
                },
              ]}>
              {item.label}
            </Text>
            {item.badge ? (
              <View style={[styles.linkBadge, { backgroundColor: hexToRgba(primary, 0.12) }]}>
                <Text style={[styles.linkBadgeText, { color: primary }]}>{item.badge}</Text>
              </View>
            ) : null}
          </>
        );
      }}
    </Pressable>
  );

  if (!item.href || item.disabled) {
    return content;
  }

  return (
    <Link href={item.href} asChild>
      {content}
    </Link>
  );
}

export default function Sidebar({ items = defaultItems }: { items?: SidebarItem[] }) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const isDesktop = width >= 1100;

  return (
    <View
      style={[
        styles.container,
        isDesktop ? styles.desktopContainer : styles.mobileContainer,
        Platform.OS === 'web' && isDesktop ? styles.desktopWebContainer : null,
        { backgroundColor: surface },
      ]}>
      <View style={styles.brandArea}>
        <Text style={[styles.brand, { color: primary }]}>USTURA</Text>
        <Text style={[styles.brandSubtitle, { color: hexToRgba(onSurfaceVariant, 0.6) }]}>SaaS Platform</Text>
      </View>

      {isDesktop ? (
        <ScrollView style={styles.desktopScroll} contentContainerStyle={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.navBlock}>
            {items.map((item) => (
              <SidebarNavLink
                key={item.label}
                item={item}
                isActive={normalizePath(pathname) === normalizePath(String(item.href ?? ''))}
                isDesktop
                primary={primary}
                primaryContainer={primaryContainer}
                surfaceContainerLow={surfaceContainerLow}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mobileScrollContent}>
          {items.map((item) => (
            <View key={item.label} style={styles.mobileItem}>
              <SidebarNavLink
                item={item}
                isActive={normalizePath(pathname) === normalizePath(String(item.href ?? ''))}
                isDesktop={false}
                primary={primary}
                primaryContainer={primaryContainer}
                surfaceContainerLow={surfaceContainerLow}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {isDesktop ? (
        <View style={[styles.logoutSection, { borderTopColor: surfaceContainerLow }]}>
          <Pressable style={styles.logoutPressable}>
            {({ hovered }) => {
              const fg =
                Platform.OS === 'web' && hovered ? primary : INACTIVE_NAV_GRAY;
              return (
                <View style={styles.logoutRow}>
                  <MaterialIcons name="logout" size={22} color={fg} />
                  <Text style={[styles.logoutLabel, { color: fg }]}>Çıkış Yap</Text>
                </View>
              );
            }}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopContainer: {
    paddingVertical: 24,
  },
  desktopWebContainer: {
    height: '100vh',
  } as any,
  mobileContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandArea: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  brand: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  navBlock: {
    gap: 4,
  },
  mobileScrollContent: {
    gap: 8,
    paddingBottom: 4,
  },
  mobileItem: {
    minWidth: 168,
  },
  desktopLink: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 0,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'background-color 180ms ease, color 180ms ease',
        } as any)
      : {}),
  },
  mobileLink: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  linkLabel: {
    flex: 1,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  linkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  linkBadgeText: {
    ...Typography.labelSm,
    fontSize: 9,
  },
  logoutSection: {
    borderTopWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    marginTop: 'auto',
  },
  logoutPressable: {
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'color 180ms ease',
        } as any)
      : {}),
  },
  logoutLabel: {
    fontSize: 11,
    fontFamily: 'Manrope-Medium',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
