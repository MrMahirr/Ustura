import type { ComponentProps } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

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
      style={({ hovered, pressed }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let bg = 'transparent';
        if (isActive) {
          bg = activeBackground;
        } else if (isHovered) {
          bg = activeBackground;
        }

        return [
          isDesktop ? (collapsed ? styles.desktopLinkCollapsed : styles.desktopLink) : styles.mobileLink,
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
        ];
      }}>
      {({ hovered }) => {
        const canHover = isDesktop && Platform.OS === 'web';
        const isHovered = canHover && hovered && !item.disabled;

        let fg = INACTIVE_GRAY;
        if (item.disabled) {
          fg = hexToRgba(INACTIVE_GRAY, 0.55);
        } else if (isActive) {
          fg = primary;
        } else if (isHovered) {
          fg = primary;
        }

        return (
          <>
            <View style={styles.linkIconWrap}>
              <MaterialIcons name={item.icon as IconName} size={22} color={fg} />
            </View>
            <View style={[styles.linkLabelWrap, collapsed ? styles.linkLabelWrapCollapsed : null]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.linkLabel,
                  collapsed ? styles.linkLabelCollapsed : null,
                  {
                    color: fg,
                    fontFamily: isActive ? 'Manrope-SemiBold' : 'Manrope-Medium',
                  },
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
      style={[
        styles.container,
        isDesktop ? styles.desktopContainer : styles.mobileContainer,
        Platform.OS === 'web' && isDesktop ? styles.desktopWebContainer : null,
        { backgroundColor: sidebarBackground },
      ]}>
      <View style={[styles.brandArea, collapsed ? styles.brandAreaCollapsed : null]}>
        <View style={[styles.brandRow, collapsed ? styles.brandRowCollapsed : null]}>
          <View style={[styles.brandCopy, collapsed ? styles.brandCopyCollapsed : null]}>
            <Text style={[styles.brand, collapsed ? styles.brandCollapsed : null, { color: primary }]}>USTURA</Text>
            <Text style={[styles.brandSubtitle, collapsed ? styles.brandSubtitleCollapsed : null, { color: subtitleColor }]}>
              SaaS Platform
            </Text>
          </View>

          {canCollapse ? (
            <Pressable
              onPress={onToggleCollapse}
              accessibilityRole="button"
              accessibilityLabel={collapsed ? 'Aside paneli genislet' : 'Aside paneli daralt'}
              style={({ hovered, pressed }) => [
                styles.toggleButton,
                {
                  backgroundColor: hovered ? sidebarActiveBackground : 'transparent',
                  borderColor: hovered || collapsed ? borderSubtle : 'transparent',
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}>
              <View style={styles.toggleIconStack}>
                <Image
                  source={OPEN_RAZOR}
                  style={[
                    styles.toggleIconLayer,
                    styles.toggleIcon,
                    collapsed ? styles.toggleIconHidden : styles.toggleIconVisible,
                  ]}
                  contentFit="contain"
                />
                <Image
                  source={CLOSED_RAZOR}
                  style={[
                    styles.toggleIconLayer,
                    styles.toggleIcon,
                    collapsed ? styles.toggleIconVisible : styles.toggleIconHidden,
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
          style={styles.desktopScroll}
          contentContainerStyle={[
            styles.desktopScrollContent,
            collapsed ? styles.desktopScrollContentCollapsed : null,
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.navBlock, collapsed ? styles.navBlockCollapsed : null]}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mobileScrollContent}>
          {items.map((item) => (
            <View key={item.label} style={styles.mobileItem}>
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
          style={[
            styles.logoutSection,
            collapsed ? styles.logoutSectionCollapsed : null,
            { borderTopColor: borderSubtle },
          ]}>
          <Pressable style={styles.logoutPressable}>
            {({ hovered }) => {
              const fg = Platform.OS === 'web' && hovered ? primary : INACTIVE_GRAY;

              return (
                <View style={[styles.logoutRow, collapsed ? styles.logoutRowCollapsed : null]}>
                  <MaterialIcons name="logout" size={22} color={fg} />
                  <View style={[styles.logoutLabelWrap, collapsed ? styles.logoutLabelWrapCollapsed : null]}>
                    <Text style={[styles.logoutLabel, collapsed ? styles.logoutLabelCollapsed : null, { color: fg }]}>
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
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  brandAreaCollapsed: {
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandRowCollapsed: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
    maxWidth: 168,
    maxHeight: 52,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          transition:
            'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), max-height 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
          transformOrigin: 'left center',
        } as any)
      : {}),
  },
  brandCopyCollapsed: {
    maxWidth: 0,
    maxHeight: 0,
    opacity: 0,
    transform: [{ translateX: -18 }, { scale: 0.92 }],
    ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : {}),
  },
  brand: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  brandCollapsed: {
    opacity: 0,
    transform: [{ translateX: -14 }],
  },
  brandSubtitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginTop: 4,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  brandSubtitleCollapsed: {
    opacity: 0,
    transform: [{ translateX: -12 }],
  },
  toggleButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition:
            'background-color 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  toggleIconStack: {
    width: 42,
    height: 42,
    position: 'relative',
  },
  toggleIconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  } as any,
  toggleIcon: {
    width: 42,
    height: 42,
    ...(Platform.OS === 'web'
      ? ({
          transition:
            'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'opacity, transform, filter',
        } as any)
      : {}),
  },
  toggleIconVisible: {
    opacity: 1,
    transform: [{ scale: 1 }, { rotate: '0deg' }, { translateY: 0 }],
    ...(Platform.OS === 'web' ? ({ filter: 'blur(0px) saturate(1)' } as any) : {}),
  },
  toggleIconHidden: {
    opacity: 0,
    transform: [{ scale: 0.76 }, { rotate: '-14deg' }, { translateY: 3 }],
    ...(Platform.OS === 'web' ? ({ filter: 'blur(7px) saturate(0.8)' } as any) : {}),
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  desktopScrollContentCollapsed: {
    alignItems: 'stretch',
  },
  navBlock: {
    gap: 4,
  },
  navBlockCollapsed: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 0,
  },
  mobileScrollContent: {
    gap: 4,
    paddingBottom: 4,
  },
  mobileItem: {
    minWidth: 168,
  },
  desktopLink: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 0,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition:
            'background-color 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1), padding 420ms cubic-bezier(0.22, 1, 0.36, 1), gap 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  desktopLinkCollapsed: {
    width: '100%',
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition:
            'background-color 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1), padding 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  linkIconWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  linkLabelWrap: {
    flex: 1,
    minWidth: 0,
    maxWidth: 160,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          transition:
            'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
          transformOrigin: 'left center',
        } as any)
      : {}),
  },
  linkLabelWrapCollapsed: {
    flex: 0,
    maxWidth: 0,
    opacity: 0,
    transform: [{ translateX: -16 }, { scale: 0.94 }],
    ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : {}),
  },
  mobileLink: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 12,
    borderWidth: 1,
    minWidth: 0,
  },
  linkLabel: {
    ...Typography.labelSm,
    flexShrink: 1,
    fontSize: 11,
    letterSpacing: 2,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  linkLabelCollapsed: {
    opacity: 0,
    transform: [{ translateX: -10 }],
  },
  logoutSection: {
    borderTopWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    marginTop: 'auto',
  },
  logoutSectionCollapsed: {
    paddingHorizontal: 10,
  },
  logoutPressable: {
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 0,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'color 180ms ease',
        } as any)
      : {}),
  },
  logoutRowCollapsed: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  logoutLabelWrap: {
    overflow: 'hidden',
    maxWidth: 140,
    ...(Platform.OS === 'web'
      ? ({
          transition:
            'max-width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
          transformOrigin: 'left center',
        } as any)
      : {}),
  },
  logoutLabelWrapCollapsed: {
    maxWidth: 0,
    opacity: 0,
    transform: [{ translateX: -16 }, { scale: 0.94 }],
    ...(Platform.OS === 'web' ? ({ filter: 'blur(6px)' } as any) : {}),
  },
  logoutLabel: {
    ...Typography.labelSm,
    flexShrink: 1,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'Manrope-Medium',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  logoutLabelCollapsed: {
    opacity: 0,
    transform: [{ translateX: -10 }],
  },
});
