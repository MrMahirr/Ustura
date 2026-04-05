import React from 'react';
import { Slot } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';

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
      className="flex-1"
      style={[
        Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
        {
          backgroundColor: adminTheme.pageBackground,
          flexDirection: isDesktop ? 'row' : 'column',
        },
      ]}>
      <View
        className="flex-shrink-0"
        style={[
          isDesktop ? { width: sidebarWidth, borderRightWidth: 1 } : { width: '100%', borderBottomWidth: 1 },
          sidebarFixedWeb ? ({ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 } as any) : null,
          { borderColor: adminTheme.borderSubtle },
          Platform.OS === 'web'
            ? ({
                transition: 'width 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'width',
                boxShadow: isSidebarCollapsed ? '0 18px 42px rgba(27, 27, 32, 0.06)' : '0 24px 54px rgba(27, 27, 32, 0.1)',
              } as any)
            : null,
        ]}>
        <SuperAdminAside
          collapsed={isDesktop ? isSidebarCollapsed : false}
          onToggleCollapse={
            isDesktop
              ? () => {
                  setIsSidebarCollapsed((previous) => !previous);
                }
              : undefined
          }
        />
      </View>
      <View
        className="min-w-0 flex-1"
        style={[
          Platform.OS === 'web'
            ? ({
                minHeight: '100vh',
                transition: 'margin-left 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'margin-left',
              } as any)
            : null,
          { backgroundColor: adminTheme.pageBackground },
          sidebarFixedWeb ? { marginLeft: sidebarWidth } : null,
        ]}>
        <Slot />
      </View>
    </View>
  );
}
