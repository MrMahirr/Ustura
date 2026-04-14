import type { ComponentProps } from 'react';
import { Link, usePathname, type Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { panelRoutes } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

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
  { label: 'Kullanicilar', icon: 'group', disabled: true },
  { label: 'Personel', icon: 'badge', href: panelRoutes.personel },
  { label: 'Odemeler', icon: 'payments', disabled: true },
  { label: 'Paketler', icon: 'inventory-2', disabled: true },
  { label: 'Raporlar', icon: 'analytics', disabled: true },
  { label: 'Bildirimler', icon: 'notifications', disabled: true },
  { label: 'Sistem Ayarlari', icon: 'settings', href: panelRoutes.ayarlar },
];

function normalizePath(path: string) {
  let nextPath = path.split('?')[0];
  nextPath = nextPath.replace(/\/\([^/]+\)/g, '');
  nextPath = nextPath.replace(/\/$/, '') || '/';
  return nextPath;
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
      className={isDesktop ? 'w-full flex-row items-center gap-3 px-4 py-3' : 'min-h-12 flex-row items-center gap-2.5 rounded-sm border px-4 py-2.5'}
      disabled={item.disabled}
      style={({ hovered, pressed }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;
        const backgroundColor = isActive || isHovered ? surfaceContainerLow : 'transparent';

        return [
          !isDesktop ? { borderColor: 'rgba(255,255,255,0.06)' } : null,
          Platform.OS === 'web' && isDesktop
            ? ({ cursor: 'pointer', transition: 'background-color 180ms ease, color 180ms ease' } as any)
            : null,
          {
            backgroundColor,
            borderRightWidth: isActive && isDesktop ? 4 : 0,
            borderRightColor: isActive && isDesktop ? primaryContainer : 'transparent',
            transform: [{ scale: pressed && !item.disabled ? 0.995 : 1 }],
          },
        ];
      }}>
      {({ hovered }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let color = INACTIVE_NAV_GRAY;
        if (item.disabled) {
          color = hexToRgba(INACTIVE_NAV_GRAY, 0.55);
        } else if (isActive || isHovered) {
          color = primary;
        }

        return (
          <>
            <MaterialIcons name={item.icon} size={22} color={color} />
            <Text className="flex-1 font-body text-[11px] uppercase tracking-[1.6px]" style={{ color, fontFamily: isActive ? 'Manrope-SemiBold' : 'Manrope-Medium' }}>
              {item.label}
            </Text>
            {item.badge ? (
              <View className="rounded-full px-2 py-1" style={{ backgroundColor: hexToRgba(primary, 0.12) }}>
                <Text className="font-label text-[9px]" style={{ color: primary }}>
                  {item.badge}
                </Text>
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
      className="flex-1"
      style={[
        isDesktop ? { paddingVertical: 24 } : { width: '100%', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
        Platform.OS === 'web' && isDesktop ? ({ height: '100vh' } as any) : null,
        { backgroundColor: surface },
      ]}>
      <View className="mb-10 px-6">
        <Text className="font-headline text-2xl font-black tracking-tight" style={{ color: primary }}>
          USTURA
        </Text>
        <Text className="mt-1 font-body text-[10px] font-bold uppercase tracking-[2.4px]" style={{ color: hexToRgba(onSurfaceVariant, 0.6) }}>
          SaaS Platform
        </Text>
      </View>

      {isDesktop ? (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          <View className="gap-1">
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {items.map((item) => (
            <View key={item.label} style={{ minWidth: 168 }}>
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
        <View className="mt-auto border-t px-4 pt-6" style={{ borderTopColor: surfaceContainerLow }}>
          <Pressable style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}>
            {({ hovered }) => {
              const color = Platform.OS === 'web' && hovered ? primary : INACTIVE_NAV_GRAY;
              return (
                <View
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={Platform.OS === 'web' ? ({ transition: 'color 180ms ease' } as any) : undefined}>
                  <MaterialIcons name="logout" size={22} color={color} />
                  <Text className="font-body text-[11px] uppercase tracking-[1.6px]" style={{ color, fontFamily: 'Manrope-Medium' }}>
                    Cikis Yap
                  </Text>
                </View>
              );
            }}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
