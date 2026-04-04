import React from 'react';
import { Slot } from 'expo-router';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

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
      style={[
        styles.container,
        Platform.OS === 'web' ? styles.webContainer : null,
        {
          backgroundColor: neutral,
          flexDirection: isDesktop ? 'row' : 'column',
        },
      ]}>
      <View
        style={[
          styles.sidebar,
          isDesktop ? styles.sidebarDesktop : styles.sidebarMobile,
          sidebarFixedWeb ? styles.sidebarWebFixed : null,
          { borderColor: surfaceContainerLow },
        ]}>
        <Sidebar />
      </View>
      <View
        style={[
          styles.content,
          Platform.OS === 'web' ? styles.webContent : null,
          sidebarFixedWeb ? { marginLeft: SIDEBAR_WIDTH } : null,
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
  },
  webContent: {
    minHeight: '100vh',
  } as any,
});
