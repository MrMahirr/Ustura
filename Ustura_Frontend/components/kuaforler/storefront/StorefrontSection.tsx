import React, { type ReactNode } from 'react';
import { Platform, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface StorefrontSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function StorefrontSection({
  eyebrow,
  title,
  description,
  children,
}: StorefrontSectionProps) {
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <View
      className="overflow-hidden rounded-[30px] border p-6"
      style={[
        {
          backgroundColor: surfaceContainerLowest,
          borderColor: outlineVariant,
        },
        Platform.OS === 'web'
          ? ({
              boxShadow: `0 18px 40px ${hexToRgba(primary, 0.08)}`,
              transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 240ms ease',
            } as any)
          : {
              shadowColor: primary,
              shadowOpacity: 0.08,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 5,
            },
      ]}>
      <Text
        className="mb-2 font-label text-xs uppercase tracking-[2.4px]"
        style={{ color: onSurfaceVariant }}>
        {eyebrow}
      </Text>
      <Text
        className="font-headline text-[28px] font-bold leading-[34px]"
        style={{ color: onSurface }}>
        {title}
      </Text>
      {description ? (
        <Text
          className="mt-3 text-base leading-7"
          style={{ color: hexToRgba(onSurfaceVariant, 0.94) }}>
          {description}
        </Text>
      ) : null}

      <View className="mt-6">{children}</View>
    </View>
  );
}
