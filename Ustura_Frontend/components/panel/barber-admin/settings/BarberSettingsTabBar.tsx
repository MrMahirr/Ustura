import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';
import { getBarberTabStyle, getBarberWebTransition } from './presentation';
import type { BarberSettingsTab, BarberSettingsTabId } from './types';

interface Props {
  tabs: BarberSettingsTab[];
  activeTab: BarberSettingsTabId;
  onTabChange: (tab: BarberSettingsTabId) => void;
}

export default function BarberSettingsTabBar({ tabs, activeTab, onTabChange }: Props) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View className="border-b" style={{ borderBottomColor: theme.borderSubtle }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: isMobile ? 0 : 4 }}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const tabStyle = getBarberTabStyle(theme, isActive);

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
                getBarberWebTransition(),
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
