import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingDetailSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  children: React.ReactNode;
}

export default function CustomerBookingDetailSection({
  title,
  subtitle,
  icon,
  children,
}: CustomerBookingDetailSectionProps) {
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="rounded-[22px] border p-5"
      style={{
        gap: 18,
        backgroundColor: surfaceContainerLow,
        borderColor: hexToRgba(outlineVariant, 0.2),
      }}>
      <View className="flex-row items-start" style={{ gap: 14 }}>
        <View
          className="h-11 w-11 items-center justify-center rounded-[14px]"
          style={{ backgroundColor: hexToRgba(primary, 0.12) }}>
          <MaterialIcons name={icon} size={20} color={primary} />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Text className="font-headline text-2xl font-bold" style={{ color: onSurface }}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="font-body text-sm" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {children}
    </View>
  );
}
