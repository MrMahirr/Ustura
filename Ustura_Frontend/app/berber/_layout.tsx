import React from 'react';
import { Redirect, Slot } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import BarberAdminAside from '@/components/panel/barber-admin/BarberAdminAside';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';

const STAFF_ROLES = ['owner', 'barber', 'receptionist'] as const;
const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 88;

export default function BarberLayout() {
  const { isAuthenticated, role, mustChangePassword } = useAuth();
  const theme = useBarberAdminTheme();
  const { width } = useWindowDimensions();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const isDesktop = width >= 1100;
  const sidebarFixedWeb = Platform.OS === 'web' && isDesktop;
  const sidebarWidth = isDesktop ? (isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : '100%';

  React.useEffect(() => {
    if (!isDesktop && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
  }, [isDesktop, isSidebarCollapsed]);

  if (!isAuthenticated || !role || !STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number])) {
    return <Redirect href="/personel/giris" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/personel/sifre-degistir" />;
  }

  return (
    <View
      className="flex-1"
      style={[
        Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
        {
          backgroundColor: theme.pageBackground,
          flexDirection: isDesktop ? 'row' : 'column',
        },
      ]}>
      <View
        className="flex-shrink-0"
        style={[
          isDesktop ? { width: sidebarWidth, borderRightWidth: 1 } : { width: '100%', borderBottomWidth: 1 },
          sidebarFixedWeb ? ({ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 } as any) : null,
          { borderColor: theme.borderSubtle },
          Platform.OS === 'web'
            ? ({
                transition: 'width 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'width',
                boxShadow: isSidebarCollapsed ? '0 18px 42px rgba(27, 27, 32, 0.06)' : '0 24px 54px rgba(27, 27, 32, 0.1)',
              } as any)
            : null,
        ]}>
        <BarberAdminAside
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
          { backgroundColor: theme.pageBackground },
          sidebarFixedWeb ? { marginLeft: sidebarWidth } : null,
        ]}>
        <Slot />
      </View>
    </View>
  );
}
