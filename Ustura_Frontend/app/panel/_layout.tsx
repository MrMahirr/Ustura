import React from 'react';
import { Slot } from 'expo-router';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import SuperAdminAside from '@/components/panel/super-admin/SuperAdminAside';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 88;

export default function PanelLayout() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const isDesktop = width >= 1100;
  const sidebarFixedWeb = Platform.OS === 'web' && isDesktop;
  const sidebarWidth = isDesktop ? (isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : '100%';

  React.useEffect(() => {
    if (!isDesktop && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
  }, [isDesktop, isSidebarCollapsed]);

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' ? styles.webContainer : null,
        {
          backgroundColor: adminTheme.pageBackground,
          flexDirection: isDesktop ? 'row' : 'column',
        },
      ]}>
      <View
        style={[
          styles.sidebar,
          isDesktop ? styles.sidebarDesktop : styles.sidebarMobile,
          sidebarFixedWeb ? styles.sidebarWebFixed : null,
          {
            borderColor: adminTheme.borderSubtle,
            width: sidebarWidth,
            ...(Platform.OS === 'web'
              ? ({
                  boxShadow: isSidebarCollapsed
                    ? '0 18px 42px rgba(27, 27, 32, 0.06)'
                    : '0 24px 54px rgba(27, 27, 32, 0.1)',
                } as any)
              : null),
          },
        ]}>
        <SuperAdminAside
          collapsed={isDesktop ? isSidebarCollapsed : false}
          onToggleCollapse={
            isDesktop
              ? () => {
                  setIsSidebarCollapsed((prev) => !prev);
                }
              : undefined
          }
        />
      </View>
      <View
        style={[
          styles.content,
          Platform.OS === 'web' ? styles.webContent : null,
          { backgroundColor: adminTheme.pageBackground },
          sidebarFixedWeb ? { marginLeft: sidebarWidth } : null,
        ]}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    minHeight: '100vh',
  } as any,
  sidebar: {
    flexShrink: 0,
    borderRightWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'width 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'width',
        } as any)
      : {}),
  },
  sidebarDesktop: {
    width: SIDEBAR_WIDTH,
  },
  sidebarMobile: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
  },
  sidebarWebFixed: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    zIndex: 50,
  } as any,
  content: {
    flex: 1,
    minWidth: 0,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'margin-left 480ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'margin-left',
        } as any)
      : {}),
  },
  webContent: {
    minHeight: '100vh',
  } as any,
});
