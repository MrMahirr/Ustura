import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { getSettingsTabStyle, getWebTransition } from './presentation';
import type { SettingsTab, SettingsTabId } from './types';

interface SettingsTabBarProps {
  tabs: SettingsTab[];
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export default function SettingsTabBar({ tabs, activeTab, onTabChange }: SettingsTabBarProps) {
  const { width } = useWindowDimensions();
  const theme = useSuperAdminTheme();
  const isMobile = width < 768;

  return (
    <View
      className="border-b"
      style={{ borderBottomColor: theme.borderSubtle }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: isMobile ? 0 : 4,
        }}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const tabStyle = getSettingsTabStyle(theme, isActive);

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[
                tabStyle,
                {
                  paddingHorizontal: isMobile ? 14 : 20,
                  paddingVertical: isMobile ? 12 : 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                },
                getWebTransition(),
              ]}>
              <MaterialIcons
                name={tab.icon}
                size={isMobile ? 16 : 18}
                color={isActive ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.6)}
              />
              <Text
                style={{
                  color: isActive ? theme.primary : theme.onSurfaceVariant,
                  fontFamily: 'Manrope-Bold',
                  fontSize: isMobile ? 12 : 13,
                  letterSpacing: 0.3,
                }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
