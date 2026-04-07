import React from 'react';
import { Slot } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';

import Sidebar from '@/components/layout/Sidebar';
import { useThemeColor } from '@/hooks/use-theme-color';

const SIDEBAR_WIDTH = 256;

export default function PanelLayout() {
  const { width } = useWindowDimensions();
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const neutral = useThemeColor({}, 'neutral');
  const isDesktop = width >= 1100;
  const sidebarFixedWeb = Platform.OS === 'web' && isDesktop;

  return (
    <View
      className="flex-1"
      style={[
        Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
        {
          backgroundColor: neutral,
          flexDirection: isDesktop ? 'row' : 'column',
        },
      ]}>
      <View
        className="flex-shrink-0"
        style={[
          isDesktop ? { width: SIDEBAR_WIDTH, borderRightWidth: 1 } : { width: '100%', borderBottomWidth: 1 },
          sidebarFixedWeb ? ({ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 } as any) : null,
          { borderColor: surfaceContainerLow },
        ]}>
        <Sidebar />
      </View>
      <View
        className="min-w-0 flex-1"
        style={[
          Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
          sidebarFixedWeb ? { marginLeft: SIDEBAR_WIDTH } : null,
        ]}>
        <Slot />
      </View>
    </View>
  );
}
