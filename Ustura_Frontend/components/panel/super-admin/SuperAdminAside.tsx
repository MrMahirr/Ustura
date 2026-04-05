import type { ComponentProps } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { superAdminAsideItems, type SuperAdminAsideItem } from './aside-nav';
import { useSuperAdminTheme } from './theme';

const INACTIVE_GRAY = '#6B7280';
const OPEN_RAZOR = require('../../../assets/images/panel/superadmin_acık.png');
const CLOSED_RAZOR = require('../../../assets/images/panel/superadmin_kapali.png');

type IconName = ComponentProps<typeof MaterialIcons>['name'];

function normalizePath(path: string) {
  let p = path.split('?')[0];
  p = p.replace(/\/\([^/]+\)/g, '');
  p = p.replace(/\/$/, '') || '/';
  return p;
}

function isItemActive(pathname: string, item: SuperAdminAsideItem) {
  const currentPath = normalizePath(pathname);
  const itemPath = normalizePath(String(item.href ?? ''));

  if (!itemPath) {
    return false;
  }

  if (currentPath === itemPath) {
    return true;
  }

  return Boolean(item.matchSubroutes && itemPath !== '/' && currentPath.startsWith(`${itemPath}/`));
}

function AsideNavRow({
  item,
  isActive,
  isDesktop,
  collapsed,
  primary,
  primaryContainer,
  activeBackground,
  borderSubtle,
}: {
  item: SuperAdminAsideItem;
  isActive: boolean;
  isDesktop: boolean;
  collapsed: boolean;
  primary: string;
  primaryContainer: string;
  activeBackground: string;
  borderSubtle: string;
}) {
  const router = useRouter();
  const href = item.href;
  const handlePress =
    item.disabled || !href
      ? undefined
      : () => {
          router.push(href);
        };

  return (
    <Pressable
      onPress={handlePress}
      disabled={item.disabled}
      accessibilityRole={handlePress ? 'link' : undefined}
      accessibilityLabel={collapsed ? item.label : undefined}
      accessibilityState={{ disabled: item.disabled, selected: isActive }}
      className={cn(
        isDesktop
          ? 'w-full flex-row items-center justify-start px-4 py-3'
          : 'min-h-12 min-w-0 flex-row items-center gap-3 rounded-sm border px-4 py-2.5',
        isDesktop && !collapsed && 'gap-3',
        isDesktop && collapsed && 'min-h-[52px]'
      )}
      style={({ hovered, pressed }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let bg = 'transparent';
        if (isActive || isHovered) {
          bg = activeBackground;
        }

        return [
          {
            backgroundColor: bg,
            borderRightWidth: isActive && isDesktop ? 4 : 0,
            borderRightColor: isActive && isDesktop ? primaryContainer : 'transparent',
            borderColor: isDesktop
              ? 'transparent'
              : isActive
                ? primaryContainer
                : isHovered
                  ? hexToRgba(primary, 0.28)
                  : borderSubtle,
            transform: [{ scale: pressed && !item.disabled ? 0.995 : 1 }],
          },
          Platform.OS === 'web'
            ? ({
                cursor: 'pointer',
                transition:
                  'background-color 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1), padding 420ms cubic-bezier(0.22, 1, 0.36, 1), gap 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              } as any)
            : null,
        ];
      }}>
      {({ hovered }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let fg = INACTIVE_GRAY;
        if (item.disabled) {
          fg = hexToRgba(INACTIVE_GRAY, 0.55);
        } else if (isActive || isHovered) {
          fg = primary;
        }

        return (
          <>
            <View className="w-[22px] shrink-0 items-center justify-center">
              <MaterialIcons name={item.icon as IconName} size={22} color={fg} />
            </View>
            <View
              className={cn('min-w-0 overflow-hidden', collapsed ? 'max-w-0 opacity-0' : 'max-w-40 flex-1')}
              style={[
                Platform.OS === 'web'
                  ? ({
                      transition:
                        'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
                      transformOrigin: 'left center',
                    } as any)
                  : null,
                collapsed
                  ? {
                      transform: [{ translateX: -16 }, { scale: 0.94 }],
                      ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : null),
                    }
                  : null,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={cn('shrink font-label text-[11px] uppercase tracking-[2px]', collapsed && 'opacity-0')}
                style={[
                  {
                    color: fg,
                    fontFamily: isActive ? 'Manrope-SemiBold' : 'Manrope-Medium',
                  },
                  Platform.OS === 'web'
                    ? ({
                        transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                      } as any)
                    : null,
                  collapsed ? { transform: [{ translateX: -10 }] } : null,
                ]}>
                {item.label}
              </Text>
            </View>
          </>
        );
      }}
    </Pressable>
  );
}

export default function SuperAdminAside({
  items = superAdminAsideItems,
  collapsed = false,
  onToggleCollapse,
}: {
  items?: SuperAdminAsideItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const {
    primary,
    primaryContainer,
    onSurfaceVariant,
    sidebarBackground,
    sidebarActiveBackground,
    borderSubtle,
  } = useSuperAdminTheme();

  const isDesktop = width >= 1100;
  const canCollapse = isDesktop && typeof onToggleCollapse === 'function';
  const subtitleColor = hexToRgba(onSurfaceVariant, 0.6);

  return (
    <View
      className={cn('flex-1', isDesktop ? 'py-6' : 'w-full px-4 pb-3 pt-4')}
      style={[
        { backgroundColor: sidebarBackground },
        Platform.OS === 'web' && isDesktop ? ({ height: '100vh' } as any) : null,
      ]}>
      <View className={cn(collapsed ? 'mb-2 px-2.5' : 'mb-8 px-5')}>
        <View className={cn('flex-row gap-3', collapsed ? 'items-center justify-center gap-0' : 'items-start justify-between')}>
          <View
            className="min-w-0 flex-1 overflow-hidden"
            style={[
              Platform.OS === 'web'
                ? ({
                    transition:
                      'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), max-height 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
                    transformOrigin: 'left center',
                  } as any)
                : null,
              collapsed
                ? {
                    maxWidth: 0,
                    maxHeight: 0,
                    opacity: 0,
                    transform: [{ translateX: -18 }, { scale: 0.92 }],
                    ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : null),
                  }
                : {
                    maxWidth: 168,
                    maxHeight: 52,
                  },
            ]}>
            <Text
              className={cn('font-headline text-2xl tracking-[-0.8px]', collapsed && 'opacity-0')}
              style={[
                { color: primary, fontWeight: '900' },
                Platform.OS === 'web'
                  ? ({
                      transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                    } as any)
                  : null,
                collapsed ? { transform: [{ translateX: -14 }] } : null,
              ]}>
              USTURA
            </Text>
            <Text
              className={cn('mt-1 font-label text-[10px] uppercase tracking-[2.4px]', collapsed && 'opacity-0')}
              style={[
                { color: subtitleColor },
                Platform.OS === 'web'
                  ? ({
                      transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                    } as any)
                  : null,
                collapsed ? { transform: [{ translateX: -12 }] } : null,
              ]}>
              SaaS Platform
            </Text>
          </View>

          {canCollapse ? (
            <Pressable
              onPress={onToggleCollapse}
              accessibilityRole="button"
              accessibilityLabel={collapsed ? 'Aside paneli genislet' : 'Aside paneli daralt'}
              className="h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-2xl border"
              style={({ hovered, pressed }) => [
                {
                  backgroundColor: hovered ? sidebarActiveBackground : 'transparent',
                  borderColor: hovered || collapsed ? borderSubtle : 'transparent',
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
                Platform.OS === 'web'
                  ? ({
                      cursor: 'pointer',
                      transition:
                        'background-color 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                    } as any)
                  : null,
              ]}>
              <View className="relative h-[42px] w-[42px]">
                <Image
                  source={OPEN_RAZOR}
                  style={[
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 42,
                      height: 42,
                    },
                    Platform.OS === 'web'
                      ? ({
                          transition:
                            'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                          willChange: 'opacity, transform, filter',
                        } as any)
                      : null,
                    collapsed
                      ? {
                          opacity: 0,
                          transform: [{ scale: 0.76 }, { rotate: '-14deg' }, { translateY: 3 }],
                          ...(Platform.OS === 'web' ? ({ filter: 'blur(7px) saturate(0.8)' } as any) : null),
                        }
                      : {
                          opacity: 1,
                          transform: [{ scale: 1 }, { rotate: '0deg' }, { translateY: 0 }],
                          ...(Platform.OS === 'web' ? ({ filter: 'blur(0px) saturate(1)' } as any) : null),
                        },
                  ]}
                  contentFit="contain"
                />
                <Image
                  source={CLOSED_RAZOR}
                  style={[
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 42,
                      height: 42,
                    },
                    Platform.OS === 'web'
                      ? ({
                          transition:
                            'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                          willChange: 'opacity, transform, filter',
                        } as any)
                      : null,
                    collapsed
                      ? {
                          opacity: 1,
                          transform: [{ scale: 1 }, { rotate: '0deg' }, { translateY: 0 }],
                          ...(Platform.OS === 'web' ? ({ filter: 'blur(0px) saturate(1)' } as any) : null),
                        }
                      : {
                          opacity: 0,
                          transform: [{ scale: 0.76 }, { rotate: '-14deg' }, { translateY: 3 }],
                          ...(Platform.OS === 'web' ? ({ filter: 'blur(7px) saturate(0.8)' } as any) : null),
                        },
                  ]}
                  contentFit="contain"
                />
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>

      {isDesktop ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}>
          <View className={cn(collapsed ? 'w-full gap-2 px-0' : 'gap-1')}>
            {items.map((item) => (
              <AsideNavRow
                key={item.label}
                item={item}
                isActive={isItemActive(pathname, item)}
                isDesktop
                collapsed={collapsed}
                primary={primary}
                primaryContainer={primaryContainer}
                activeBackground={sidebarActiveBackground}
                borderSubtle={borderSubtle}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 4, paddingBottom: 4 }}>
          {items.map((item) => (
            <View key={item.label} style={{ minWidth: 168 }}>
              <AsideNavRow
                item={item}
                isActive={isItemActive(pathname, item)}
                isDesktop={false}
                collapsed={false}
                primary={primary}
                primaryContainer={primaryContainer}
                activeBackground={sidebarActiveBackground}
                borderSubtle={borderSubtle}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {isDesktop ? (
        <View
          className={cn('mt-auto border-t pt-6', collapsed ? 'px-2.5' : 'px-4')}
          style={{ borderTopColor: borderSubtle }}>
          <Pressable style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null}>
            {({ hovered }) => {
              const fg = Platform.OS === 'web' && hovered ? primary : INACTIVE_GRAY;

              return (
                <View
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={Platform.OS === 'web' ? ({ transition: 'color 180ms ease' } as any) : null}>
                  <MaterialIcons name="logout" size={22} color={fg} />
                  <View
                    className={cn('overflow-hidden', collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px]')}
                    style={[
                      Platform.OS === 'web'
                        ? ({
                            transition:
                              'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
                            transformOrigin: 'left center',
                          } as any)
                        : null,
                      collapsed
                        ? {
                            transform: [{ translateX: -16 }, { scale: 0.94 }],
                            ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : null),
                          }
                        : null,
                    ]}>
                    <Text
                      className={cn('shrink font-label text-[11px] uppercase tracking-[2px]', collapsed && 'opacity-0')}
                      style={[
                        { color: fg, fontFamily: 'Manrope-Medium' },
                        Platform.OS === 'web'
                          ? ({
                              transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                            } as any)
                          : null,
                        collapsed ? { transform: [{ translateX: -10 }] } : null,
                      ]}>
                      Cikis Yap
                    </Text>
                  </View>
                </View>
              );
            }}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
