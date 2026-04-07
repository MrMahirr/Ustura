import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { CustomerBookingsTabId, CustomerBookingsTabOption } from '@/components/customer-bookings/presentation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingsTabsProps {
  tabs: CustomerBookingsTabOption[];
  activeTab: CustomerBookingsTabId;
  counts: Record<CustomerBookingsTabId, number>;
  onChange: (tabId: CustomerBookingsTabId) => void;
}

export default function CustomerBookingsTabs({
  tabs,
  activeTab,
  counts,
  onChange,
}: CustomerBookingsTabsProps) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 28,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(outlineVariant, 0.18),
      }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tab.id)}
            style={{ paddingBottom: 16 }}>
            {({ hovered }) => (
              <View style={{ gap: 6 }}>
                <Text
                  className="font-label text-xs font-bold uppercase tracking-[3px]"
                  style={{ color: isActive || hovered ? primary : onSurfaceVariant }}>
                  {tab.label}
                </Text>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View
                    className="h-0.5 rounded-full"
                    style={{
                      width: 48,
                      backgroundColor: primary,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  <Text className="font-body text-xs font-semibold" style={{ color: isActive ? onSurface : onSurfaceVariant }}>
                    {counts[tab.id]}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
